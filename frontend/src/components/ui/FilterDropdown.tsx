type Option = {
  id: string | number;
  name: string;
};

type FilterDropdownProps = {
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: Option[];
  placeholder?: string;
};

const FilterDropdown = ({ value, onChange, options, placeholder = "All Batches" }: FilterDropdownProps) => {
  return (
    <select 
      value={value} 
      onChange={onChange} 
      className="py-2 pl-3 pr-8 text-sm bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>{option.name}</option>
      ))}
    </select>
  );
};

export default FilterDropdown;