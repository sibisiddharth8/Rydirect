import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';
import Layout from '../pages/Layout';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage'; 
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import LinksPage from '../pages/links/LinksPage';
import SettingsPage from '../pages/settings/SettingsPage';
import UnlockPage from '../pages/public/UnlockPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import LinkInactivePage from '../pages/public/LinkInactivePage';

import RedirectPage from '../pages/redirect/RedirectPage';
import PublicProfilePage from '../pages/public/PublicProfilePage';
import QrCodePage from '../pages/public/QrCodePage';

// Placeholder Pages


export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <PublicRoutes />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ]
  },
  {
    path: '/redirect',
    element: <RedirectPage />,
  },
  {
    path: '/all',
    element: <PublicProfilePage />,
  },
  {
    path: '/unlock',
    element: <UnlockPage />,
  },
  {
    path: '/inactive',
    element: <LinkInactivePage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '/:shortCode/qr',
    element: <QrCodePage />,
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
  {
    path: '*',
    element: <NotFoundPage />,
  }
]);