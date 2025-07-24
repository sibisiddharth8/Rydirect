import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import Layout from '../pages/Layout';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage'; 
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import LinksPage from '../pages/links/LinksPage';

import RedirectPage from '../pages/redirect/RedirectPage';
import PublicProfilePage from '../pages/public/PublicProfilePage';

// Placeholder Pages
const SettingsPage = () => <h1 className="text-3xl font-bold">Settings</h1>;

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/redirect',
    element: <RedirectPage />,
  },
  {
    path: '/all',
    element: <PublicProfilePage />,
  },
  // Protected routes
  {
    path: '/',
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'links', element: <LinksPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
        ],
      },
    ],
  },
]);