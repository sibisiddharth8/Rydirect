import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext'; // Import useToast
import AuthCard from '../../components/ui/AuthCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/form/Input';
import PasswordInput from '../../components/ui/form/PasswordInput';
import AuthLayout from '../../components/layout/AuthLayout';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast(); // Use the toast hook
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      // Use toast for error messages
      addToast('Failed to login. Please check your credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Rydirect Login" subtitle="Welcome back, please sign in to continue.">
        <form onSubmit={handleSubmit} className="space-y-7">
          <Input label="Email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordInput label="Password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <div className="text-sm text-right">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Sign in
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;