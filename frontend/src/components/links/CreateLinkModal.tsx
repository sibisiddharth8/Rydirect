import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ToggleSwitch from '../ui/ToggleSwitch';
import Fieldset from '../ui/form/Fieldset';
import Input from '../ui/form/Input';
import Select from '../ui/form/Select';

const CreateLinkModal = ({ isOpen, onClose, onSave, batches, linkData }) => {
  const initialFormState = {
    name: '', shortCode: '', redirectTo: '', batchId: '', visibility: 'PRIVATE',
    isPaused: false, useSplashPage: false, splashPageDuration: 3,
    splashPageDesign: 'minimal', activeFrom: '', activeUntil: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (linkData) {
        setFormData({
          ...initialFormState, ...linkData,
          activeFrom: linkData.activeFrom ? linkData.activeFrom.split('T')[0] : '',
          activeUntil: linkData.activeUntil ? linkData.activeUntil.split('T')[0] : '',
        });
      } else {
        setFormData(initialFormState);
      }
      setError('');
    }
  }, [isOpen, linkData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : false;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        activeFrom: formData.activeFrom || null,
        activeUntil: formData.activeUntil || null,
        splashPageDuration: Number(formData.splashPageDuration),
      };
      await onSave(payload);
    } catch (apiError) {
      setError(apiError.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={linkData ? "Edit Link" : "Create New Link"}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="link-form" isLoading={isSaving}>Save Link</Button>
        </>
      }
    >
      <form id="link-form" onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-4">
          <Input label="Name" name="name" type="text" value={formData.name} onChange={handleChange} required />
          <Input label="Redirect URL" name="redirectTo" type="url" value={formData.redirectTo} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Short Code" name="shortCode" type="text" value={formData.shortCode} onChange={handleChange} required />
            <Select label="Batch" name="batchId" value={formData.batchId || ''} onChange={handleChange}>
              <option value="">No Batch</option>
              {batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
            </Select>
          </div>
        </fieldset>

        <Fieldset title="Scheduling & Visibility">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Active From (Optional)" name="activeFrom" type="date" value={formData.activeFrom} onChange={handleChange} />
            <Input label="Active Until (Optional)" name="activeUntil" type="date" value={formData.activeUntil} onChange={handleChange} />
          </div>
          <Select label="Visibility" name="visibility" value={formData.visibility} onChange={handleChange}>
            <option value="PRIVATE">Private (Active but unlisted)</option>
            <option value="PUBLIC">Public (Visible on /all page)</option>
            <option value="SHARE">Shareable (Same as Private)</option>
          </Select>
          <div className="flex items-center justify-between pt-2">
            <label htmlFor="isPaused" className="font-medium text-slate-700">Pause this link</label>
            <ToggleSwitch enabled={formData.isPaused} onChange={handleChange} name="isPaused" id="isPaused" />
          </div>
        </Fieldset>
        
        <Fieldset>
          <div className="flex items-center justify-between">
            <label htmlFor="useSplashPage" className="font-medium text-slate-700">Use Redirect Splash Page</label>
            <ToggleSwitch enabled={formData.useSplashPage} onChange={handleChange} name="useSplashPage" id="useSplashPage" />
          </div>
          
          {formData.useSplashPage && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 bg-slate-50 p-4 rounded-md mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Select label="Design" name="splashPageDesign" value={formData.splashPageDesign} onChange={handleChange}>
                  <option value="minimal">Minimal</option>
                  <option value="branded">Branded</option>
                </Select>
                <Input label="Delay (sec)" name="splashPageDuration" type="number" value={formData.splashPageDuration} onChange={handleChange} min="1" max="10" />
              </div>
            </motion.div>
          )}
        </Fieldset>

        {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
      </form>
    </Modal>
  );
};

export default CreateLinkModal;