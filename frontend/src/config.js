// Configuration file for environment variables

const config = {
    mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN || '',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
};

export default config;
