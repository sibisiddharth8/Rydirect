import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiLink, FiBarChart2, FiSettings,
  FiChevronsLeft, FiChevronsRight, FiLogOut, FiBox, FiX
} from 'react-icons/fi';

import RydirectLogo from '../../assets/Rydirect Logo 256x256.png';

const navLinks = [
  { to: '/', icon: FiGrid, label: 'Dashboard' },
  { to: '/links', icon: FiLink, label: 'Links' },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const UserProfile = () => {
    const { user } = useAuth();
    if (!user) return null;
    return (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-t border-slate-200">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-full h-full rounded-full object-cover cursor-pointer" />
                ) : (
                    user.email.charAt(0).toUpperCase()
                )}
            </div>
            <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">{user.email.split('@')[0]}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
        </div>
    );
}

export default function Sidebar({ isSidebarOpen, setSidebarOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isExpanded = !isCollapsed || isHovered;
  const shouldShowText = isExpanded || isMobileView;

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = () => { if (isCollapsed && !isMobileView) setIsHovered(true); };
  const handleMouseLeave = () => { if (isCollapsed && !isMobileView) setIsHovered(false); };
  const toggleCollapse = () => { setIsCollapsed(!isCollapsed); setIsHovered(false); };

  const linkClasses = "flex items-center w-full overflow-hidden px-4 h-11 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors duration-200 font-semibold";
  const activeLinkClasses = "bg-blue-100 text-blue-600";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className={`cursor-pointer flex items-center h-16 px-4 border-b border-slate-200 flex-shrink-0 transition-all duration-300 ${shouldShowText ? 'justify-start gap-3' : 'justify-center'}`}>
        <img src={RydirectLogo} alt="Rydirect Logo" className="w-10 h-10" />
        {shouldShowText && (<span className="text-xl font-bold text-slate-800 whitespace-nowrap">Rydirect</span>)}
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 ml-auto"><FiX size={24} /></button>
      </div>

      <div className="md:hidden"><UserProfile /></div>

      <nav className="flex-grow px-4 py-2.5 space-y-1 overflow-y-auto min-h-0">
        {navLinks.map((link) => (
          <NavLink key={link.label} to={link.to} end={link.to === '/'}
            className={({ isActive }) => `${linkClasses} ${!shouldShowText ? 'justify-center' : ''} ${isActive ? activeLinkClasses : ''}`}
            onClick={() => { if (isMobileView) setSidebarOpen(false); }} title={!shouldShowText ? link.label : undefined}>
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-all duration-200 whitespace-nowrap overflow-hidden ${shouldShowText ? 'ml-4 w-full opacity-100' : 'w-0 opacity-0'}`}>
              {link.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="flex-shrink-0 border-t border-slate-200">
          <div className="md:hidden p-4">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-2 font-semibold text-slate-600 bg-slate-100 hover:bg-red-100 hover:text-red-600 rounded-lg">
                  <FiLogOut/> Logout
              </button>
          </div>
          <div className="hidden md:flex justify-center p-4">
            <button onClick={toggleCollapse} className="cursor-pointer p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
                {isCollapsed ? <FiChevronsRight className="w-5 h-5" /> : <FiChevronsLeft className="w-5 h-5" />}
            </button>
          </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-20 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Main Sidebar Container */}
      <aside
        className={
          `fixed inset-y-0 z-30 shadow-lg transform transition-all duration-300 ease-in-out flex flex-col
          
          // --- DESKTOP STYLES ---
          md:relative md:translate-x-0
          ${isExpanded ? 'md:w-64' : 'md:w-20'}
          
          // --- MOBILE STYLES (THE FIX) ---
          // Position on the right edge instead of the left
          right-0
          // If open, translate to view (translate-x-0). If closed, translate it out of view to the right (translate-x-full).
          ${isSidebarOpen ? 'translate-x-0 w-64' : 'translate-x-full'}`
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {sidebarContent}
      </aside>
    </>
  );
}