import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, Users, Calendar, MessageSquare, FileText, Map, Settings, LogOut, ChevronRight, Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Properties', icon: Home, path: '/admin/properties' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
  { label: 'Leads', icon: MessageSquare, path: '/admin/leads' },
  { label: 'Blog Posts', icon: FileText, path: '/admin/blogs' },
  { label: 'Neighborhoods', icon: Map, path: '/admin/neighborhoods' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
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
            <p className="text-white/40 text-xs tracking-widest -mt-0.5">ADMIN PANEL</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {MENU.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
          return (
            <Link key={label} to={path} onClick={()=>setSideOpen(false)}
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
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-white/40 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-red-400 transition-colors w-full">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy-500 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-navy-500 flex flex-col"><SidebarContent /></div>
          <div className="flex-1 bg-black/50" onClick={()=>setSideOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSideOpen(true)} className="lg:hidden text-gray-500"><Menu size={20}/></button>
            <h1 className="font-display text-lg text-navy-500">
              {MENU.find(m => location.pathname === m.path || (m.path !== '/admin' && location.pathname.startsWith(m.path)))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-navy-500">
              <Bell size={18} />
            </button>
            <Link to="/" className="text-xs text-gold-500 hover:underline">View Site</Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
