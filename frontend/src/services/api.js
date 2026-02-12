import axios from 'axios';
import config from '../config';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Get all districts with boundaries
 */
export const getDistricts = async () => {
    const response = await api.get('/districts/');
    return response.data;
};

/**
 * Search districts by name
 */
export const searchDistrict = async (query) => {
    const response = await api.get(`/districts/?search=${encodeURIComponent(query)}`);
    return response.data;
};

/**
 * Get district statistics
 */
export const getDistrictStats = async (districtId) => {
    const response = await api.get(`/districts/${districtId}/stats/`);
    return response.data;
};

/**
 * Get all schools
 */
export const getSchools = async () => {
    const response = await api.get('/schools/');
    return response.data;
};

/**
 * Create a new school
 */
export const createSchool = async (schoolData) => {
    const response = await api.post('/schools/', schoolData);
    return response.data;
};

export default api;
