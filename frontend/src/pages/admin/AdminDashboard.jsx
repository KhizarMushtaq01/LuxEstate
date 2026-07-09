import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Calendar, MessageSquare, TrendingUp, DollarSign, Eye, ArrowRight } from 'lucide-react';
import { adminAPI, propertyAPI } from '../../services/api';
import { DashboardCard, SectionLoader } from '../../components/ui/index';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [propStats, setPropStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard().catch(() => ({ data: {} })),
      propertyAPI.getStats().catch(() => ({ data: {} })),
    ]).then(([dash, ps]) => {
      setData(dash.data);
      setPropStats(ps.data?.stats);
      setLoading(false);
    });
  }, []);

  if (loading) return <SectionLoader />;

  const { stats = {}, recentLeads = [], recentAppointments = [] } = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-navy-500 mb-1">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard title="Total Properties" value={stats.totalProperties || 0} subtitle={`${propStats?.totalActive || 0} active`} icon={Home} color="navy" />
        <DashboardCard title="Total Users" value={stats.totalUsers || 0} subtitle="Agents, clients, admins" icon={Users} color="gold" />
        <DashboardCard title="Appointments" value={stats.totalAppointments || 0} subtitle="All time" icon={Calendar} color="green" />
        <DashboardCard title="Total Leads" value={stats.totalLeads || 0} subtitle="Inquiries received" icon={MessageSquare} color="red" />
      </div>

      {/* Property status */}
      {propStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Active Listings', value: propStats.totalActive, color: 'border-green-500' },
            { label: 'Pending', value: propStats.totalPending, color: 'border-amber-500' },
            { label: 'Sold', value: propStats.totalSold, color: 'border-red-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-white p-5 border-l-4 ${color} shadow-sm`}>
              <p className="text-gray-400 text-xs uppercase tracking-widest">{label}</p>
              <p className="font-display text-3xl text-navy-500 mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-navy-500">Recent Leads</h3>
            <Link to="/admin/leads" className="text-xs text-gold-500 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map(lead => (
                <div key={lead._id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-3">
                  <div>
                    <p className="font-medium text-charcoal">{lead.name}</p>
                    <p className="text-gray-400 text-xs">{lead.email} · {lead.type}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(lead.status)}`}>{lead.status}</span>
                    <p className="text-gray-400 text-xs mt-1">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-navy-500">Recent Appointments</h3>
            <Link to="/admin/appointments" className="text-xs text-gold-500 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {recentAppointments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map(appt => (
                <div key={appt._id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-3">
                  <div>
                    <p className="font-medium text-charcoal">{appt.property?.title || 'Property'}</p>
                    <p className="text-gray-400 text-xs">{appt.client?.firstName} {appt.client?.lastName} · {appt.timeSlot}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(appt.status)}`}>{appt.status}</span>
                    <p className="text-gray-400 text-xs mt-1">{formatDate(appt.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="font-display text-lg text-navy-500 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" className="btn-navy text-xs px-4 py-2.5 flex items-center gap-2"><Users size={14}/> Manage Users</Link>
          <Link to="/admin/properties" className="btn-gold text-xs px-4 py-2.5 flex items-center gap-2"><Home size={14}/> View Properties</Link>
          <Link to="/admin/leads" className="btn-outline text-xs px-4 py-2.5 flex items-center gap-2"><MessageSquare size={14}/> Review Leads</Link>
          <Link to="/admin/blogs" className="border border-gray-200 text-gray-600 text-xs px-4 py-2.5 flex items-center gap-2 hover:border-gold-500 hover:text-gold-500 transition-colors"><Eye size={14}/> Manage Blog</Link>
        </div>
      </div>
    </div>
  );
}
