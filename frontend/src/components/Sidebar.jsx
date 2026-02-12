import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import './FormControls.css'; // Import Shared Form Controls
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SCHOOL_CATEGORIES, getColor, getLabel } from '../theme';

const Sidebar = ({
    onProvinceSelect,
    onSearch,
    stats,
    districts,
    selectedProvince,
    schools,
    onFlyTo,
    onSelectSchool
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('stats');

    // Automatically switch to list view if a province is selected
    useEffect(() => {
        if (selectedProvince && selectedProvince !== 'all') {
            setViewMode('list');
        } else {
            setViewMode('stats');
        }
    }, [selectedProvince]);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (onSearch) onSearch(term);
    };

    const handleProvinceChange = (e) => {
        onProvinceSelect(e.target.value);
    };

    // Filter schools for the list
    const filteredSchools = schools && selectedProvince !== 'all'
        ? schools.filter(s => s.properties.province_name === selectedProvince)
        : [];

    const displaySchools = searchTerm
        ? (schools || []).filter(s => s.properties.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : filteredSchools;

    // Prepare chart data from stats
    const chartData = stats && stats.schoolsByCategory ? Object.entries(stats.schoolsByCategory).map(([key, value]) => ({
        name: getLabel(key),
        value: value,
        color: getColor(key)
    })) : [];

    const uniqueProvinces = districts ? [...new Set(districts.map(d => d.properties.province_name).filter(Boolean))].sort() : [];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Flex Container: Header (Fixed) */}
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">PK</div>
                    {!collapsed && <h1 className="logo-text">Pakistan <span className="logo-badge">School Map</span></h1>}
                </div>
                <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? '→' : '←'}
                </button>
            </div>

            {/* Flex Container: Scrollable Content Wrapper */}
            <div className="sidebar-content-wrapper">

                {/* Fixed Search & Filter Section */}
                <div className="sidebar-controls">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        {!collapsed && (
                            <input
                                type="text"
                                placeholder="Search schools by name..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        )}
                    </div>

                    <div className="filter-group">
                        {!collapsed && <label className="filter-label">Province Filter</label>}
                        {!collapsed ? (
                            <select
                                value={selectedProvince || 'all'}
                                onChange={handleProvinceChange}
                                className="control-select"
                            >
                                <option value="all">All Provinces</option>
                                {uniqueProvinces.map(p => (
                                    <option key={p} value={p}>
                                        {p.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="collapsed-icon" title="Filter Province">▼</div>
                        )}
                    </div>

                    {!collapsed && selectedProvince !== 'all' && (
                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${viewMode === 'stats' ? 'active' : ''}`}
                                onClick={() => setViewMode('stats')}
                            >Stats</button>
                            <button
                                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >Directory</button>
                        </div>
                    )}
                </div>

                {/* Flexible Scrollable Content Area */}
                {!collapsed && (
                    <div className="sidebar-scroll-area">

                        {/* STATS VIEW */}
                        {viewMode === 'stats' && stats && (
                            <div className="stats-container">
                                <h3 className="section-title">Overview</h3>

                                <div className="stat-grid">
                                    <div className="stat-card-mini">
                                        <div className="stat-value">{stats.totalSchools?.toLocaleString()}</div>
                                        <div className="stat-label">Schools</div>
                                    </div>
                                    <div className="stat-card-mini">
                                        <div className="stat-value">{stats.totalDistricts?.toLocaleString()}</div>
                                        <div className="stat-label">Districts</div>
                                    </div>
                                </div>

                                <div className="chart-container">
                                    <h4 className="chart-title">Distribution</h4>
                                    <div style={{ width: '100%', height: 160 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    innerRadius={40}
                                                    outerRadius={60}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ background: '#1a202c', border: 'none', color: '#fff' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mini-legend">
                                        {chartData.map((d, i) => (
                                            <div key={i} className="legend-row">
                                                <span className="dot" style={{ background: d.color }}></span>
                                                <span className="label">{d.name}</span>
                                                <span className="val">{d.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LIST VIEW */}
                        {viewMode === 'list' && (
                            <div className="school-list-container">
                                <div className="list-header">
                                    <h3 className="section-title">Directory Results ({displaySchools.length})</h3>
                                </div>
                                <div className="list-items">
                                    {displaySchools.length > 0 ? (
                                        displaySchools.map(school => {
                                            const categoryKey = school.properties.category || 'default';
                                            const categoryConfig = SCHOOL_CATEGORIES[categoryKey] || SCHOOL_CATEGORIES.default;

                                            return (
                                                <div
                                                    key={school.id}
                                                    className="school-card"
                                                    onClick={() => onSelectSchool && onSelectSchool(school)}
                                                >
                                                    <div className="card-header">
                                                        <h4 className="school-name">{school.properties.name}</h4>
                                                        <span
                                                            className="badge"
                                                            style={{
                                                                color: categoryConfig.color,
                                                                background: categoryConfig.badgeBg,
                                                                border: `1px solid ${categoryConfig.badgeBorder}`
                                                            }}
                                                        >
                                                            {categoryConfig.label}
                                                        </span>
                                                    </div>

                                                    <div className="card-body">
                                                        <div className="meta-row">
                                                            <span className="meta-icon">📍</span>
                                                            <span className="meta-text">
                                                                {school.properties.district_name || 'Unknown District'}
                                                            </span>
                                                        </div>
                                                        {school.properties.gender && (
                                                            <div className="meta-row">
                                                                <span className="meta-icon">👤</span>
                                                                <span className="meta-text">
                                                                    {school.properties.gender}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="card-actions">
                                                        <button className="action-btn details-btn">
                                                            View Details
                                                        </button>
                                                        <button
                                                            className="action-btn fly-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Don't trigger card click
                                                                onFlyTo && onFlyTo(school);
                                                            }}
                                                            title="Fly to Location"
                                                        >
                                                            ✈️ Fly To
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="no-results">
                                            <p>No schools found matching your criteria.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Flex Container: Footer (Fixed) */}
            <div className="sidebar-footer">
                {!collapsed && <div className="user-profile">
                    <div className="avatar">A</div>
                    <div className="user-info">
                        <span className="name">Admin User</span>
                        <span className="role">GIS Manager</span>
                    </div>
                </div>}
            </div>
        </aside>
    );
};

export default Sidebar;
