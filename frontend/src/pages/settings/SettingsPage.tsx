import { useState } from 'react';
import { motion } from 'framer-motion';
import { changePassword } from '../../api/authService';
import Button from '../../components/ui/Button';

const SettingsPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await changePassword({ oldPassword, newPassword });
      setMessage(response.message || 'Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
        <h2 className="text-xl font-semibold text-slate-800">Change Password</h2>
        <p className="mt-1 text-sm text-slate-500">Update your password for enhanced security.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-700">Current Password</label>
            <input id="oldPassword" type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mt-1 block w-full rounded-md" />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">New Password</label>
            <input id="newPassword" type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm New Password</label>
            <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md" />
          </div>

          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SettingsPage;