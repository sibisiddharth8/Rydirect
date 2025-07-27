import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../api/authService';
import { updateProfile } from '../../api/profileService';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/ui/form/Input';
import ProfileImageUpload from '../../components/settings/ProfileImageUpload';
import Loader from '../../components/ui/Loader';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, fetchUserProfile, loading: authLoading } = useAuth();

  // State for Profile Form
  const [profileData, setProfileData] = useState({ name: '', bio: '', profileImageUrl: null });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // State for Password Form
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        profileImageUrl: user.profileImageUrl || null,
      });
    }
  }, [user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData(prev => ({...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile(profileData);
      const refreshedUser = await fetchUserProfile(); 
      
      if (refreshedUser) {
        setProfileData({
            name: refreshedUser.name || '',
            bio: refreshedUser.bio || '',
            profileImageUrl: refreshedUser.profileImageUrl || null,
        });
      }

      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to update profile.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    setIsSavingPassword(true);
    try {
      const response = await changePassword({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
      addToast(response.message, 'success');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update password.', 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };
  
  const TABS = ['Profile', 'Security'];

  if (authLoading) {
    return <Loader text="Loading settings..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <nav className="flex flex-row md:flex-col md:space-y-1">
            {TABS.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`cursor-pointer w-full px-4 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="p-4 rounded-lg space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">Public Profile</h2>
                    <p className="mt-1 text-sm text-slate-500">This information will be displayed on your public pages.</p>
                  </div>
                  <ProfileImageUpload 
                    imageUrl={profileData.profileImageUrl}
                    onImageChange={(url) => setProfileData(prev => ({...prev, profileImageUrl: url}))}
                    name={profileData.name}
                  />
                  <Input label="Name" name="name" value={profileData.name} onChange={handleProfileChange} />
                  <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                      <textarea id="bio" name="bio" rows={3} value={profileData.bio} onChange={handleProfileChange} className="p-2 block w-full rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="flex justify-end pt-6">
                    <Button type="submit" isLoading={isSavingProfile}>Save Profile</Button>
                  </div>
                </form>
              )}
              
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit} className="p-4 rounded-lg space-y-4">
                   <div>
                    <h2 className="text-xl font-semibold text-slate-800">Change Password</h2>
                    <p className="mt-1 text-sm text-slate-500">Update your password for enhanced security.</p>
                  </div>
                  <Input label="Current Password" name="oldPassword" type="password" required value={passwordData.oldPassword} onChange={handlePasswordChange} />
                  <Input label="New Password" name="newPassword" type="password" required minLength={6} value={passwordData.newPassword} onChange={handlePasswordChange} />
                  <Input label="Confirm New Password" name="confirmPassword" type="password" required value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                  <div className="flex justify-end pt-6">
                    <Button type="submit" isLoading={isSavingPassword}>Update Password</Button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;