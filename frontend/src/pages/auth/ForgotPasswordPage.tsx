import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../api/authService';
import AuthCard from '../../components/ui/AuthCard';
import Button from '../../components/ui/Button';

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
    try {
      await requestPasswordReset(email);
      setMessage('Success! OTP sent. Redirecting you to the next step...');
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setIsSubmitting(false);
      console.error(err);
    }
  };
  
  return (
     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <AuthCard title="Forgot Password" subtitle="Enter your email to receive a reset OTP.">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"
            />
          </div>
          {message && <p className="text-sm text-center text-green-600">{message}</p>}
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Send Reset OTP
            </Button>
          </div>
        </form>
         <div className="text-sm text-center mt-4">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Back to login
            </Link>
          </div>
      </AuthCard>
    </div>
  )
};

export default ForgotPasswordPage;