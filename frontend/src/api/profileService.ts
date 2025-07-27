import api from '../lib/axios';

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/profile', profileData);
  return data;
};