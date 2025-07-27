import api from '../lib/axios';

// All functions now accept a 'period' parameter
export const getClicksData = async (period: string) => {
  const { data } = await api.get('/analytics/clicks-over-time', { params: { period } });
  return data;
};

export const getGeoData = async (period: string) => {
  const { data } = await api.get('/analytics/geo', { params: { period } });
  return data;
};

export const getReferrersData = async (period: string) => {
  const { data } = await api.get('/analytics/referrers', { params: { period } });
  return data;
};