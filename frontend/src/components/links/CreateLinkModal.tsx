import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ToggleSwitch from '../ui/ToggleSwitch';
import Fieldset from '../ui/form/Fieldset';
import Input from '../ui/form/Input';
import Select from '../ui/form/Select';
import ImageUpload from '../ui/form/ImageUpload';
import IconUpload from '../ui/form/IconUpload';

const CreateLinkModal = ({ isOpen, onClose, onSave, batches, linkData }) => {
  const initialFormState = {
    // Core Details
    name: '', shortCode: '', redirectTo: '', batchId: '', iconUrl: null,
    // Scheduling & Security
    visibility: 'PUBLIC', password: '', isPaused: false, activeFrom: '', activeUntil: '',
    // Redirect Experience
    useSplashPage: false,
    splashPageDuration: 3,
    splashPageDesign: 'minimal',
    // Branding fields for Splash Screens
    companyName: '', companyLogoUrl: null, heroImageUrl: null, ctaText: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (linkData) {
        setFormData({ ...initialFormState, ...linkData, password: '' });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, linkData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : false;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleImageUpload = (fieldName: string, url: string | null) => {
    setFormData(prev => ({ ...prev, [fieldName]: url }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData,
        activeFrom: formData.activeFrom || null,
        activeUntil: formData.activeUntil || null,
        splashPageDuration: Number(formData.splashPageDuration),
      };
      await onSave(payload);
      addToast(linkData ? 'Link updated successfully!' : 'Link created successfully!', 'success');
      onClose();
    } catch (apiError) {
      addToast(apiError.response?.data?.error || 'An unexpected error occurred.', 'error');
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
          <div className="flex items-start gap-4">
            <IconUpload
              iconUrl={formData.iconUrl}
              onUploadSuccess={(url) => handleImageUpload('iconUrl', url)}
              onRemove={() => handleImageUpload('iconUrl', null)}
            />
            <div className="flex-grow space-y-4">
              <Input label="Name" name="name" type="text" value={formData.name} onChange={handleChange} required />
              <Input label="Redirect URL" name="redirectTo" type="url" value={formData.redirectTo} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Short Code" name="shortCode" type="text" value={formData.shortCode} onChange={handleChange} required />
            <Select label="Batch" name="batchId" value={formData.batchId || ''} onChange={handleChange}>
              <option value="">No Batch</option>
              {batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
            </Select>
          </div>
        </fieldset>

        <Fieldset title="Scheduling & Security">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Active From (Optional)" name="activeFrom" type="date" value={formData.activeFrom} onChange={handleChange} />
            <Input label="Active Until (Optional)" name="activeUntil" type="date" value={formData.activeUntil} onChange={handleChange} />
          </div>
          <Select label="Visibility" name="visibility" value={formData.visibility} onChange={handleChange}>
            <option value="PUBLIC">Public (Visible on /all page)</option>
            <option value="PRIVATE">Private (Password Protected)</option>
            <option value="SHARE">Shareable (Unlisted)</option>
          </Select>
          {formData.visibility === 'PRIVATE' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Input 
                    label="Set Password (Optional)" 
                    name="password" 
                    type="password" 
                    placeholder={linkData?.password ? "Leave blank to keep unchanged" : "Leave blank for no password"}
                    value={formData.password}
                    onChange={handleChange} 
                />
            </motion.div>
          )}
          <div className="flex items-center justify-between pt-2">
            <label htmlFor="isPaused" className="font-medium text-slate-700">Pause this link</label>
            <ToggleSwitch enabled={formData.isPaused} onChange={handleChange} name="isPaused" id="isPaused" />
          </div>
        </Fieldset>
        
        <Fieldset title="Redirect Experience">
           <div className="flex items-center justify-between">
            <label htmlFor="useSplashPage" className="font-medium text-slate-700">Use Redirect Splash Page</label>
            <ToggleSwitch enabled={formData.useSplashPage} onChange={handleChange} name="useSplashPage" id="useSplashPage" />
          </div>
          
          {formData.useSplashPage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 bg-slate-50 p-4 rounded-md mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Select label="Splash Page Design" name="splashPageDesign" value={formData.splashPageDesign} onChange={handleChange}>
                  <option value="minimal">Minimal</option>
                  <option value="branded">Branded</option>
                  <option value="company">Company</option>
                </Select>
                <Input 
                  label="Delay (sec)" 
                  name="splashPageDuration" 
                  type="number" 
                  value={formData.splashPageDuration}
                  onChange={handleChange} 
                  min="1" max="10" 
                />
              </div>

              {formData.splashPageDesign === 'company' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4 mt-4 border-t">
                  <Input label="Company Name" name="companyName" value={formData.companyName || ''} onChange={handleChange} />
                  <Input label="Call-to-Action Text" name="ctaText" value={formData.ctaText || ''} onChange={handleChange} placeholder="e.g., Learn More" />
                  <div className="grid grid-cols-2 gap-4">
                    <ImageUpload label="Company Logo" imageUrl={formData.companyLogoUrl} onUploadSuccess={(url) => handleImageUpload('companyLogoUrl', url)} onRemove={() => handleImageUpload('companyLogoUrl', null)} />
                    <ImageUpload label="Hero Image" imageUrl={formData.heroImageUrl} onUploadSuccess={(url) => handleImageUpload('heroImageUrl', url)} onRemove={() => handleImageUpload('heroImageUrl', null)} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </Fieldset>
      </form>
    </Modal>
  );
};

export default CreateLinkModal;