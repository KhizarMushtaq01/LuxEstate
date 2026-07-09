import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Heart, Calendar, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/client' },
  { label: 'Saved Homes', icon: Heart, path: '/client/saved' },
  { label: 'Appointments', icon: Calendar, path: '/client/appointments' },
  { label: 'My Profile', icon: User, path: '/client/profile' },
];

export default function ClientLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <p className="font-display text-base text-gold-400">LuxEstate</p>
            <p className="text-white/40 text-xs tracking-widest -mt-0.5">CLIENT PORTAL</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {MENU.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={label} to={path} onClick={() => setSideOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all
              ${active ? 'bg-gold-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="px-2 mb-3">
          <p className="text-white text-sm font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="text-white/40 text-xs">Client</p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-red-400 w-full">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 bg-navy-500 shrink-0">
        <SidebarContent />
      </aside>
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-navy-500 flex flex-col"><SidebarContent /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSideOpen(false)} />
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(true)} className="lg:hidden text-gray-500">
              <Menu size={20} />
            </button>
            <h1 className="font-display text-lg text-navy-500">
              {MENU.find(m => location.pathname === m.path)?.label || 'Dashboard'}
            </h1>
          </div>
          <Link to="/properties" className="text-xs text-gold-500 hover:underline">
            Browse Properties
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
