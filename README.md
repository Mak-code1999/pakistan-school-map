# مکتب Maktab

**Pakistan School Mapping Platform**

A modern, interactive GIS web application for visualizing and managing school locations across Pakistan with province boundaries, search functionality, and spatial statistics.

---

## 🎯 Features

- 🗺️ Interactive map of Pakistan with province boundaries
- 📍 Add schools using draw tools with name and category
- 🔍 Search provinces and auto-zoom to selected region
- 📊 View school statistics per province (spatial queries)
- 🎨 Premium dark theme UI with smooth animations
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

**Backend:**
- Django 4.2 + Django REST Framework
- PostgreSQL + PostGIS (spatial database)
- Python 3.10+

**Frontend:**
- React 18
- Mapbox GL JS (interactive mapping)
- Axios (API communication)

**Database:**
- PostgreSQL 14+ with PostGIS extension

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **PostgreSQL** (14+) with **PostGIS** extension installed
- **Python** (3.10+)
- **Node.js** (18+) and npm
- **Git** (for version control)

---

## 🚀 Quick Start

### Prerequisites Checklist

- [ ] PostgreSQL 14+ with PostGIS extension
- [ ] Python 3.10+
- [ ] Node.js 18+
- [ ] Mapbox account (free) - [Sign up here](https://www.mapbox.com/)

### Setup Instructions

**Detailed guides available:**
- 📘 **Backend Setup**: See [backend/SETUP.md](backend/SETUP.md)
- 📗 **Frontend Setup**: See [frontend/SETUP.md](frontend/SETUP.md)

**Quick Setup (Summary):**

1. **Database Setup**
```bash
# Create database
psql -U postgres
CREATE DATABASE maktab_db;
\c maktab_db
CREATE EXTENSION postgis;
\q

# Initialize with data
psql -U postgres -d maktab_db -f database/init_database.sql
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Create .env file (copy from .env.example and update)
copy .env.example .env

# Run server
python manage.py runserver
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file with your Mapbox token
copy .env.example .env
# Edit .env and add your Mapbox token

# Run server
npm start
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/provinces/

---

## 🎨 Features Showcase

### Interactive Map
- **Dark theme** Mapbox map with smooth animations
- **Province boundaries** with hover effects and highlighting
- **Color-coded school markers** by category (Primary, Secondary, Higher Secondary, University)
- **Responsive design** works on desktop, tablet, and mobile

### Search Functionality
- Search provinces by name
- Auto-zoom to selected province with smooth animation
- Instant stats display

### Add Schools
- Click-to-draw tool for adding new schools
- Modal form for school details (name, category)
- Real-time marker updates

### Spatial Statistics
- Click any province to view school count
- Breakdown by category
- Spatial query using PostGIS `ST_Contains`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/provinces/` | Get all province boundaries (GeoJSON) |
| GET | `/api/provinces/search/?q=<query>` | Search province by name |
| GET | `/api/provinces/<id>/stats/` | Get school count for province |
| GET | `/api/schools/` | Get all schools (GeoJSON) |
| POST | `/api/schools/` | Create new school |

---

## 📁 Project Structure

```
Maktab/
├── backend/              # Django REST API
│   ├── maktab_project/   # Project settings
│   ├── schools/          # Main app (models, views, serializers)
│   ├── manage.py
│   └── requirements.txt
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service
│   │   └── styles/       # CSS files
│   ├── public/
│   └── package.json
├── database/             # SQL initialization files
│   └── init_database.sql
└── README.md
```

---

## 🎨 Usage

1. **View Map:** Open the application to see Pakistan's provinces
2. **Search Province:** Type province name in search bar, map zooms automatically
3. **Add School:** Click draw tool, place marker, enter school details
4. **View Stats:** Click on a province or search to see school count

---

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test schools

# Frontend (manual testing)
cd frontend
npm start
```

---

## 📦 Deployment

*(Optional deployment instructions will be added here)*

---

## 🤝 Contributing

This project was created as an assignment for Jugrafiya.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Mahrkh Iftikhar**  
GIS Analyst & Full-Stack Developer  
Created for Jugrafiya interview assignment - February 2026

📧 Contact: [GitHub Profile](https://github.com/Mak-code1999)

---

## 🙏 Acknowledgments

- Province boundary data: Natural Earth Data
- Mapping: Mapbox GL JS
- Spatial queries: PostGIS
