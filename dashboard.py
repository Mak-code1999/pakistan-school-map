"""
Maktab GIS - Interactive Dashboard with Streamlit, Plotly, and PyDeck
Run with: streamlit run dashboard.py
"""

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import requests
import pydeck as pdk
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Maktab GIS Dashboard",
    page_icon="🏫",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .stMetric {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 10px;
        backdrop-filter: blur(10px);
    }
    h1, h2, h3 {
        color: #ffffff;
    }
</style>
""", unsafe_allow_html=True)

# API Configuration
API_URL = "http://127.0.0.1:8000/api"

@st.cache_data(ttl=60)
def fetch_schools():
    """Fetch all schools from API"""
    try:
        response = requests.get(f"{API_URL}/schools/")
        if response.status_code == 200:
            data = response.json()
            schools = []
            for feature in data['features']:
                props = feature['properties']
                coords = feature['geometry']['coordinates']
                schools.append({
                    'id': props['id'],
                    'name': props['name'],
                    'category': props['category'],
                    'district': props.get('district_name', 'Unknown'),
                    'province': props.get('province_name', 'Unknown'),
                    'students': props.get('num_students', 0),
                    'teachers': props.get('num_teachers', 0),
                    'classrooms': props.get('num_classrooms', 0),
                    'year': props.get('establishment_year'),
                    'library': props.get('has_library', False),
                    'computer_lab': props.get('has_computer_lab', False),
                    'playground': props.get('has_playground', False),
                    'longitude': coords[0],
                    'latitude': coords[1]
                })
            return pd.DataFrame(schools)
        return pd.DataFrame()
    except Exception as e:
        st.error(f"Error fetching schools: {e}")
        return pd.DataFrame()

@st.cache_data(ttl=60)
def fetch_districts():
    """Fetch all districts from API"""
    try:
        response = requests.get(f"{API_URL}/districts/")
        if response.status_code == 200:
            data = response.json()
            districts = []
            for feature in data['features']:
                props = feature['properties']
                districts.append({
                    'id': props['id'],
                    'name': props['name'],
                    'province': props.get('province_name', 'Unknown')
                })
            return pd.DataFrame(districts)
        return pd.DataFrame()
    except Exception as e:
        st.error(f"Error fetching districts: {e}")
        return pd.DataFrame()

# Main Dashboard
st.title("🏫 Maktab GIS - Pakistan School Analytics Dashboard")
st.markdown("### Interactive Data Visualization with Plotly & PyDeck")

# Fetch data
with st.spinner("Loading data..."):
    df_schools = fetch_schools()
    df_districts = fetch_districts()

if df_schools.empty:
    st.error("⚠️ No data available. Make sure the backend is running on http://127.0.0.1:8000")
    st.stop()

# Sidebar Filters
st.sidebar.header("🔍 Filters")

# Province filter
provinces = ['All'] + sorted(df_schools['province'].unique().tolist())
selected_province = st.sidebar.selectbox("Select Province", provinces)

# Category filter
categories = ['All'] + sorted(df_schools['category'].unique().tolist())
selected_category = st.sidebar.selectbox("Select Category", categories)

# Apply filters
filtered_df = df_schools.copy()
if selected_province != 'All':
    filtered_df = filtered_df[filtered_df['province'] == selected_province]
if selected_category != 'All':
    filtered_df = filtered_df[filtered_df['category'] == selected_category]

# Key Metrics
st.header("📊 Key Metrics")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Schools", len(filtered_df))
with col2:
    st.metric("Total Students", f"{filtered_df['students'].sum():,}")
with col3:
    st.metric("Total Teachers", f"{filtered_df['teachers'].sum():,}")
with col4:
    avg_ratio = filtered_df['students'].sum() / filtered_df['teachers'].sum() if filtered_df['teachers'].sum() > 0 else 0
    st.metric("Student-Teacher Ratio", f"{avg_ratio:.1f}:1")

# Charts Row 1
st.header("📈 Analytics")
col1, col2 = st.columns(2)

with col1:
    # Schools by Category - Pie Chart
    st.subheader("Schools by Category")
    category_counts = filtered_df['category'].value_counts().reset_index()
    category_counts.columns = ['category', 'count']
    
    fig_pie = px.pie(
        category_counts,
        values='count',
        names='category',
        title='Distribution of Schools by Category',
        color='category',
        color_discrete_map={
            'primary': '#4facfe',
            'secondary': '#f093fb',
            'higher_secondary': '#ffd93d',
            'university': '#f5576c'
        },
        hole=0.4
    )
    fig_pie.update_traces(textposition='inside', textinfo='percent+label')
    st.plotly_chart(fig_pie, use_container_width=True)

with col2:
    # Students by Category - Bar Chart
    st.subheader("Students by Category")
    students_by_category = filtered_df.groupby('category')['students'].sum().reset_index()
    
    fig_bar = px.bar(
        students_by_category,
        x='category',
        y='students',
        title='Total Students by School Category',
        color='category',
        color_discrete_map={
            'primary': '#4facfe',
            'secondary': '#f093fb',
            'higher_secondary': '#ffd93d',
            'university': '#f5576c'
        }
    )
    fig_bar.update_layout(showlegend=False)
    st.plotly_chart(fig_bar, use_container_width=True)

# Charts Row 2
col1, col2 = st.columns(2)

with col1:
    # Teachers by Province - Bar Chart
    st.subheader("Teachers by Province")
    teachers_by_province = filtered_df.groupby('province')['teachers'].sum().reset_index()
    teachers_by_province = teachers_by_province.sort_values('teachers', ascending=False)
    
    fig_teachers = px.bar(
        teachers_by_province,
        x='province',
        y='teachers',
        title='Total Teachers by Province',
        color='teachers',
        color_continuous_scale='Viridis'
    )
    st.plotly_chart(fig_teachers, use_container_width=True)

with col2:
    # Facilities Comparison - Grouped Bar Chart
    st.subheader("School Facilities")
    facilities_data = pd.DataFrame({
        'Facility': ['Library', 'Computer Lab', 'Playground'],
        'Count': [
            filtered_df['library'].sum(),
            filtered_df['computer_lab'].sum(),
            filtered_df['playground'].sum()
        ]
    })
    
    fig_facilities = px.bar(
        facilities_data,
        x='Facility',
        y='Count',
        title='Availability of School Facilities',
        color='Facility',
        color_discrete_sequence=['#4facfe', '#f093fb', '#ffd93d']
    )
    st.plotly_chart(fig_facilities, use_container_width=True)

# Charts Row 3
col1, col2 = st.columns(2)

with col1:
    # Student-Teacher Ratio by Category - Box Plot
    st.subheader("Student-Teacher Ratio Distribution")
    filtered_df['ratio'] = filtered_df['students'] / filtered_df['teachers'].replace(0, 1)
    
    fig_box = px.box(
        filtered_df,
        x='category',
        y='ratio',
        title='Student-Teacher Ratio by Category',
        color='category',
        color_discrete_map={
            'primary': '#4facfe',
            'secondary': '#f093fb',
            'higher_secondary': '#ffd93d',
            'university': '#f5576c'
        }
    )
    st.plotly_chart(fig_box, use_container_width=True)

with col2:
    # Schools Established Over Time - Line Chart
    st.subheader("Schools Established Over Time")
    year_counts = filtered_df[filtered_df['year'].notna()].groupby('year').size().reset_index(name='count')
    year_counts = year_counts.sort_values('year')
    year_counts['cumulative'] = year_counts['count'].cumsum()
    
    fig_timeline = go.Figure()
    fig_timeline.add_trace(go.Scatter(
        x=year_counts['year'],
        y=year_counts['cumulative'],
        mode='lines+markers',
        name='Cumulative Schools',
        line=dict(color='#667eea', width=3),
        fill='tozeroy'
    ))
    fig_timeline.update_layout(
        title='Cumulative Schools Established Over Time',
        xaxis_title='Year',
        yaxis_title='Number of Schools'
    )
    st.plotly_chart(fig_timeline, use_container_width=True)

# 3D Map with PyDeck
st.header("🗺️ 3D School Map (PyDeck)")

# Prepare data for PyDeck
map_df = filtered_df[['name', 'category', 'latitude', 'longitude', 'students']].copy()
map_df['color'] = map_df['category'].map({
    'primary': [79, 172, 254],
    'secondary': [240, 147, 251],
    'higher_secondary': [255, 217, 61],
    'university': [245, 87, 108]
})

# Create PyDeck layer
layer = pdk.Layer(
    'ColumnLayer',
    data=map_df,
    get_position='[longitude, latitude]',
    get_elevation='students',
    elevation_scale=10,
    radius=5000,
    get_fill_color='color',
    pickable=True,
    auto_highlight=True,
)

# Set the viewport location
view_state = pdk.ViewState(
    longitude=69.3451,
    latitude=30.3753,
    zoom=5,
    pitch=50,
)

# Render
r = pdk.Deck(
    layers=[layer],
    initial_view_state=view_state,
    tooltip={"text": "{name}\nCategory: {category}\nStudents: {students}"}
)

st.pydeck_chart(r)

# Data Table
st.header("📋 School Data Table")
st.dataframe(
    filtered_df[['name', 'category', 'district', 'province', 'students', 'teachers', 'classrooms']],
    use_container_width=True
)

# Download Data
st.header("💾 Export Data")
csv = filtered_df.to_csv(index=False)
st.download_button(
    label="Download Data as CSV",
    data=csv,
    file_name=f"maktab_schools_{datetime.now().strftime('%Y%m%d')}.csv",
    mime="text/csv"
)

# Footer
st.markdown("---")
st.markdown("**Maktab GIS Dashboard** | Built with Streamlit, Plotly & PyDeck | Data from Django REST API")
