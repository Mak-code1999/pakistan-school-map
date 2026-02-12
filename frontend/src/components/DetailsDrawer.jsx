import React, { useState } from 'react';
import './DetailsDrawer.css';

const DetailsDrawer = ({ title, data, type, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!data) return null;

    // Helper to format keys like "school_level" -> "School Level"
    const formatKey = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className={`details-drawer ${type} ${data ? 'open' : ''}`}>
            <div className="drawer-header">
                <div>
                    <span className="drawer-type-label">{type} Details</span>
                    <h2 className="drawer-title">{title}</h2>
                </div>
                <button className="close-btn" onClick={onClose} title="Close">
                    &times;
                </button>
            </div>

            {/* Render logic based on Type */}
            <div className="drawer-content-scroll">

                {/* --- SCHOOL VIEW --- */}
                {type === 'school' ? (
                    <div className="school-details-view">
                        <div className="info-grid">
                            {Object.entries(data).map(([key, value]) => {
                                // Skip internal/geometry fields if any leak through
                                if (['id', 'geometry', 'type'].includes(key)) return null;

                                return (
                                    <div key={key} className="info-item">
                                        <div className="info-label">{formatKey(key)}</div>
                                        <div className="info-value">{value || '-'}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* --- DISTRICT / PROVINCE VIEW (Existing) --- */
                    <>
                        <div className="drawer-tabs">
                            <button
                                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Details
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'overview' ? (
                                <div className="overview-panel">
                                    <div className="stat-grid-summary">
                                        <div className="stat-box">
                                            <label>Total Schools</label>
                                            <div className="value-huge">{data.total || 0}</div>
                                        </div>
                                    </div>

                                    {data.byCategory && (
                                        <div className="category-summary">
                                            <h3>School Distribution</h3>
                                            {Object.entries(data.byCategory).map(([cat, count]) => (
                                                <div key={cat} className="category-row">
                                                    <span className={`cat-dot ${cat}`}></span>
                                                    <span className="cat-name">{formatKey(cat)}</span>
                                                    <span className="cat-count">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="details-panel">
                                    {/* Placeholder for future detailed lists */}
                                    <p className="no-data">Detailed breakdown not available.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DetailsDrawer;
