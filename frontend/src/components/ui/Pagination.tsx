const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex items-center justify-center space-x-2">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 text-sm rounded-md ${
            currentPage === number
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          {number}
        </button>
      ))}
    </nav>
  );
};

export default Pagination;