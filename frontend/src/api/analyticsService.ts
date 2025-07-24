import api from '../lib/axios';

export const getClicksData = async () => {
  const { data } = await api.get('/analytics/clicks-over-time');
  return data;
};

export const getGeoData = async () => {
  const { data } = await api.get('/analytics/geo');
  return data;
};

export const getReferrersData = async () => {
  const { data } = await api.get('/analytics/referrers');
  return data;
};