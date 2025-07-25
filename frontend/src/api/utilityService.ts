import api from '../lib/axios';

export const getQrCodeDataUrl = async (url: string) => {
  const { data } = await api.get('/utility/qrcode', {
    params: { url }
  });
  return data;
};