import api from '../lib/axios';

export const getDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

export const getTopLinks = async () => {
  const { data } = await api.get('/dashboard/top-links');
  return data;
};

export const getRecentLinks = async () => {
  const { data } = await api.get('/dashboard/recent-links');
  return data;
};