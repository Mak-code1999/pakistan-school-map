import streamlit as st
import pandas as pd
import folium
from streamlit_folium import st_folium
import psycopg2
import os

# Page config
st.set_page_config(layout="wide", page_title="Pakistan School Map", page_icon="🏫")

# Title and Stylye
st.title("🇵🇰 Pakistan School Mapping Platform")
st.markdown("""
<style>
    .metric-card {
        background-color: #f0f2f6;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------
# DATABASE CONNECTION
# -----------------------------
@st.cache_resource
def init_connection():
    # Use Railway Database URL if available, else local
    # DEFAULT to the Railway URL you shared earlier if env var is missing
    DEFAULT_DB_URL = "postgresql://postgres:LHtNaypnrkAMESNtbVMRLxVYQiqFpsLo@caboose.proxy.rlwy.net:25812/railway"
    
    url = os.environ.get("DATABASE_URL", DEFAULT_DB_URL)
    return psycopg2.connect(url)

try:
    conn = init_connection()
    st.success("✅ Connected to Database")
except Exception as e:
    st.error(f"❌ Database Connection Failed: {e}")
    st.stop()

# -----------------------------
# DATA LOADING
# -----------------------------
@st.cache_data
def load_data():
    # Load Schools
    query = """
    SELECT id, name, category, ST_X(location::geometry) as lon, ST_Y(location::geometry) as lat 
    FROM schools_school;
    """
    df = pd.read_sql(query, conn)
    return df

@st.cache_data
def load_stats():
    # Group by category
    query = """
    SELECT category, COUNT(*) as count 
    FROM schools_school 
    GROUP BY category;
    """
    df = pd.read_sql(query, conn)
    return df

# Load data
try:
    schools_df = load_data()
    stats_df = load_stats()
except Exception as e:
    st.warning("⚠️ Could not load data (Tables might be empty). displaying empty map.")
    schools_df = pd.DataFrame(columns=['name', 'category', 'lat', 'lon'])
    stats_df = pd.DataFrame(columns=['category', 'count'])

# -----------------------------
# SIDEBAR FILTERS
# -----------------------------
st.sidebar.header("🔍 Filters")
selected_category = st.sidebar.multiselect(
    "Select School Category",
    options=schools_df['category'].unique() if not schools_df.empty else [],
    default=schools_df['category'].unique() if not schools_df.empty else []
)

if not schools_df.empty and selected_category:
    filtered_df = schools_df[schools_df['category'].isin(selected_category)]
else:
    filtered_df = schools_df

# -----------------------------
# DASHBOARD METRICS
# -----------------------------
col1, col2, col3 = st.columns(3)
with col1:
    st.metric(label="Total Schools", value=len(schools_df))
with col2:
    st.metric(label="Visible Schools", value=len(filtered_df))
with col3:
    top_cat = stats_df.sort_values('count', ascending=False).iloc[0]['category'] if not stats_df.empty else "N/A"
    st.metric(label="Top Category", value=top_cat)

# -----------------------------
# MAP VISUALIZATION
# -----------------------------
st.subheader("📍 Interactive Map")

# Create Map (Centered on Pakistan)
m = folium.Map(location=[30.3753, 69.3451], zoom_start=6, tiles="CartoDB positron")

# Add Points
for idx, row in filtered_df.iterrows():
    color = "blue"
    if row['category'] == 'Primary': color = "green"
    elif row['category'] == 'Secondary': color = "orange"
    elif row['category'] == 'Higher Secondary': color = "red"
    
    folium.CircleMarker(
        location=[row['lat'], row['lon']],
        radius=5,
        color=color,
        fill=True,
        fill_opacity=0.7,
        tooltip=f"{row['name']} ({row['category']})"
    ).add_to(m)

# Render Map
st_folium(m, width="100%", height=500)

# -----------------------------
# DATA TABLE
# -----------------------------
st.subheader("📋 School Data")
st.dataframe(filtered_df[['name', 'category', 'lat', 'lon']], use_container_width=True)

# -----------------------------
# ADD DATA FORM
# -----------------------------
st.sidebar.markdown("---")
st.sidebar.subheader("➕ Add New School")
with st.sidebar.form("add_school_form"):
    new_name = st.text_input("School Name")
    new_cat = st.selectbox("Category", ["Primary", "Middle", "Secondary", "Higher Secondary"])
    new_lat = st.number_input("Latitude", value=30.0, format="%.6f")
    new_lon = st.number_input("Longitude", value=69.0, format="%.6f")
    
    submitted = st.form_submit_button("Add School")
    if submitted:
        try:
            cur = conn.cursor()
            insert_query = """
            INSERT INTO schools_school (name, category, location, created_at, updated_at)
            VALUES (%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), NOW(), NOW());
            """
            cur.execute(insert_query, (new_name, new_cat, new_lon, new_lat))
            conn.commit()
            cur.close()
            st.toast("✅ School Added Successfully! Refresh to see.", icon="🎉")
        except Exception as e:
            st.error(f"Error adding school: {e}")
