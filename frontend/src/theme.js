export const SCHOOL_CATEGORIES = {
    primary: {
        label: 'Primary',
        color: '#4facfe',
        badgeBg: 'rgba(79, 172, 254, 0.15)',
        badgeBorder: 'rgba(79, 172, 254, 0.3)'
    },
    secondary: {
        label: 'Secondary',
        color: '#f093fb',
        badgeBg: 'rgba(240, 147, 251, 0.15)',
        badgeBorder: 'rgba(240, 147, 251, 0.3)'
    },
    higher_secondary: {
        label: 'Higher Secondary',
        color: '#ffd93d',
        badgeBg: 'rgba(255, 217, 61, 0.15)',
        badgeBorder: 'rgba(255, 217, 61, 0.3)'
    },
    university: {
        label: 'University',
        color: '#f5576c',
        badgeBg: 'rgba(245, 87, 108, 0.15)',
        badgeBorder: 'rgba(245, 87, 108, 0.3)'
    },
    default: {
        label: 'Other',
        color: '#cbd5e0',
        badgeBg: 'rgba(203, 213, 224, 0.15)',
        badgeBorder: 'rgba(203, 213, 224, 0.3)'
    }
};

export const getColor = (category) => {
    return (SCHOOL_CATEGORIES[category] || SCHOOL_CATEGORIES.default).color;
};

export const getLabel = (category) => {
    return (SCHOOL_CATEGORIES[category] || SCHOOL_CATEGORIES.default).label;
};
