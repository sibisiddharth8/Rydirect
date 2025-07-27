import { Fragment } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { FiLogOut, FiMenu, FiUser, FiSettings } from 'react-icons/fi';
import RydirectLogo from '../../assets/Rydirect Logo 256x256.png'

interface NavbarProps { onMenuClick: () => void; }

// Upgraded UserAvatar to show profile picture first
const UserAvatar = () => {
    const { user } = useAuth();
    if (user?.profileImageUrl) {
        return <img src={user.profileImageUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover cursor-pointer" />;
    }
    if (user?.name) {
        return (
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
            </div>
        );
    }
    return <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center"><FiUser/></div>
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const welcomeName = user?.name || 'Admin';

  return (
    <header className="flex-shrink-0 flex justify-between items-center h-16 px-4 sm:px-6 bg-white border-b border-slate-200">
      <div>
        <h1 className="hidden md:block text-lg font-semibold text-slate-700">Welcome, {welcomeName}!</h1>
        
        {/* Mobile Logo */}
        <Link to="/" className="md:hidden flex items-center gap-2">
          <img src={RydirectLogo} alt="Rydirect Logo" className="w-10 h-10" />
          <span className="font-bold text-lg text-slate-800">Rydirect</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
            <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <UserAvatar />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 border border-slate-300 w-56 origin-top-right bg-white rounded-md ring-opacity-5 focus:outline-none z-50">
                        <div className="px-4 py-3">
                            <p className="text-sm font-semibold text-slate-900 truncate">Signed in as</p>
                            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <div className="p-1 border-t border-slate-100">
                            <Menu.Item>
                              {({ active }) => (
                                <Link to="/settings" className={`${active ? 'bg-slate-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm font-semibold text-slate-700`}>
                                  <FiSettings className="mr-2" /> Settings
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                            {({ active }) => ( 
                                <button onClick={handleLogout} className={`${active ? 'cursor-pointer bg-red-500 text-white' : 'text-red-600'} group flex rounded-md items-center w-full px-2 py-2 text-sm font-semibold`}>
                                    <FiLogOut className="mr-2" /> Logout
                                </button> 
                            )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
        
        <button onClick={onMenuClick} className="text-slate-500 focus:outline-none md:hidden">
          <FiMenu size={24} />
        </button>
      </div>
    </header>
  );
}