import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

const PublicRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  // If the user is authenticated, redirect them away from public pages to the dashboard.
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoutes;