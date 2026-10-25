// Marketplace Application configuration
export const WEBSITE_URL = (import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173').replace(/\/+$/, '');

export const getWebsiteUrl = (path = '') => {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${WEBSITE_URL}${cleanPath}`;
};
