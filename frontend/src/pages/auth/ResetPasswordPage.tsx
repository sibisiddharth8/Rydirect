import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resetPasswordWithOtp } from '../../api/authService';
import AuthCard from '../../components/ui/AuthCard';
import Button from '../../components/ui/Button';

const ResetPasswordPage = () => {
  const [stage, setStage] = useState('verifyOtp');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }
  }, [searchParams]);

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length > 0 && email) {
      setError('');
      setStage('resetPassword');
    } else {
      setError('Please fill in your email and OTP.');
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      await resetPasswordWithOtp({ email, otp, newPassword });
      setMessage('Password has been reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Failed to reset password. The OTP may be invalid or expired.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 } };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {stage === 'verifyOtp' && (
          <AuthCard title="Verify OTP" subtitle="Enter your email and the OTP we sent you.">
            <motion.form key="otpForm" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                <input id="email" type="email" required value={email} readOnly className="mt-1 block w-full px-3 py-2 bg-slate-100 border rounded-md cursor-not-allowed" />
              </div>
              <div>
                <label htmlFor="otp" className="text-sm font-medium text-slate-700">OTP</label>
                <input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border rounded-md" />
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <Button type="submit" className="w-full">Verify OTP</Button>
            </motion.form>
          </AuthCard>
        )}

        {stage === 'resetPassword' && (
          <AuthCard title="Reset Password" subtitle="Enter your new password.">
            <motion.form key="passwordForm" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handlePasswordSubmit} className="space-y-6">
               <div>
                <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">New Password</label>
                <input id="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border rounded-md" />
              </div>
              {message && <p className="text-sm text-green-600 text-center">{message}</p>}
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <Button type="submit" isLoading={isSubmitting} className="w-full">Set New Password</Button>
            </motion.form>
          </AuthCard>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResetPasswordPage;