import { Link, useLocation } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';

export default function DashboardSidebar({ menu, basePath, portalTag, user, subtitle, onLogout, onNavigate }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path !== basePath && location.pathname.startsWith(path));

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <p className="font-display text-base text-gold-400">LuxEstate</p>
            <p className="text-white/40 text-xs tracking-widest -mt-0.5">{portalTag}</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menu.map(({ label, icon, path }) => {
          const Icon = icon;
          const active = isActive(path);
          return (
            <Link key={label} to={path} onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all
              ${active ? 'bg-gold-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="px-2 mb-3">
          <p className="text-white text-sm font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="text-white/40 text-xs">{subtitle}</p>
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-red-400 w-full">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}
