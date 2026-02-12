import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './StatsPanel.css';

const StatsPanel = ({ province, stats, onClose }) => {
    const [viewMode, setViewMode] = useState('charts'); // 'charts' or 'list'

    if (!stats) return null;

    // Use consistent colors with Map.jsx
    const COLORS = [
        '#4facfe', // Primary - Blue
        '#f093fb', // Secondary - Purple
        '#ffd93d', // Higher Secondary - Yellow
        '#f5576c'  // University - Red
    ];

    const categoryColorMap = {
        primary: '#4facfe',
        secondary: '#f093fb',
        higher_secondary: '#ffd93d',
        university: '#f5576c'
    };

    const categoryLabels = {
        primary: 'Primary',
        secondary: 'Secondary',
        higher_secondary: 'Higher Secondary',
        university: 'University',
    };

    const chartData = Object.entries(stats.byCategory || {}).map(([key, value]) => ({
        name: categoryLabels[key] || key.replace('_', ' '),
        value: value,
        key: key,
        color: categoryColorMap[key] || '#667eea'
    }));

    return (
        <div className="stats-panel">
            <div className="stats-header">
                <div>
                    <h2>{province}</h2>
                    <p className="province-label">Province Statistics</p>
                </div>
                <button className="close-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="stats-tabs">
                <button
                    className={`tab-btn ${viewMode === 'charts' ? 'active' : ''}`}
                    onClick={() => setViewMode('charts')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Analytics
                </button>
                <button
                    className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Schools List
                </button>
            </div>

            <div className="stats-content">
                {viewMode === 'charts' ? (
                    <>
                        <div className="stat-card total">
                            <div className="stat-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{stats.total || 0}</div>
                                <div className="stat-label">Total Schools</div>
                            </div>
                        </div>

                        {chartData.length > 0 ? (
                            <div className="charts-container">
                                <div className="chart-wrapper">
                                    <h3>Distribution by Category</h3>
                                    <div style={{ width: '100%', height: 200 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0a0e27', borderColor: '#00d9ff', color: '#fff' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="chart-legend">
                                        {chartData.map((entry, index) => (
                                            <div key={index} className="legend-item">
                                                <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
                                                <span>{entry.name}: <strong>{entry.value}</strong></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-data">
                                <p>No schools found in this province.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="schools-list">
                        <h3>Schools Directory</h3>
                        {stats.schools && stats.schools.length > 0 ? (
                            <div className="schools-grid">
                                {stats.schools.map((school) => (
                                    <div key={school.id} className="school-card">
                                        <div className="school-icon" style={{ color: categoryColorMap[school.category] || '#fff', background: `${categoryColorMap[school.category]}20` }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                            </svg>
                                        </div>
                                        <div className="school-details">
                                            <h4>{school.name}</h4>
                                            <span
                                                className="school-badge"
                                                style={{ backgroundColor: categoryColorMap[school.category] || '#667eea', color: school.category === 'higher_secondary' ? '#000' : '#fff' }}
                                            >
                                                {categoryLabels[school.category] || school.category}
                                            </span>
                                            {school.district_name && <span className="school-location">{school.district_name}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">
                                <p>No school records available.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsPanel;
