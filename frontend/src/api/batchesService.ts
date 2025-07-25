import api from '../lib/axios';

// Fetch all batches (for dropdowns, etc.)
export const getBatches = async () => {
  const { data } = await api.get('/batches', { params: { limit: 100 } });
  return data.data;
};

// Create a new batch
export const createBatch = async (batchData) => {
  const { data } = await api.post('/batches', batchData);
  return data;
};

// --- ADD THESE NEW FUNCTIONS ---

// Update a batch
export const updateBatch = async (id, batchData) => {
  const { data } = await api.put(`/batches/${id}`, batchData);
  return data;
};

// Delete a batch
export const deleteBatch = async (id) => {
  await api.delete(`/batches/${id}`);
};

export const getTopBatches = async () => {
  const { data } = await api.get('/batches/top');
  return data;
};