import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
// --- THIS IS THE FIX ---
// Remove the 'ClassValue' type, as it's not needed.
import clsx from 'clsx'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className,
  ...props 
}: ButtonProps) => {
  
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:ring-blue-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

  const mergedClasses = twMerge(clsx(
    baseClasses,
    variantClasses[variant],
    disabledClasses,
    className
  ));

  return (
    <motion.button
      whileHover={{ scale: isLoading || props.disabled ? 1 : 1.05 }}
      whileTap={{ scale: isLoading || props.disabled ? 1 : 0.95 }}
      disabled={isLoading || props.disabled}
      className={mergedClasses}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;