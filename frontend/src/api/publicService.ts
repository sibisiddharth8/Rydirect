import api from '../lib/axios';

export const getPublicLinks = async () => {
  const { data } = await api.get('/public/links');
  return data;
};