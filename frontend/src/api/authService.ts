import api from '../lib/axios';

export const loginUser = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const requestPasswordReset = async (email: any) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPasswordWithOtp = async (payload) => {
  const { data } = await api.post('/auth/reset-password-otp', payload);
  return data;
};