# 🗺️ Pakistan School Map (National Data Portal)

A professional WebGIS platform for visualizing and managing educational infrastructure across Pakistan. This application allows users to explore school distribution, filter by province, view detailed statistics, and manage school data through an intuitive, high-performance interface.

## 🚀 Features

- **Interactive Map**: High-performance vector map of Pakistan with accurate district boundaries.
- **Geospatial Data**: Visualizes 103+ schools and 142 districts using PostGIS.
- **Smart Filtering**: Filter schools by province and view aggregated statistics.
- **School Management**: Add new schools directly on the map with precise coordinates.
- **Advanced Search**: Search for schools by name or filter districts.
- **Data Visualization**: Real-time charts showing school distribution by category (Primary, Secondary, etc.).
- **Responsive Design**: Glassmorphism UI that works on desktop and mobile.

## 🛠️ Technology Stack

- **Backend**: Django 5.0, Django REST Framework, GeoDjango
- **Database**: PostgreSQL 16 + PostGIS (Spatial Database)
- **Frontend**: React 18, Leaflet, Recharts
- **Styling**: CSS3 (Glassmorphism), Inter Typography

---

## 📦 Installation Guide

Follow these steps to set up the project locally.

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 16 with PostGIS extension

### 1. Database Setup
1.  Open pgAdmin or terminal.
2.  Create a new database named `pakistan_schools_db`.
3.  Restore the provided SQL dump to populate the database with districts and schools:
    ```bash
    psql -U postgres -d pakistan_schools_db -f database/pakistan_school_map.sql
    ```
    *(Note: The SQL file includes `CREATE EXTENSION postgis;`)*

### 2. Backend Setup
1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Update `.env` file (if needed) to match your database credentials:
    ```ini
    DB_NAME=pakistan_schools_db
    DB_USER=postgres
    DB_PASSWORD=yourpassword
    ```
5.  Run the development server:
    ```bash
    python manage.py runserver
    ```
    The API will be available at `http://localhost:8000/api/`.

### 3. Frontend Setup
1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the application:
    ```bash
    npm start
    ```
    The application will open at `http://localhost:3000` (or `3001`).

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/districts/` | Get all district boundaries (GeoJSON) |
| `GET` | `/api/schools/` | Get all schools (GeoJSON) |
| `POST` | `/api/schools/` | Add a new school |
| `GET` | `/api/districts/?q={name}` | Search districts by name or province |
| `GET` | `/api/districts/{id}/stats/` | Get specific district statistics |

---

## 📂 Project Structure

```
pakistan-school-map/
├── backend/            # Django REST API
│   ├── schools/        # Core App (Models, Views, Serializers)
│   ├── config/         # Project Settings (Updated from maktab_project)
│   └── manage.py       # Django CLI
├── frontend/           # React Application
│   ├── public/         # Static Assets
│   └── src/            # React Components & Hooks
├── database/           # SQL Dumps & Shapefiles
└── README.md           # Documentation
```

## 👨‍💻 Developer Notes
- **Code Quality**: The codebase follows PEP8 (Python) and ESLint (React) standards.
- **Security**: Environment variables are used for sensitive configuration. `DEBUG` mode is enabled for development but should be disabled in production.
- **Performance**: The frontend uses vector tiles and optimized GeoJSON rendering for smooth interaction.

## 🛠️ Troubleshooting (Windows Only)

### "GDAL/GEOS library not found"
The backend requires PostGIS libraries. In `backend/config/settings.py`, the path is currently set to:
`OSGEO4W = r"C:\Program Files\PostgreSQL\16"`

If your PostgreSQL is installed in a different location (e.g., Program Files (x86) or Version 15), simply update the `OSGEO4W` path in that file to match your installation.

### "PostGIS extension not found"
Ensure you have installed the **PostGIS bundle** using the PostgreSQL **Stack Builder** application. Just installing the database is not enough; the spatial extension is required.

