import api from '../lib/axios';

export const getPublicLinks = async () => {
  const { data } = await api.get('/public/links');
  return data;
};

export const verifyLinkPassword = async (shortCode: string, password: string) => {
  const { data } = await api.post('/public/verify-password', { shortCode, password });
  return data;
};

export const getPublicProfile = async () => {
  const { data } = await api.get('/public/profile');
  return data;
};

export const getPublicLinkByShortCode = async (shortCode: string) => {
  const { data } = await api.get(`/public/link/${shortCode}`);
  return data;
};

export const getQrPageData = async (shortCode: string) => {
  const { data } = await api.get(`/public/qr/${shortCode}`);
  return data;
};