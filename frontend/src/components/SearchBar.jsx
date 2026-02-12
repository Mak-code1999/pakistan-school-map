import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { getDistricts, getSchools } from '../services/api';
import './SearchBar.css';

const SearchBar = ({ mapRef, onProvinceSelect }) => {
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('all');
    const [loading, setLoading] = useState(true);
    const [provinceStats, setProvinceStats] = useState({});

    // Load provinces and calculate statistics
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Fetch districts and schools
                const [districtsData, schoolsData] = await Promise.all([
                    getDistricts(),
                    getSchools()
                ]);

                // Extract unique provinces from districts
                const districtList = districtsData.features || [];
                const uniqueProvinces = [...new Set(
                    districtList.map(f => f.properties.province_name).filter(Boolean)
                )].sort();

                setProvinces(uniqueProvinces);

                // Calculate statistics per province
                const schools = schoolsData.features || [];
                const stats = {};

                uniqueProvinces.forEach(province => {
                    const provinceSchools = schools.filter(
                        s => s.properties.province_name === province
                    );

                    const categoryCount = {};
                    provinceSchools.forEach(school => {
                        const category = school.properties.category || 'unknown';
                        categoryCount[category] = (categoryCount[category] || 0) + 1;
                    });

                    stats[province] = {
                        total: provinceSchools.length,
                        byCategory: categoryCount,
                        schools: provinceSchools.map(s => ({
                            id: s.id,
                            ...s.properties
                        }))
                    };
                });

                // Add "All Provinces" stats
                const categoryCount = {};
                schools.forEach(school => {
                    const category = school.properties.category || 'unknown';
                    categoryCount[category] = (categoryCount[category] || 0) + 1;
                });

                stats['all'] = {
                    total: schools.length,
                    byCategory: categoryCount,
                    schools: schools.map(s => ({
                        id: s.id,
                        ...s.properties
                    }))
                };

                setProvinceStats(stats);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Handle province selection
    const handleProvinceChange = async (e) => {
        const province = e.target.value;
        setSelectedProvince(province);

        if (onProvinceSelect && provinceStats[province]) {
            onProvinceSelect(province, provinceStats[province]);
        }

        // Zoom map to province if mapRef is available
        if (mapRef && province !== 'all') {
            try {
                const districtsData = await getDistricts();
                const provinceDistricts = districtsData.features.filter(
                    f => f.properties.province_name === province
                );

                if (provinceDistricts.length > 0) {
                    // Calculate bounds - Leaflet style
                    // GeoJSON coordinates are [lng, lat], Leaflet needs [lat, lng]
                    const latLngs = [];

                    provinceDistricts.forEach(feature => {
                        if (feature.geometry.type === 'MultiPolygon') {
                            feature.geometry.coordinates.forEach(polygon => {
                                polygon[0].forEach(coord => {
                                    latLngs.push([coord[1], coord[0]]);
                                });
                            });
                        } else if (feature.geometry.type === 'Polygon') {
                            feature.geometry.coordinates[0].forEach(coord => {
                                latLngs.push([coord[1], coord[0]]);
                            });
                        }
                    });

                    if (latLngs.length > 0) {
                        const bounds = L.latLngBounds(latLngs);
                        mapRef.fitBounds(bounds, {
                            padding: [50, 50],
                            duration: 1
                        });
                    }
                }
            } catch (error) {
                console.error('Error zooming to province:', error);
            }
        }
    };



    return (
        <div className="search-bar">
            <div className="search-container">
                <div className="province-selector">
                    <label htmlFor="province-select">Select Province:</label>
                    <select
                        id="province-select"
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        disabled={loading}
                        className="province-dropdown"
                    >
                        <option value="all">All Provinces</option>
                        {provinces.map(province => (
                            <option key={province} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Inline stats removed */}
            </div>
        </div>
    );
};

export default SearchBar;
