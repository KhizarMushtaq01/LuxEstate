import { Link } from 'react-router-dom';
import { Heart, Calendar, LayoutDashboard, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { propertyAPI, appointmentAPI, authAPI, reviewAPI } from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import { SectionLoader, DashboardCard, Modal } from '../../components/ui/index';
import { formatDate, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

export function ClientDashboard() {
  const { user } = useAuthStore();
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ appointmentAPI.getAll().then(({data})=>{ setAppts(data.appointments||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  if (loading) return <SectionLoader />;
  const upcoming = appts.filter(a=>['pending','confirmed'].includes(a.status));
  return (
    <div className="space-y-6">
      <div><h2 className="font-display text-2xl text-navy-500">Welcome, {user?.firstName}!</h2><p className="text-gray-400 text-sm">Track your home search journey here.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title="Saved Homes" value={user?.savedProperties?.length||0} icon={Heart} color="gold"/>
        <DashboardCard title="Upcoming Showings" value={upcoming.length} icon={Calendar} color="navy"/>
        <DashboardCard title="Total Appointments" value={appts.length} icon={LayoutDashboard} color="green"/>
      </div>
      <div className="bg-white border border-gray-100 p-6">
        <h3 className="font-display text-lg text-navy-500 mb-4">Upcoming Showings</h3>
        {upcoming.length===0 ? <p className="text-gray-400 text-sm text-center py-6">No upcoming showings. <Link to="/properties" className="text-gold-500">Browse properties</Link></p>
        : upcoming.map(a=>(
          <div key={a._id} className="flex justify-between items-start text-sm border-b border-gray-50 pb-3 mb-3">
            <div>
              <p className="font-medium">{a.property?.title||'Property'}</p>
              <p className="text-gray-400 text-xs">{formatDate(a.date)} at {a.timeSlot} · {a.type}</p>
              <p className="text-gray-400 text-xs">Agent: {a.agent?.firstName} {a.agent?.lastName}</p>
            </div>
            <span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(a.status)}`}>{a.status}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Link to="/properties" className="btn-gold text-sm">Find Properties</Link>
        <Link to="/client/saved" className="btn-outline text-sm">Saved Homes</Link>
      </div>
    </div>
  );
}

export function ClientSaved() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(!!user?.savedProperties?.length);
  useEffect(()=>{
    if (!user?.savedProperties?.length) return;
    Promise.all(user.savedProperties.map(id=>propertyAPI.getOne(id).catch(()=>null)))
      .then(res => { setProperties(res.filter(Boolean).map(r=>r.data.property)); setLoading(false); });
  },[]);
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-navy-500">Saved Homes ({properties.length})</h2>
      {properties.length===0 ? (
        <div className="bg-white border text-center py-16">
          <Heart size={40} className="text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400 mb-4">You haven't saved any homes yet.</p>
          <Link to="/properties" className="btn-gold text-sm">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map(p=><PropertyCard key={p._id} property={p} />)}
        </div>
      )}
    </div>
  );
}

function RateAgentModal({ appointment, onClose, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await reviewAPI.create({
        agent: appointment.agent?._id,
        property: appointment.property?._id,
        rating,
        comment,
        transactionType: 'bought',
      });
      toast.success('Thanks for your review!');
      onSubmitted(appointment._id);
      onClose();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Rate Your Agent">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" onClick={() => setRating(n)} className="p-0.5">
                <Star size={24} fill={n <= rating ? '#C9A84C' : 'none'} stroke={n <= rating ? '#C9A84C' : '#d1d5db'} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Comment</label>
          <textarea required value={comment} onChange={e => setComment(e.target.value)} className="input-field" rows={4} placeholder="How was your experience with this agent?" />
        </div>
        <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">{saving ? 'Submitting...' : 'Submit Review'}</button>
      </form>
    </Modal>
  );
}

export function ClientAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState([]);
  const [ratingAppt, setRatingAppt] = useState(null);
  useEffect(()=>{ appointmentAPI.getAll().then(({data})=>{ setAppts(data.appointments||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  const cancel = async (id) => {
    if (!confirm('Cancel this showing?')) return;
    try { await appointmentAPI.cancel(id); setAppts(a=>a.filter(x=>x._id!==id)); toast.success('Cancelled'); }
    catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-navy-500">My Showings ({appts.length})</h2>
      {appts.length===0 ? (
        <div className="bg-white border text-center py-16">
          <Calendar size={40} className="text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400 mb-4">No showings scheduled.</p>
          <Link to="/properties" className="btn-gold text-sm">Find a Property</Link>
        </div>
      ) : appts.map(a=>(
        <div key={a._id} className="bg-white border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-navy-500">{a.property?.title||'Property'}</h3>
            <p className="text-gray-400 text-sm">{formatDate(a.date)} at {a.timeSlot}</p>
            <p className="text-gray-400 text-sm">Agent: {a.agent?.firstName} {a.agent?.lastName} · {a.type}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs text-white px-3 py-1 ${getStatusColor(a.status)}`}>{a.status}</span>
            {['pending','confirmed'].includes(a.status) && (
              <button onClick={()=>cancel(a._id)} className="border border-red-300 text-red-500 text-xs px-3 py-1.5 hover:bg-red-50">Cancel</button>
            )}
            {a.status==='completed' && (
              reviewed.includes(a._id)
                ? <span className="text-xs text-gray-400 flex items-center gap-1"><Star size={13} fill="#C9A84C" stroke="#C9A84C" />Reviewed</span>
                : <button onClick={()=>setRatingAppt(a)} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1"><Star size={13} />Rate Agent</button>
            )}
          </div>
        </div>
      ))}
      {ratingAppt && (
        <RateAgentModal appointment={ratingAppt} onClose={()=>setRatingAppt(null)} onSubmitted={(id)=>setReviewed(r=>[...r,id])} />
      )}
    </div>
  );
}

export function ClientProfile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ firstName:user?.firstName||'', lastName:user?.lastName||'', phone:user?.phone||'', avatar:user?.avatar||'' });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };
  return (
    <div className="max-w-lg space-y-6">
      <h2 className="font-display text-2xl text-navy-500">My Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 space-y-4">
        <div><label className="label">Avatar URL</label><input value={form.avatar} onChange={e=>setForm({...form,avatar:e.target.value})} className="input-field" placeholder="https://..." /></div>
        {form.avatar && <img src={form.avatar} className="w-20 h-20 rounded-full object-cover" alt="" />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="label">First Name</label><input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} className="input-field" /></div>
          <div><label className="label">Last Name</label><input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} className="input-field" /></div>
        </div>
        <div><label className="label">Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-field" /></div>
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Email</p>
          <p className="text-sm text-gray-500">{user?.email} <span className="text-xs text-gray-300">(cannot be changed)</span></p>
        </div>
        <button type="submit" disabled={saving} className="btn-gold w-full">{saving?'Saving...':'Save Profile'}</button>
      </form>
    </div>
  );
}
