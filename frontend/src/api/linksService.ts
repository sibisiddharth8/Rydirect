import api from '../lib/axios';

// Fetch links with pagination and filters
export const getLinks = async (params) => {
  const { data } = await api.get('/links', { params });
  return data;
};

// Create a new link
export const createLink = async (linkData) => {
  const { data } = await api.post('/links', linkData);
  return data;
};

// Update an existing link
export const updateLink = async (id, linkData) => {
  const { data } = await api.put(`/links/${id}`, linkData);
  return data;
};

// Delete a link
export const deleteLink = async (id) => {
  await api.delete(`/links/${id}`);
};

// Perform bulk actions
export const bulkUpdateLinks = async (action, linkIds, payload = {}) => {
  const { data } = await api.post('/links/bulk', { action, linkIds, payload });
  return data;
};