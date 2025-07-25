import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthCard from '../../components/ui/AuthCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/form/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <AuthCard title="Admin Login">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          <div className="text-sm text-right">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Sign in
          </Button>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;