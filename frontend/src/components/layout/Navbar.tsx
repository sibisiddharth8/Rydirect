const Navbar = () => {
  // Add user menu, notifications etc. here later
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
      <button
        onClick={() => {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }}
        className="text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;