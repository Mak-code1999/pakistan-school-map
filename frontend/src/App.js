import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapControls from './components/MapControls';
import DetailsDrawer from './components/DetailsDrawer';
import MapLegend from './components/MapLegend'; // Import Legend
import config from './config';
import './App.css';
import { SCHOOL_CATEGORIES } from './theme'; // Theme Import

function App() {
    // UI State
    const [mapStyle, setMapStyle] = useState('dark');
    const [selectedFeature, setSelectedFeature] = useState(null); // For Drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [flyToSchool, setFlyToSchool] = useState(null);

    const handleFlyTo = (school) => {
        setFlyToSchool(school);
    };

    // Data State
    const [globalStats, setGlobalStats] = useState({
        totalSchools: 0,
        totalDistricts: 0,
        schoolsByCategory: {}
    });
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('all');
    const [filteredStats, setFilteredStats] = useState(null);
    const [schoolsData, setSchoolsData] = useState([]);
    const [provinceBounds, setProvinceBounds] = useState(null);

    // Loading State
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch
    // Initial Data Fetch
    useEffect(() => {
        document.title = "Pakistan School Map | National Data Portal";
        const fetchGlobalStats = async () => {
            try {
                // Fetch Schools
                let schools = { features: [] };
                try {
                    const schoolsRes = await fetch(`${config.apiUrl}/schools/`);
                    if (schoolsRes.ok) {
                        schools = await schoolsRes.json();
                    } else {
                        console.error("Failed to fetch schools:", schoolsRes.status);
                    }
                } catch (e) {
                    console.error("Error connecting to schools API:", e);
                }

                // Fetch Districts (independently)
                let districtsGeo = { features: [] };
                try {
                    const districtsRes = await fetch(`${config.apiUrl}/districts/`);
                    if (districtsRes.ok) {
                        districtsGeo = await districtsRes.json();
                    } else {
                        console.warn("Districts API might be down or empty (expected during dev):", districtsRes.status);
                    }
                } catch (e) {
                    console.warn("Could not fetch districts (non-critical):", e);
                }

                // Set Data
                setSchoolsData(schools.features || []);
                setDistricts(districtsGeo.features || []);

                // Calculate Global Stats
                const stats = calculateStats(schools.features || []);
                setGlobalStats({
                    ...stats,
                    totalDistricts: districtsGeo.features?.length || 0
                });

                setFilteredStats({
                    ...stats,
                    totalDistricts: districtsGeo.features?.length || 0
                });

                setLoading(false);
            } catch (error) {
                console.error('Critical error in data fetching:', error);
                setLoading(false);
            }
        };

        fetchGlobalStats();
    }, []);

    // Filter Logic
    useEffect(() => {
        if (!schoolsData.length) return;

        if (selectedProvince === 'all') {
            setFilteredStats({
                ...globalStats,
                totalDistricts: districts.length
            });
        } else {
            const filteredSchools = schoolsData.filter(
                s => s.properties.province_name === selectedProvince
            );
            const filteredDistricts = districts.filter(
                d => d.properties.province_name === selectedProvince
            );

            const stats = calculateStats(filteredSchools);
            setFilteredStats({
                ...stats,
                totalDistricts: filteredDistricts.length
            });
        }
    }, [selectedProvince, schoolsData, districts, globalStats]);

    const calculateStats = (schools) => {
        const categoryCount = {};
        schools.forEach(school => {
            const category = school.properties.category || 'unknown';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        return {
            totalSchools: schools.length,
            schoolsByCategory: categoryCount
        };
    };

    const handleDistrictSelect = (feature, stats) => {
        if (!feature) {
            setIsDrawerOpen(false);
            return;
        }

        setSelectedFeature({
            type: 'district',
            title: feature.name,
            data: stats // stats from API getDistrictStats
        });
        setIsDrawerOpen(true);
    };

    const handleProvinceSelect = (province) => {
        setSelectedProvince(province);

        if (province === 'all') {
            setProvinceBounds(null); // Reset or set to Pakistan bounds
            return;
        }

        // Find all districts in this province to calculate bounds
        const provinceDistricts = districts.filter(d => d.properties.province_name === province);
        if (provinceDistricts.length > 0) {
            const tempLayer = L.geoJSON({
                type: 'FeatureCollection',
                features: provinceDistricts
            });
            setProvinceBounds(tempLayer.getBounds());
        }
    };

    const handleSchoolSelect = (school) => {
        setSelectedFeature({
            type: 'school',
            title: school.properties.name,
            data: school.properties // Pass all properties
        });
        setIsDrawerOpen(true);
        // Optional: Also fly to the school when selected
        handleFlyTo(school);
    };

    return (
        <div className="app">
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Initializing Geospatial Core...</div>
                </div>
            )}

            <Sidebar
                stats={filteredStats}
                districts={districts}
                selectedProvince={selectedProvince}
                onProvinceSelect={handleProvinceSelect}
                schools={schoolsData}
                onFlyTo={handleFlyTo}
                onSelectSchool={handleSchoolSelect}
            />

            <MapControls
                currentStyle={mapStyle}
                onStyleChange={setMapStyle}
            />

            <Map
                mapStyle={mapStyle}
                onDistrictSelect={handleDistrictSelect}
                districts={districts}
                schools={schoolsData}
                flyToSchool={flyToSchool}
                provinceBounds={provinceBounds}
            />

            <MapLegend />

            <DetailsDrawer
                type={selectedFeature?.type}
                title={selectedFeature?.title}
                data={selectedFeature?.data}
                onClose={() => setIsDrawerOpen(false)}
            />

            {/* Drawer Visibility Control via CSS Class */}
            <div className={`drawer-overlay ${isDrawerOpen ? 'active' : ''}`} onClick={() => setIsDrawerOpen(false)}></div>
            <style>{`
                .details-drawer { transform: translateX(400px); }
                .details-drawer.district { transform: translateX(0); }
                .details-drawer { right: ${isDrawerOpen ? '0' : '-400px'} !important; }
            `}</style>
        </div>
    );
}

export default App;
