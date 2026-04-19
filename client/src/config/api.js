export function getApiBaseUrl() {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    const protocol = window.location.protocol || 'http:';
    return `${protocol}//${host}:5000`;
  }

  return 'http://localhost:5000';
}

export const API_BASE_URL = getApiBaseUrl();

export function apiUrl(path) {
  if (!path) return API_BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

