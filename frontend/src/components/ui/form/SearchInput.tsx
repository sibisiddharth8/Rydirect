import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = "Search..." }:any) => {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 w-full text-sm bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
      />
    </div>
  );
};

export default SearchInput;