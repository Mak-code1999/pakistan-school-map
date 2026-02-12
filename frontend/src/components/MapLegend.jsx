import React, { useState } from 'react';
import { SCHOOL_CATEGORIES, getColor } from '../theme';
import './MapLegend.css';

const MapLegend = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`map-legend ${collapsed ? 'collapsed' : ''}`}>
            <div className="legend-header" onClick={() => setCollapsed(!collapsed)}>
                <span className="legend-title">School Categories</span>
                <span className="legend-toggle">{collapsed ? '▲' : '▼'}</span>
            </div>

            {!collapsed && (
                <div className="legend-content">
                    {Object.entries(SCHOOL_CATEGORIES).map(([key, config]) => {
                        if (key === 'default') return null;

                        return (
                            <div key={key} className="legend-item">
                                <span
                                    className="legend-dot"
                                    style={{ background: config.color, boxShadow: `0 0 8px ${config.color}40` }}
                                ></span>
                                <span className="legend-label">{config.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MapLegend;
