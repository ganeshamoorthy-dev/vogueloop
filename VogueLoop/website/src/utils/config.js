// Website Application configuration
export const APP_URL = (import.meta.env.VITE_APP_URL || 'http://localhost:5174').replace(/\/+$/, '');

export const getAppUrl = (path = '') => {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${APP_URL}${cleanPath}`;
};
