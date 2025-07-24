import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Link as LinkIcon, Settings } from 'lucide-react';
import { BarChartHorizontalBig } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link to="/" className="text-xl font-bold text-slate-800">
          MyMind
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/links"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <LinkIcon className="h-5 w-5" />
          Links
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          Settings
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <BarChartHorizontalBig className="h-5 w-5" />
          Analytics
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;