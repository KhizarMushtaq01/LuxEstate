import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Heart, Calendar, User, Menu } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import DashboardSidebar from '../../components/layout/DashboardSidebar';

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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 bg-navy-500 shrink-0">
        <DashboardSidebar menu={MENU} basePath="/client" portalTag="CLIENT PORTAL" user={user} subtitle="Client" onLogout={handleLogout} onNavigate={() => setSideOpen(false)} />
      </aside>
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-navy-500 flex flex-col">
            <DashboardSidebar menu={MENU} basePath="/client" portalTag="CLIENT PORTAL" user={user} subtitle="Client" onLogout={handleLogout} onNavigate={() => setSideOpen(false)} />
          </div>
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
