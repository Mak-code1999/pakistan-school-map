import React from 'react';
import './MapControls.css';

const MapControls = ({ onStyleChange, currentStyle }) => {
    const styles = [
        { id: 'street', name: 'Street', icon: '🗺️' },
        { id: 'satellite', name: 'Satellite', icon: '🛰️' },
        { id: 'dark', name: 'Dark Mode', icon: '🌑' }
    ];

    return (
        <div className="map-style-control">
            {styles.map(style => (
                <button
                    key={style.id}
                    className={`style-btn ${currentStyle === style.id ? 'active' : ''}`}
                    onClick={() => onStyleChange(style.id)}
                    title={style.name}
                >
                    <span className="btn-icon">{style.icon}</span>
                </button>
            ))}
        </div>
    );
};

export default MapControls;
