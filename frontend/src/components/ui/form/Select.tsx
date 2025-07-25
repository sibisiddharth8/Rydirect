interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select = ({ label, name, children, ...props }: SelectProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm 
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;