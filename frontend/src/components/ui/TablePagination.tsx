import { ChevronLeft, ChevronRight } from 'lucide-react';

const TablePagination = ({ currentPage, totalPages, onPageChange, totalItems, limit }:any) => {
  // The line that hid the component has been removed.
  // It will now always be visible.

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-200">
      <span className="text-sm text-slate-600">
        <span className='hidden sm:block'>Showing</span> <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{totalItems}</span> results
      </span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold">{currentPage} / {totalPages > 0 ? totalPages : 1}</span>
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;