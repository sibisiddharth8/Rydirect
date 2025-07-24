import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Check, X } from 'lucide-react';
import Modal from '../ui/Modal';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../../api/batchesService';

const ManageBatchesModal = ({ isOpen, onClose }) => {
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState('');
  const [editingBatch, setEditingBatch] = useState(null); // { id, name }

  const fetchBatchesData = async () => {
    const data = await getBatches();
    setBatches(data);
  };

  useEffect(() => {
    if (isOpen) {
      fetchBatchesData();
    }
  }, [isOpen]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newBatchName) return;
    await createBatch({ name: newBatchName });
    setNewBatchName('');
    fetchBatchesData();
  };

  const handleUpdate = async (id, name) => {
    await updateBatch(id, { name });
    setEditingBatch(null);
    fetchBatchesData();
  };
  
  const handleDelete = async (id) => {
      if(window.confirm('Are you sure you want to delete this batch? Links in this batch will not be deleted.')) {
        await deleteBatch(id);
        fetchBatchesData();
      }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Batches">
      <div className="space-y-4">
        {/* List of existing batches */}
        <div className="max-h-60 overflow-y-auto pr-2">
          <ul className="space-y-2">
            {batches.map(batch => (
              <li key={batch.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                {editingBatch?.id === batch.id ? (
                  <input
                    type="text"
                    value={editingBatch.name}
                    onChange={(e) => setEditingBatch(prev => ({...prev, name: e.target.value}))}
                    className="flex-grow border-slate-300 rounded-md shadow-sm text-sm"
                  />
                ) : (
                  <span className="text-sm text-slate-700">{batch.name}</span>
                )}
                
                <div className="flex items-center gap-2">
                  {editingBatch?.id === batch.id ? (
                    <>
                      <button onClick={() => handleUpdate(editingBatch.id, editingBatch.name)} className="p-1 text-green-500 hover:text-green-700"><Check size={16} /></button>
                      <button onClick={() => setEditingBatch(null)} className="p-1 text-red-500 hover:text-red-700"><X size={16} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingBatch({id: batch.id, name: batch.name})} className="p-1 text-slate-500 hover:text-blue-600"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(batch.id)} className="p-1 text-slate-500 hover:text-red-600"><Trash2 size={16} /></button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form to create a new batch */}
        <form onSubmit={handleCreate} className="pt-4 border-t flex gap-2">
          <input
            type="text"
            placeholder="New batch name..."
            value={newBatchName}
            onChange={(e) => setNewBatchName(e.target.value)}
            className="flex-grow border-slate-300 rounded-md shadow-sm"
          />
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add</button>
        </form>
      </div>
    </Modal>
  );
};

export default ManageBatchesModal;