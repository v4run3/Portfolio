const DEFAULT_DEV_API_URL = 'http://localhost:8787';
const DEFAULT_PROD_API_URL = 'https://portfolio-api.varun31201.workers.dev';

function resolveApiUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');

  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return DEFAULT_DEV_API_URL;
    }
    if (protocol === 'https:') {
      return DEFAULT_PROD_API_URL;
    }
  }

  return DEFAULT_DEV_API_URL;
}

export const apiUrl = resolveApiUrl();

export const linkedInUrl = 'https://www.linkedin.com/in/varun-vinay-bhonslay/';
