import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDistricts, getSchools, getDistrictStats } from '../services/api';
import SchoolForm from './SchoolForm';
import { getColor } from '../theme';
import './Map.css';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component for map interactions
const MapInteractions = ({ onMapLoad, isAddingSchool, onMapClick }) => {
    const map = useMap();

    useEffect(() => {
        if (onMapLoad) onMapLoad(map);
    }, [map, onMapLoad]);

    useMapEvents({
        click: (e) => {
            if (isAddingSchool) {
                onMapClick(e.latlng);
            }
        }
    });

    // Change cursor style based on mode
    useEffect(() => {
        if (isAddingSchool) {
            map.getContainer().style.cursor = 'crosshair';
        } else {
            map.getContainer().style.cursor = '';
        }
    }, [isAddingSchool, map]);

    return null;
};

const Map = ({
    districts,
    schools,
    onMapLoad,
    onDistrictSelect,
    mapStyle = 'dark',
    flyToSchool,
    provinceBounds
}) => {
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    const [isAddingSchool, setIsAddingSchool] = useState(false);
    const [showSchoolForm, setShowSchoolForm] = useState(false);
    const [newSchoolCoords, setNewSchoolCoords] = useState(null);

    const mapRef = useRef(null);

    // Handle flying to province bounds
    useEffect(() => {
        if (provinceBounds && mapRef.current) {
            mapRef.current.fitBounds(provinceBounds, {
                padding: [50, 50],
                maxZoom: 10,
                animate: true,
                duration: 1.5
            });
        }
    }, [provinceBounds]);

    // Zoom to bounds when data changes
    useEffect(() => {
        if (mapRef.current && districts && districts.length > 0 && !flyToSchool && !provinceBounds) {
            try {
                // Create a feature collection to calculate bounds
                const featureCollection = {
                    type: "FeatureCollection",
                    features: districts
                };
                const layer = L.geoJSON(featureCollection);
                const bounds = layer.getBounds();
                if (bounds.isValid()) {
                    mapRef.current.fitBounds(bounds, { padding: [20, 20] });
                }
            } catch (e) {
                console.warn("Could not fit bounds", e);
            }
        }
    }, [districts]);

    // Handle FlyTo action from Sidebar
    useEffect(() => {
        if (flyToSchool && mapRef.current) {
            const { coordinates } = flyToSchool.geometry;
            // GeoJSON is [lng, lat], Leaflet needs [lat, lng]
            mapRef.current.flyTo([coordinates[1], coordinates[0]], 15, {
                animate: true,
                duration: 1.5
            });
        }
    }, [flyToSchool]);

    const districtStyle = (feature) => {
        const isSelected = feature.properties.id === selectedDistrictId;
        const isDark = mapStyle === 'dark' || mapStyle === 'satellite';

        return {
            fillColor: isSelected ? '#38bdf8' : 'transparent', // Only fill when selected
            weight: isSelected ? 1.5 : 0.5, // Thin elegant lines
            opacity: 1,
            color: isSelected ? '#38bdf8' : '#0ea5e9', // Cyan
            dashArray: null, // Solid lines are more premium
            fillOpacity: isSelected ? 0.5 : 0 // Clean look
        };
    };

    const onDistrictClick = async (feature, layer) => {
        if (isAddingSchool) return;

        const districtId = feature.properties.id;
        const districtName = feature.properties.name;
        const provinceName = feature.properties.province_name;

        setSelectedDistrictId(districtId);

        if (mapRef.current) {
            mapRef.current.fitBounds(layer.getBounds(), { padding: [50, 50] });
        }

        try {
            const stats = await getDistrictStats(districtId);
            if (onDistrictSelect) {
                onDistrictSelect({ id: districtId, name: districtName, province_name: provinceName }, stats);
            }
        } catch (error) {
            console.error('Error fetching district stats:', error);
            if (onDistrictSelect) {
                onDistrictSelect({ id: districtId, name: districtName, province_name: provinceName }, null);
            }
        }
    };
    const pointToLayer = (feature, latlng) => {
        const category = feature.properties.category;
        return L.circleMarker(latlng, {
            radius: 6,
            fillColor: getColor(category),
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    };

    const onEachSchool = (feature, layer) => {
        const { name, category, district_name } = feature.properties;
        const popupContent = `
            <div class="school-popup">
                <h3>${name}</h3>
                <div class="popup-details">
                    <div class="popup-row">
                        <span class="popup-label">Category:</span>
                        <span class="popup-value">${category?.replace('_', ' ') || 'Unknown'}</span>
                    </div>
                    <div class="popup-row">
                        <span class="popup-label">District:</span>
                        <span class="popup-value">${district_name || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
        layer.bindPopup(popupContent, { className: 'school-popup-custom' });
    };

    const handleMapClick = (latlng) => {
        setNewSchoolCoords({
            latitude: latlng.lat,
            longitude: latlng.lng
        });
        setIsAddingSchool(false);
        setShowSchoolForm(true);
    };

    const handleSchoolCreated = async () => {
        setShowSchoolForm(false);
        setNewSchoolCoords(null);
        // Props controlled by parent, would need callback to refresh
        console.log("School created, refresh page to see changes.");
    };

    // New: Dynamic Tile Layer Logic
    const getTileLayer = () => {
        switch (mapStyle) {
            case 'satellite':
                return {
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                };
            case 'dark':
                return {
                    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                };
            case 'street':
            default:
                return {
                    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                };
        }
    };

    const tileLayerConfig = getTileLayer();

    return (
        <>
            <MapContainer
                center={[30.3753, 69.3451]}
                zoom={6}
                className="map-container"
                style={{ background: '#020617' }} // Deep slate background
                maxBounds={[[23.0, 60.0], [37.5, 78.0]]} // Restrict to Pakistan region
                maxBoundsViscosity={1.0}
                minZoom={5}
            >
                <TileLayer
                    key={mapStyle}
                    attribution={tileLayerConfig.attribution}
                    url={tileLayerConfig.url}
                    className="blurred-tiles" // CSS class for spotlight effect
                />

                <MapInteractions
                    onMapLoad={(map) => { mapRef.current = map; if (onMapLoad) onMapLoad(map); }}
                    isAddingSchool={isAddingSchool}
                    onMapClick={handleMapClick}
                />

                {districts && districts.length > 0 && (
                    <GeoJSON
                        key={`districts-${districts.length}`}
                        data={{ type: "FeatureCollection", features: districts }}
                        style={districtStyle}
                        onEachFeature={(feature, layer) => {
                            layer.on({
                                click: () => onDistrictClick(feature, layer),
                                mouseover: (e) => {
                                    if (isAddingSchool) return;
                                    const layer = e.target;
                                    const isSelected = feature.properties.id === selectedDistrictId;

                                    // Premium Hover Effect
                                    layer.setStyle({
                                        fillOpacity: isSelected ? 0.6 : 0.2, // Subtle glow
                                        fillColor: isSelected ? '#38bdf8' : '#0ea5e9',
                                        weight: 1,
                                        color: '#38bdf8' // Brighter cyan on hover
                                    });
                                    layer.bringToFront();
                                },
                                mouseout: (e) => {
                                    const layer = e.target;
                                    const isSelected = feature.properties.id === selectedDistrictId;
                                    // Reset to premium thin style
                                    layer.setStyle({
                                        fillColor: isSelected ? '#38bdf8' : 'transparent',
                                        color: '#0ea5e9',
                                        weight: isSelected ? 1.5 : 0.5,
                                        fillOpacity: isSelected ? 0.5 : 0
                                    });
                                }
                            });
                        }}
                    />
                )}

                {schools && schools.length > 0 && (
                    <GeoJSON
                        key={`schools-${schools.length}`}
                        data={{ type: "FeatureCollection", features: schools }}
                        pointToLayer={pointToLayer}
                        onEachFeature={onEachSchool}
                    />
                )}
            </MapContainer>

            <div className="map-controls">
                <button
                    className={`add-school-btn ${isAddingSchool ? 'active' : ''}`}
                    onClick={() => setIsAddingSchool(!isAddingSchool)}
                    title="Click on map to add school"
                >
                    <span className="btn-icon">{isAddingSchool ? '✕' : '+'}</span>
                    <span className="btn-text">{isAddingSchool ? 'Cancel' : 'Add School'}</span>
                </button>
            </div>

            {showSchoolForm && newSchoolCoords && (
                <SchoolForm
                    coordinates={newSchoolCoords}
                    onSubmit={handleSchoolCreated}
                    onClose={() => {
                        setShowSchoolForm(false);
                        setIsAddingSchool(false);
                    }}
                />
            )}
        </>
    );
};

export default Map;
