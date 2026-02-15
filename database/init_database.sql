-- ========================================
-- PAKISTAN SCHOOL MAP - DATABASE INITIALIZATION
-- ========================================
-- This SQL file creates the database, tables, and sample data
-- for the Pakistan School Mapping Platform
--
-- Author: Mahrkh Iftikhar
-- Date: February 2026
-- Database: PostgreSQL 14+ with PostGIS extension
-- ========================================

-- ========================================
-- STEP 1: CREATE DATABASE
-- ========================================
-- Run this command separately in psql:
-- CREATE DATABASE maktab_db;
-- \c maktab_db

-- ========================================
-- STEP 2: ENABLE POSTGIS EXTENSION
-- ========================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS installation
SELECT PostGIS_version();

-- ========================================
-- STEP 3: CREATE TABLES
-- ========================================

-- District/Province Boundaries Table
CREATE TABLE IF NOT EXISTS schools_district (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province_name VARCHAR(255),
    name_0 VARCHAR(255),  -- Country name
    name_1 VARCHAR(255),  -- Province name
    name_2 VARCHAR(255),  -- District name
    name_3 VARCHAR(255),  -- Sub-district name
    type_3 VARCHAR(100),  -- Administrative type
    geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index on district geometries
CREATE INDEX IF NOT EXISTS idx_district_geom ON schools_district USING GIST(geom);

-- Schools Table
CREATE TABLE IF NOT EXISTS schools_school (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('primary', 'secondary', 'higher_secondary', 'university')),
    district_id INTEGER REFERENCES schools_district(id) ON DELETE SET NULL,
    district_name VARCHAR(255),
    province_name VARCHAR(255),
    
    -- Additional school information
    num_students INTEGER DEFAULT 0,
    num_teachers INTEGER DEFAULT 0,
    num_classrooms INTEGER DEFAULT 0,
    establishment_year INTEGER,
    has_library BOOLEAN DEFAULT FALSE,
    has_computer_lab BOOLEAN DEFAULT FALSE,
    has_playground BOOLEAN DEFAULT FALSE,
    
    -- Spatial data
    geom GEOMETRY(Point, 4326) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index on school geometries
CREATE INDEX IF NOT EXISTS idx_school_geom ON schools_school USING GIST(geom);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_school_category ON schools_school(category);

-- Create index on province for faster queries
CREATE INDEX IF NOT EXISTS idx_school_province ON schools_school(province_name);

-- ========================================
-- STEP 4: INSERT SAMPLE DATA
-- ========================================

-- Sample Districts (You should load actual shapefile data using ogr2ogr or Django management command)
-- This is just a placeholder to show the structure

INSERT INTO schools_district (name, province_name, name_0, name_1, name_2, name_3, type_3, geom)
VALUES 
    ('Lahore', 'Punjab', 'Pakistan', 'Punjab', 'Lahore', 'Lahore', 'District', 
     ST_GeomFromText('MULTIPOLYGON(((74.2 31.5, 74.4 31.5, 74.4 31.6, 74.2 31.6, 74.2 31.5)))', 4326)),
    
    ('Karachi', 'Sindh', 'Pakistan', 'Sindh', 'Karachi', 'Karachi', 'District',
     ST_GeomFromText('MULTIPOLYGON(((67.0 24.8, 67.2 24.8, 67.2 25.0, 67.0 25.0, 67.0 24.8)))', 4326)),
    
    ('Islamabad', 'Islamabad', 'Pakistan', 'Islamabad', 'Islamabad', 'Islamabad', 'District',
     ST_GeomFromText('MULTIPOLYGON(((73.0 33.6, 73.2 33.6, 73.2 33.8, 73.0 33.8, 73.0 33.6)))', 4326));

-- Sample Schools
INSERT INTO schools_school (name, category, district_id, district_name, province_name, num_students, num_teachers, num_classrooms, establishment_year, has_library, has_computer_lab, has_playground, geom)
VALUES 
    ('Lahore Grammar School', 'secondary', 1, 'Lahore', 'Punjab', 500, 30, 20, 1979, TRUE, TRUE, TRUE,
     ST_GeomFromText('POINT(74.3 31.55)', 4326)),
    
    ('Beaconhouse School System', 'higher_secondary', 1, 'Lahore', 'Punjab', 800, 50, 35, 1975, TRUE, TRUE, TRUE,
     ST_GeomFromText('POINT(74.35 31.52)', 4326)),
    
    ('University of Karachi', 'university', 2, 'Karachi', 'Sindh', 24000, 1200, 150, 1951, TRUE, TRUE, TRUE,
     ST_GeomFromText('POINT(67.1 24.9)', 4326)),
    
    ('Islamabad Model School', 'primary', 3, 'Islamabad', 'Islamabad', 300, 20, 15, 2000, TRUE, FALSE, TRUE,
     ST_GeomFromText('POINT(73.1 33.7)', 4326));

-- ========================================
-- STEP 5: CREATE USEFUL VIEWS
-- ========================================

-- View: Schools with district information
CREATE OR REPLACE VIEW v_schools_with_districts AS
SELECT 
    s.id,
    s.name AS school_name,
    s.category,
    s.num_students,
    s.num_teachers,
    d.name AS district_name,
    d.province_name,
    ST_X(s.geom) AS longitude,
    ST_Y(s.geom) AS latitude,
    s.geom
FROM schools_school s
LEFT JOIN schools_district d ON s.district_id = d.id;

-- View: School statistics by province
CREATE OR REPLACE VIEW v_province_stats AS
SELECT 
    province_name,
    COUNT(*) AS total_schools,
    SUM(CASE WHEN category = 'primary' THEN 1 ELSE 0 END) AS primary_schools,
    SUM(CASE WHEN category = 'secondary' THEN 1 ELSE 0 END) AS secondary_schools,
    SUM(CASE WHEN category = 'higher_secondary' THEN 1 ELSE 0 END) AS higher_secondary_schools,
    SUM(CASE WHEN category = 'university' THEN 1 ELSE 0 END) AS universities,
    SUM(num_students) AS total_students,
    SUM(num_teachers) AS total_teachers
FROM schools_school
GROUP BY province_name
ORDER BY total_schools DESC;

-- ========================================
-- STEP 6: CREATE USEFUL FUNCTIONS
-- ========================================

-- Function: Get schools within a district
CREATE OR REPLACE FUNCTION get_schools_in_district(district_id_param INTEGER)
RETURNS TABLE (
    school_id INTEGER,
    school_name VARCHAR,
    category VARCHAR,
    num_students INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.category,
        s.num_students
    FROM schools_school s
    JOIN schools_district d ON s.district_id = d.id
    WHERE d.id = district_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function: Get schools within a province boundary (spatial query)
CREATE OR REPLACE FUNCTION get_schools_in_province(province_name_param VARCHAR)
RETURNS TABLE (
    school_id INTEGER,
    school_name VARCHAR,
    category VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.category
    FROM schools_school s
    JOIN schools_district d ON ST_Contains(d.geom, s.geom)
    WHERE d.province_name = province_name_param;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- STEP 7: GRANT PERMISSIONS (Optional)
-- ========================================

-- If you have a specific database user for the application:
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maktab_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maktab_user;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check if PostGIS is installed
SELECT PostGIS_version();

-- Count districts
SELECT COUNT(*) AS total_districts FROM schools_district;

-- Count schools
SELECT COUNT(*) AS total_schools FROM schools_school;

-- Count schools by category
SELECT category, COUNT(*) AS count 
FROM schools_school 
GROUP BY category 
ORDER BY count DESC;

-- View province statistics
SELECT * FROM v_province_stats;

-- Test spatial query: Find schools in Lahore district
SELECT s.name, s.category, d.name AS district
FROM schools_school s
JOIN schools_district d ON ST_Contains(d.geom, s.geom)
WHERE d.name = 'Lahore';

-- ========================================
-- NOTES FOR DEPLOYMENT
-- ========================================

/*
1. LOADING SHAPEFILE DATA:
   Use ogr2ogr to load actual district boundaries:
   
   ogr2ogr -f "PostgreSQL" PG:"dbname=maktab_db user=postgres password=yourpassword" \
           "Pak_District_Boundary.shp" \
           -nln schools_district \
           -lco GEOMETRY_NAME=geom \
           -lco FID=id \
           -lco SPATIAL_INDEX=GIST \
           -t_srs EPSG:4326

2. BACKUP DATABASE:
   pg_dump -U postgres -d maktab_db > maktab_backup.sql

3. RESTORE DATABASE:
   psql -U postgres -d maktab_db < maktab_backup.sql

4. PERFORMANCE OPTIMIZATION:
   - Ensure spatial indexes are created (done above)
   - Run VACUUM ANALYZE periodically
   - Monitor query performance with EXPLAIN ANALYZE

5. SECURITY:
   - Use strong passwords
   - Limit database user permissions
   - Enable SSL connections in production
   - Never commit .env files with credentials
*/

-- ========================================
-- END OF INITIALIZATION SCRIPT
-- ========================================

COMMIT;
