import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resetPasswordWithOtp } from '../../api/authService';
import { useToast } from '../../context/ToastContext'; // Import useToast
import AuthCard from '../../components/ui/AuthCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/form/Input';
import PasswordInput from '../../components/ui/form/PasswordInput';
import AuthLayout from '../../components/layout/AuthLayout';

const ResetPasswordPage = () => {
  const [stage, setStage] = useState('verifyOtp');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast(); // Use the toast hook

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }
  }, [searchParams]);

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length > 0 && email) {
      setStage('resetPassword');
    } else {
      addToast('Please fill in your email and OTP.', 'error');
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await resetPasswordWithOtp({ email, otp, newPassword });
      addToast('Password has been reset! Redirecting to login...', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      addToast('Failed to reset password. The OTP may be invalid or expired.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 } };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {stage === 'verifyOtp' && (
          <AuthCard title="Verify OTP" subtitle="Enter the OTP sent to your email.">
            <motion.form key="otpForm" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleOtpSubmit} className="space-y-6">
              <Input label="Email" name="email" type="email" required value={email} readOnly disabled className="bg-slate-100 cursor-not-allowed" />
              <Input label="OTP" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} />
              <Button type="submit" className="w-full">Verify OTP</Button>
            </motion.form>
          </AuthCard>
        )}

        {stage === 'resetPassword' && (
          <AuthCard title="Set New Password" subtitle="Enter your new password.">
            <motion.form key="passwordForm" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handlePasswordSubmit} className="space-y-6">
              <PasswordInput label="New Password" name="newPassword" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Button type="submit" isLoading={isSubmitting} className="w-full">Set New Password</Button>
            </motion.form>
          </AuthCard>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ResetPasswordPage;