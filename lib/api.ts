export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'
).replace(/\/$/, '');

export const API_PROXY_PREFIX = '/api';

export const HEALTH_ENDPOINT = `${API_BASE_URL}/api/health`;
export const DASHBOARD_SUMMARY_ENDPOINT = `${API_BASE_URL}/api/dashboard/summary`;
export const CASES_ENDPOINT = `${API_PROXY_PREFIX}/cases`;
export const AMBULANCES_ENDPOINT = `${API_PROXY_PREFIX}/ambulances`;
export const SOS_ENDPOINT = `${API_PROXY_PREFIX}/sos`;
