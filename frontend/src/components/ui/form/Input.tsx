interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, name, ...props }: InputProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
};

export default Input;