import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../api/authService';
import AuthCard from '../../components/ui/AuthCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/form/Input';
import AuthLayout from '../../components/layout/AuthLayout';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);
    console.log('Sending this exact email to the backend:', email);
    try {
      await requestPasswordReset(email);
      setMessage('Success! OTP sent. Redirecting...');
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthLayout>
      <AuthCard title="Forgot Password" subtitle="Enter your email to receive a reset OTP.">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {message && <p className="text-sm text-center text-green-600">{message}</p>}
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Send Reset OTP
          </Button>
        </form>
        <div className="text-sm text-center mt-6">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
};

export default ForgotPasswordPage;