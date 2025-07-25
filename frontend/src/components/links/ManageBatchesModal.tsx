import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/form/Input';
import Loader from '../ui/Loader';
import BatchListItem from './BatchListItem';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../../api/batchesService';

const ManageBatchesModal = ({ isOpen, onClose }) => {
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);

  const fetchBatchesData = async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBatchesData();
    }
  }, [isOpen]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newBatchName) return;
    setIsCreating(true);
    await createBatch({ name: newBatchName });
    setNewBatchName('');
    await fetchBatchesData();
    setIsCreating(false);
  };

  const handleUpdate = async (id, name) => {
    await updateBatch(id, { name });
    await fetchBatchesData();
  };
  
  const handleDelete = async () => {
    if (!batchToDelete) return;
    await deleteBatch(batchToDelete.id);
    setBatchToDelete(null);
    await fetchBatchesData();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Manage Batches">
        <div className="space-y-4">
          <div className="max-h-60 min-h-[10rem] overflow-y-auto pr-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader text="Loading batches..." />
              </div>
            ) : batches.length > 0 ? (
              <ul className="space-y-1">
                {batches.map(batch => (
                  <BatchListItem 
                    key={batch.id}
                    batch={batch}
                    onUpdate={handleUpdate}
                    onDelete={setBatchToDelete}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-sm text-slate-500">
                <p>You haven't created any batches yet.</p>
              </div>
            )}
          </div>
          <form onSubmit={handleCreate} className="pt-4 border-t flex items-end gap-2">
            <div className="flex-grow">
              <Input
                label="Create New Batch"
                name="newBatchName"
                placeholder="Social Media..."
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
              />
            </div>
            <Button type="submit" isLoading={isCreating}>Add</Button>
          </form>
        </div>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal
        isOpen={!!batchToDelete}
        onClose={() => setBatchToDelete(null)}
        title="Confirm Deletion"
        footer={
          <>
            <Button variant="secondary" onClick={() => setBatchToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Batch</Button>
          </>
        }
      >
        <p>Are you sure you want to delete the "<strong>{batchToDelete?.name}</strong>" batch? 
        <br/><br/>
        <span className="text-sm text-slate-500">Links within this batch will not be deleted.</span>
        </p>
      </Modal>
    </>
  );
};

export default ManageBatchesModal;