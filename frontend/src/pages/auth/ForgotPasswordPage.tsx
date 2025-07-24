import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { requestPasswordReset } from '../../api/authService';
import AuthCard from '../../components/ui/AuthCard';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      setMessage('Success! OTP sent. Redirecting you to the next step...');
      
      // Automatically navigate to the reset page after 2 seconds
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
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {message && <p className="text-sm text-center text-green-600">{message}</p>}
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset OTP'}
            </button>
          </div>
        </form>
         <div className="text-sm text-center mt-4">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to login
            </Link>
          </div>
      </AuthCard>
    </div>
  )
};

export default ForgotPasswordPage;