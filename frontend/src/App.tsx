import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext'; // Import ToastProvider

function App() {
  return (
    <AuthProvider>
      <ToastProvider> {/* Wrap the RouterProvider */}
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;