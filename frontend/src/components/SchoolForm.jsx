import React, { useState } from 'react';
import { createSchool } from '../services/api';
import './SchoolForm.css';
import './FormControls.css'; // Shared Controls
import { SCHOOL_CATEGORIES } from '../theme';

const SchoolForm = ({ coordinates, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'primary',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('School name is required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await createSchool({
                name: formData.name,
                category: formData.category,
                longitude: coordinates.longitude,
                latitude: coordinates.latitude,
            });

            onSubmit();
        } catch (err) {
            console.error('Error creating school:', err);
            setError('Failed to create school. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="school-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="form-header">
                    <h2>Add New School</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">School Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Lahore Grammar School"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="control-select"
                        >
                            {Object.entries(SCHOOL_CATEGORIES).map(([key, config]) => {
                                if (key === 'default') return null;
                                return (
                                    <option key={key} value={key}>
                                        {config.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="coordinates-info">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>
                            {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                        </span>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Adding...
                                </>
                            ) : (
                                'Add School'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SchoolForm;
