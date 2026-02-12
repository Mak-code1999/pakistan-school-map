import React from 'react';
import './Dashboard.css';

const Dashboard = ({ stats }) => {
    const categoryColors = {
        primary: '#4facfe',
        secondary: '#f093fb',
        higher_secondary: '#ffd93d',
        university: '#f5576c'
    };

    const categoryIcons = {
        primary: '🏫',
        secondary: '🎓',
        higher_secondary: '📚',
        university: '🎯'
    };

    const categoryLabels = {
        primary: 'Primary',
        secondary: 'Secondary',
        higher_secondary: 'Higher Secondary',
        university: 'University'
    };

    return (
        <div className="dashboard-container">
            {/* Main Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🏛️</div>
                    <div className="stat-label">Total Schools</div>
                    <div className="stat-value">{stats.totalSchools.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🗺️</div>
                    <div className="stat-label">Districts</div>
                    <div className="stat-value">{stats.totalDistricts.toLocaleString()}</div>
                </div>
            </div>

            {/* Legend */}
            <div className="legend-card">
                <div className="legend-title">School Categories</div>
                <div className="legend-items">
                    {Object.entries(stats.schoolsByCategory).map(([category, count]) => (
                        <div key={category} className="legend-item">
                            <span className="legend-icon">{categoryIcons[category] || '📍'}</span>
                            <div
                                className="legend-color"
                                style={{ backgroundColor: categoryColors[category] || '#667eea' }}
                            />
                            <span className="legend-label">
                                {categoryLabels[category] || category}
                            </span>
                            <span className="legend-count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Info */}
            <div className="info-card">
                <div className="info-icon">ℹ️</div>
                <div className="info-text">
                    Click on any district to view detailed statistics and schools
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
