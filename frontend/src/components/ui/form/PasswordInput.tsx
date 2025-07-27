import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const PasswordInput = ({ label, name, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        name={name}
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-[34px] right-3 text-slate-400 hover:text-slate-600"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;