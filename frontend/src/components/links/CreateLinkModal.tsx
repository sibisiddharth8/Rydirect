import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';

const CreateLinkModal = ({ isOpen, onClose, onSave, batches, linkData }) => {
  // Add the new splash page fields to the initial state
  const initialFormState = {
    name: '',
    shortCode: '',
    redirectTo: '',
    batchId: '',
    visibility: 'PRIVATE',
    isPaused: false,
    activeFrom: '',
    activeUntil: '',
    useSplashPage: false,
    splashPageDuration: 3,
    splashPageDesign: 'minimal',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (linkData) {
      setFormData({
        ...initialFormState,
        ...linkData,
        // Format dates for input fields
        activeFrom: linkData.activeFrom ? linkData.activeFrom.split('T')[0] : '',
        activeUntil: linkData.activeUntil ? linkData.activeUntil.split('T')[0] : '',
      });
    } else {
      setFormData(initialFormState);
    }
    setError(''); // Reset error on open
  }, [isOpen, linkData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      // Prepare payload, ensuring data types are correct for the API
      const payload = {
          ...formData,
          activeFrom: formData.activeFrom || null,
          activeUntil: formData.activeUntil || null,
          splashPageDuration: Number(formData.splashPageDuration), // Ensure duration is a number
      };
      await onSave(payload);
      onClose(); // Close modal on successful save
    } catch (apiError: any) {
      // Display specific API errors
      setError(apiError.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={linkData ? "Edit Link" : "Create New Link"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name, Short Code, Redirect URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Short Code</label>
              <input type="text" name="shortCode" value={formData.shortCode} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Visibility</label>
              <select name="visibility" value={formData.visibility} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm">
                <option value="PRIVATE">Private</option>
                <option value="PUBLIC">Public</option>
                <option value="SHARE">Shareable</option>
              </select>
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Redirect URL</label>
          <input type="url" name="redirectTo" value={formData.redirectTo} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm" required />
        </div>

        {/* Scheduling and Batch */}
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Active From (Optional)</label>
              <input type="date" name="activeFrom" value={formData.activeFrom} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Active Until (Optional)</label>
              <input type="date" name="activeUntil" value={formData.activeUntil} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm" />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Batch</label>
            <select name="batchId" value={formData.batchId || ''} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm">
                <option value="">No Batch</option>
                {batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
            </select>
        </div>
        <div className="flex items-center">
            <input type="checkbox" name="isPaused" id="isPaused" checked={formData.isPaused} onChange={handleChange} className="h-4 w-4 text-blue-600 border-slate-300 rounded" />
            <label htmlFor="isPaused" className="ml-2 block text-sm text-slate-900">Pause this link</label>
        </div>
        
        {/* --- NEW SPLASH PAGE OPTIONS --- */}
        <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
                <label htmlFor="useSplashPage" className="font-medium text-slate-700">Use Redirect Splash Page</label>
                <input 
                    type="checkbox" 
                    name="useSplashPage" 
                    id="useSplashPage" 
                    checked={formData.useSplashPage} 
                    onChange={handleChange} 
                    className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                />
            </div>
        </div>

        {formData.useSplashPage && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 bg-slate-50 p-4 rounded-md"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Design</label>
                        <select name="splashPageDesign" value={formData.splashPageDesign} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm">
                            <option value="minimal">Minimal</option>
                            <option value="branded">Branded</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Delay (seconds)</label>
                        <input type="number" name="splashPageDuration" value={formData.splashPageDuration} onChange={handleChange} min="1" max="10" className="mt-1 block w-full border-slate-300 rounded-md shadow-sm" />
                    </div>
                </div>
            </motion.div>
        )}
        
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Link</button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateLinkModal;