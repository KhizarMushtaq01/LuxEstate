import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { propertyAPI, appointmentAPI, leadAPI, authAPI } from '../../services/api';
import { DashboardCard, SectionLoader, Modal } from '../../components/ui/index';
import { formatPrice, formatDate, getStatusColor, PROPERTY_TYPES, getPropertyTypeLabel } from '../../utils/helpers';
import { Home, Calendar, MessageSquare, Plus, Edit, Trash2, Eye, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

// ── DASHBOARD ─────────────────────────────────────────────────────────
export function AgentDashboard() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      propertyAPI.getByAgent(user._id).catch(()=>({data:{properties:[]}})),
      appointmentAPI.getAll().catch(()=>({data:{appointments:[]}})),
      leadAPI.getAll().catch(()=>({data:{leads:[]}})),
    ]).then(([p,a,l])=>{ setProperties(p.data.properties||[]); setAppointments(a.data.appointments||[]); setLeads(l.data.leads||[]); setLoading(false); });
  }, []);
  if (loading) return <SectionLoader />;
  const active = properties.filter(p=>p.status==='active').length;
  const pending = appointments.filter(a=>a.status==='pending').length;
  const newLeads = leads.filter(l=>l.status==='new').length;
  return (
    <div className="space-y-6">
      <div><h2 className="font-display text-2xl text-navy-500">Welcome, {user.firstName}!</h2><p className="text-gray-400 text-sm">Here's your activity overview.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title="Active Listings" value={active} subtitle={`${properties.length} total`} icon={Home} color="navy"/>
        <DashboardCard title="Pending Showings" value={pending} subtitle={`${appointments.length} total`} icon={Calendar} color="gold"/>
        <DashboardCard title="New Leads" value={newLeads} subtitle={`${leads.length} total`} icon={MessageSquare} color="green"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-navy-500">Upcoming Showings</h3>
            <Link to="/agent/appointments" className="text-xs text-gold-500 flex items-center gap-1">View all<ArrowRight size={12}/></Link>
          </div>
          {appointments.filter(a=>a.status!=='cancelled'&&a.status!=='completed').slice(0,5).map(a=>(
            <div key={a._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 mb-3">
              <div>
                <p className="font-medium">{a.property?.title||'Property'}</p>
                <p className="text-gray-400 text-xs">{a.client?.firstName} {a.client?.lastName} · {a.timeSlot}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(a.status)}`}>{a.status}</span>
                <p className="text-gray-400 text-xs mt-0.5">{formatDate(a.date)}</p>
              </div>
            </div>
          ))}
          {appointments.length===0&&<p className="text-gray-400 text-sm text-center py-4">No appointments yet</p>}
        </div>
        <div className="bg-white shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-navy-500">Recent Leads</h3>
            <Link to="/agent/leads" className="text-xs text-gold-500 flex items-center gap-1">View all<ArrowRight size={12}/></Link>
          </div>
          {leads.slice(0,5).map(l=>(
            <div key={l._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 mb-3">
              <div><p className="font-medium">{l.name}</p><p className="text-gray-400 text-xs">{l.email} · {l.type}</p></div>
              <span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(l.status)}`}>{l.status}</span>
            </div>
          ))}
          {leads.length===0&&<p className="text-gray-400 text-sm text-center py-4">No leads yet</p>}
        </div>
      </div>
      <div className="flex gap-3">
        <Link to="/agent/properties/new" className="btn-gold text-sm flex items-center gap-2"><Plus size={15}/>Add Listing</Link>
        <Link to="/agent/properties" className="btn-navy text-sm flex items-center gap-2"><Home size={15}/>My Listings</Link>
      </div>
    </div>
  );
}

// ── PROPERTIES ─────────────────────────────────────────────────────────
export function AgentProperties() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ propertyAPI.getByAgent(user._id).then(({data})=>{ setProperties(data.properties||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await propertyAPI.delete(id); setProperties(p=>p.filter(x=>x._id!==id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-navy-500">My Listings ({properties.length})</h2>
        <Link to="/agent/properties/new" className="btn-gold text-xs flex items-center gap-2"><Plus size={14}/>New Listing</Link>
      </div>
      {properties.length===0 ? <div className="bg-white border border-gray-100 text-center py-16"><Home size={40} className="text-gray-200 mx-auto mb-3"/><p className="text-gray-400">No listings yet. Add your first property!</p><Link to="/agent/properties/new" className="btn-gold text-sm mt-4 inline-block">Add Listing</Link></div>
      : <div className="bg-white shadow-sm overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-navy-500 text-white"><tr>{['Photo','Title','Price','Status','Beds/Baths','Views','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {properties.map(p=>(
                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="w-16 h-12 overflow-hidden"><img src={p.photos?.[0]?.url||`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=60`} className="w-full h-full object-cover" onError={e=>e.target.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=60'} /></div></td>
                  <td className="px-4 py-3 font-medium max-w-xs"><p className="truncate">{p.title}</p><p className="text-gray-400 text-xs truncate">{p.address?.city}, {p.address?.state}</p></td>
                  <td className="px-4 py-3 text-gold-600 font-medium">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3"><span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(p.status)}`}>{p.status}</span></td>
                  <td className="px-4 py-3 text-gray-400">{p.bedrooms}bd / {p.bathrooms}ba</td>
                  <td className="px-4 py-3 text-gray-400 flex items-center gap-1"><Eye size={12}/>{p.views||0}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to={`/agent/properties/${p._id}/edit`} className="p-1.5 text-gray-400 hover:text-navy-500"><Edit size={14}/></Link>
                    <a href={`/properties/${p._id}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gold-500"><Eye size={14}/></a>
                    <button onClick={()=>handleDelete(p._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
    </div>
  );
}

// ── PROPERTY FORM ──────────────────────────────────────────────────────
export function AgentPropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title:'', description:'', price:'', propertyType:'single-family', listingType:'sale', status:'active',
    'address.street':'', 'address.city':'', 'address.state':'AZ', 'address.zip':'',
    bedrooms:'', bathrooms:'', squareFootage:'', yearBuilt:'', garage:0, lotSize:'',
    pool:false, fireplace:false, basement:false, isFeatured:false,
    hoaFee:'', taxAmount:'', mlsId:'',
    photos:'', virtualTourUrl:'', features:'',
  });

  useEffect(()=>{
    if (id) {
      propertyAPI.getOne(id).then(({data})=>{
        const p = data.property;
        setForm(f=>({...f,
          title:p.title||'', description:p.description||'', price:p.price||'',
          propertyType:p.propertyType||'single-family', listingType:p.listingType||'sale', status:p.status||'active',
          'address.street':p.address?.street||'', 'address.city':p.address?.city||'', 'address.state':p.address?.state||'AZ', 'address.zip':p.address?.zip||'',
          bedrooms:p.bedrooms||'', bathrooms:p.bathrooms||'', squareFootage:p.squareFootage||'', yearBuilt:p.yearBuilt||'', garage:p.garage||0,
          pool:p.pool||false, fireplace:p.fireplace||false, basement:p.basement||false, isFeatured:p.isFeatured||false,
          hoaFee:p.hoaFee||'', taxAmount:p.taxAmount||'', mlsId:p.mlsId||'',
          photos:p.photos?.map(ph=>ph.url).join('\n')||'', virtualTourUrl:p.virtualTourUrl||'',
          features:p.features?.join(', ')||'',
        }));
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description, price: Number(form.price),
        propertyType: form.propertyType, listingType: form.listingType, status: form.status,
        address: { street:form['address.street'], city:form['address.city'], state:form['address.state'], zip:form['address.zip'] },
        bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms),
        squareFootage: Number(form.squareFootage), yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
        garage: Number(form.garage), pool: form.pool, fireplace: form.fireplace, basement: form.basement,
        isFeatured: form.isFeatured, hoaFee: form.hoaFee ? Number(form.hoaFee) : 0,
        taxAmount: form.taxAmount ? Number(form.taxAmount) : 0, mlsId: form.mlsId,
        virtualTourUrl: form.virtualTourUrl,
        photos: form.photos.split('\n').filter(Boolean).map((url,i)=>({url:url.trim(),isPrimary:i===0})),
        features: form.features.split(',').map(f=>f.trim()).filter(Boolean),
      };
      if (id) { await propertyAPI.update(id, payload); toast.success('Listing updated!'); }
      else { await propertyAPI.create(payload); toast.success('Listing created!'); }
      navigate('/agent/properties');
    } catch (err) { toast.error(err.response?.data?.message||'Failed to save'); setSaving(false); }
  };

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="font-display text-2xl text-navy-500">{id ? 'Edit Listing' : 'New Listing'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-100 p-6 space-y-4">
          <h3 className="font-display text-lg text-navy-500">Basic Information</h3>
          <div><label className="label">Title *</label><input required value={form.title} onChange={e=>set('title',e.target.value)} className="input-field" placeholder="Beautiful 4BR Home in Oro Valley" /></div>
          <div><label className="label">Description *</label><textarea required value={form.description} onChange={e=>set('description',e.target.value)} className="input-field" rows={5} placeholder="Describe the property..." /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Price *</label><input required type="number" value={form.price} onChange={e=>set('price',e.target.value)} className="input-field" placeholder="450000" /></div>
            <div><label className="label">MLS ID</label><input value={form.mlsId} onChange={e=>set('mlsId',e.target.value)} className="input-field" placeholder="Auto-generated if blank" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="label">Property Type *</label>
              <select required value={form.propertyType} onChange={e=>set('propertyType',e.target.value)} className="input-field">
                {PROPERTY_TYPES.map(t=><option key={t} value={t}>{getPropertyTypeLabel(t)}</option>)}
              </select>
            </div>
            <div><label className="label">Listing Type</label>
              <select value={form.listingType} onChange={e=>set('listingType',e.target.value)} className="input-field">
                <option value="sale">For Sale</option><option value="rent">For Rent</option>
              </select>
            </div>
            <div><label className="label">Status</label>
              <select value={form.status} onChange={e=>set('status',e.target.value)} className="input-field">
                {['active','pending','sold','off-market','coming-soon'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 space-y-4">
          <h3 className="font-display text-lg text-navy-500">Address</h3>
          <div><label className="label">Street *</label><input required value={form['address.street']} onChange={e=>set('address.street',e.target.value)} className="input-field" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="label">City *</label><input required value={form['address.city']} onChange={e=>set('address.city',e.target.value)} className="input-field" /></div>
            <div><label className="label">State</label><input value={form['address.state']} onChange={e=>set('address.state',e.target.value)} className="input-field" /></div>
            <div><label className="label">Zip *</label><input required value={form['address.zip']} onChange={e=>set('address.zip',e.target.value)} className="input-field" /></div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 space-y-4">
          <h3 className="font-display text-lg text-navy-500">Property Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="label">Bedrooms *</label><input required type="number" value={form.bedrooms} onChange={e=>set('bedrooms',e.target.value)} className="input-field" min="0" /></div>
            <div><label className="label">Bathrooms *</label><input required type="number" step="0.5" value={form.bathrooms} onChange={e=>set('bathrooms',e.target.value)} className="input-field" min="0" /></div>
            <div><label className="label">Sq Footage *</label><input required type="number" value={form.squareFootage} onChange={e=>set('squareFootage',e.target.value)} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="label">Year Built</label><input type="number" value={form.yearBuilt} onChange={e=>set('yearBuilt',e.target.value)} className="input-field" placeholder="2005" /></div>
            <div><label className="label">Garage Spaces</label><input type="number" value={form.garage} onChange={e=>set('garage',e.target.value)} className="input-field" min="0" /></div>
            <div><label className="label">Lot Size (sqft)</label><input type="number" value={form.lotSize} onChange={e=>set('lotSize',e.target.value)} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">HOA Fee ($/mo)</label><input type="number" value={form.hoaFee} onChange={e=>set('hoaFee',e.target.value)} className="input-field" /></div>
            <div><label className="label">Annual Tax ($)</label><input type="number" value={form.taxAmount} onChange={e=>set('taxAmount',e.target.value)} className="input-field" /></div>
          </div>
          <div className="flex flex-wrap gap-6">
            {[['pool','Pool'],['fireplace','Fireplace'],['basement','Basement'],['isFeatured','Featured Listing']].map(([k,l])=>(
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[k]} onChange={e=>set(k,e.target.checked)} />
                <span className="text-sm text-gray-600">{l}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 space-y-4">
          <h3 className="font-display text-lg text-navy-500">Photos & Media</h3>
          <div><label className="label">Photo URLs (one per line)</label><textarea value={form.photos} onChange={e=>set('photos',e.target.value)} className="input-field" rows={4} placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg" /></div>
          <div><label className="label">Virtual Tour URL</label><input value={form.virtualTourUrl} onChange={e=>set('virtualTourUrl',e.target.value)} className="input-field" placeholder="https://my.matterport.com/..." /></div>
        </div>

        <div className="bg-white border border-gray-100 p-6 space-y-4">
          <h3 className="font-display text-lg text-navy-500">Features</h3>
          <div><label className="label">Features & Amenities (comma separated)</label><textarea value={form.features} onChange={e=>set('features',e.target.value)} className="input-field" rows={3} placeholder="Granite countertops, Hardwood floors, Stainless appliances, Central AC..." /></div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? 'Saving...' : id ? 'Update Listing' : 'Publish Listing'}
          </button>
          <button type="button" onClick={()=>navigate('/agent/properties')} className="btn-outline px-8">Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ── APPOINTMENTS ──────────────────────────────────────────────────────
export function AgentAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ appointmentAPI.getAll().then(({data})=>{ setAppts(data.appointments||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  const updateStatus = async (id, status) => {
    try { const {data} = await appointmentAPI.update(id,{status}); setAppts(a=>a.map(x=>x._id===id?data.appointment:x)); toast.success('Updated'); }
    catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-navy-500">My Appointments ({appts.length})</h2>
      {appts.length===0 ? <div className="bg-white border text-center py-16"><Calendar size={40} className="text-gray-200 mx-auto mb-3"/><p className="text-gray-400">No appointments yet</p></div>
      : <div className="space-y-3">
          {appts.map(a=>(
            <div key={a._id} className="bg-white border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-navy-500">{a.property?.title||'Property'}</h3>
                <p className="text-gray-400 text-sm mt-0.5">{a.client?.firstName} {a.client?.lastName} · {a.clientEmail}</p>
                <p className="text-gray-400 text-sm">{formatDate(a.date)} at {a.timeSlot} · {a.type}</p>
                {a.notes && <p className="text-gray-500 text-xs mt-1 italic">"{a.notes}"</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs text-white px-3 py-1 ${getStatusColor(a.status)}`}>{a.status}</span>
                {a.status==='pending' && <>
                  <button onClick={()=>updateStatus(a._id,'confirmed')} className="btn-gold text-xs px-3 py-1.5">Confirm</button>
                  <button onClick={()=>updateStatus(a._id,'cancelled')} className="border border-red-300 text-red-500 text-xs px-3 py-1.5 hover:bg-red-50">Cancel</button>
                </>}
                {a.status==='confirmed' && <button onClick={()=>updateStatus(a._id,'completed')} className="btn-navy text-xs px-3 py-1.5">Mark Complete</button>}
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}

// ── LEADS ─────────────────────────────────────────────────────────────
export function AgentLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ leadAPI.getAll().then(({data})=>{ setLeads(data.leads||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  const updateStatus = async (id, status) => {
    try { const {data} = await leadAPI.update(id,{status}); setLeads(l=>l.map(x=>x._id===id?data.lead:x)); }
    catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-navy-500">My Leads ({leads.length})</h2>
      {leads.length===0 ? <div className="bg-white border text-center py-16"><MessageSquare size={40} className="text-gray-200 mx-auto mb-3"/><p className="text-gray-400">No leads yet</p></div>
      : <div className="space-y-3">
          {leads.map(l=>(
            <div key={l._id} className="bg-white border border-gray-100 p-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{l.name}</h3>
                <p className="text-gray-400 text-sm">{l.email} · {l.phone||'No phone'}</p>
                {l.message && <p className="text-gray-500 text-sm mt-2 max-w-lg">{l.message}</p>}
                <p className="text-gray-400 text-xs mt-1">{formatDate(l.createdAt)} · {l.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(l.status)}`}>{l.status}</span>
                <select value={l.status} onChange={e=>updateStatus(l._id,e.target.value)} className="border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-gold-500">
                  {['new','contacted','qualified','converted','lost'].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────
export function AgentProfile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ firstName:user?.firstName||'', lastName:user?.lastName||'', phone:user?.phone||'', bio:user?.bio||'', yearsExperience:user?.yearsExperience||0, licenseNumber:user?.licenseNumber||'', avatar:user?.avatar||'', specialties:(user?.specialties||[]).join(', '), languages:(user?.languages||[]).join(', ') });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ ...form, specialties:form.specialties.split(',').map(s=>s.trim()).filter(Boolean), languages:form.languages.split(',').map(s=>s.trim()).filter(Boolean) });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-2xl text-navy-500">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-100 p-6 space-y-4">
          <div><label className="label">Avatar URL</label><input value={form.avatar} onChange={e=>set('avatar',e.target.value)} className="input-field" placeholder="https://example.com/photo.jpg" /></div>
          {form.avatar && <img src={form.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-gold-200" alt="" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">First Name</label><input value={form.firstName} onChange={e=>set('firstName',e.target.value)} className="input-field" /></div>
            <div><label className="label">Last Name</label><input value={form.lastName} onChange={e=>set('lastName',e.target.value)} className="input-field" /></div>
          </div>
          <div><label className="label">Phone</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} className="input-field" /></div>
          <div><label className="label">Bio</label><textarea value={form.bio} onChange={e=>set('bio',e.target.value)} className="input-field" rows={4} placeholder="Tell clients about yourself..." /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Years Experience</label><input type="number" value={form.yearsExperience} onChange={e=>set('yearsExperience',e.target.value)} className="input-field" /></div>
            <div><label className="label">License Number</label><input value={form.licenseNumber} onChange={e=>set('licenseNumber',e.target.value)} className="input-field" /></div>
          </div>
          <div><label className="label">Specialties (comma separated)</label><input value={form.specialties} onChange={e=>set('specialties',e.target.value)} className="input-field" placeholder="Luxury Homes, First-Time Buyers, Investment..." /></div>
          <div><label className="label">Languages Spoken (comma separated)</label><input value={form.languages} onChange={e=>set('languages',e.target.value)} className="input-field" placeholder="English, Spanish, French..." /></div>
        </div>
        <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">{saving?'Saving...':'Save Profile'}</button>
      </form>
    </div>
  );
}
