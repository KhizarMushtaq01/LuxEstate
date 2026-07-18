import { useEffect, useState } from 'react';
import { adminAPI, propertyAPI, appointmentAPI, leadAPI, blogAPI, neighborhoodAPI, reviewAPI } from '../../services/api';
import { SectionLoader, Modal, StarRating } from '../../components/ui/index';
import { formatDate, formatPrice, getStatusColor } from '../../utils/helpers';
import { Trash2, Edit, Plus, Search, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

// ── USERS ────────────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    adminAPI.getUsers().then(({ data }) => { setUsers(data.users||[]); setLoading(false); });
  }, []);

  const handleUpdate = async (id, updates) => {
    try {
      const { data } = await adminAPI.updateUser(id, updates);
      setUsers(u => u.map(x => x._id===id ? data.user : x));
      setEditUser(null);
      toast.success('User updated');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await adminAPI.deleteUser(id); setUsers(u => u.filter(x=>x._id!==id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-navy-500">Users ({users.length})</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." className="border border-gray-200 pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-gold-500" />
        </div>
      </div>
      <div className="bg-white shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-500 text-white">
            <tr>{['Name','Email','Role','Phone','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-3 text-gray-400">{u.email}</td>
                <td className="px-4 py-3"><span className={`text-xs text-white px-2 py-0.5 ${u.role==='admin'?'bg-red-600':u.role==='agent'?'bg-navy-500':'bg-green-600'}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-gray-400">{u.phone||'—'}</td>
                <td className="px-4 py-3"><span className={`text-xs ${u.isActive?'text-green-600':'text-red-500'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={()=>setEditUser(u)} className="p-1.5 text-gray-400 hover:text-navy-500"><Edit size={14}/></button>
                  <button onClick={()=>handleDelete(u._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!editUser} onClose={()=>setEditUser(null)} title="Edit User">
        {editUser && <EditUserForm user={editUser} onSave={(up)=>handleUpdate(editUser._id,up)} />}
      </Modal>
    </div>
  );
}

function EditUserForm({ user, onSave }) {
  const [form, setForm] = useState({ firstName:user.firstName, lastName:user.lastName, role:user.role, phone:user.phone||'', isActive:user.isActive });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">First Name</label><input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} className="input-field" /></div>
        <div><label className="label">Last Name</label><input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} className="input-field" /></div>
      </div>
      <div><label className="label">Role</label>
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="input-field">
          <option value="client">Client</option><option value="agent">Agent</option><option value="admin">Admin</option>
        </select>
      </div>
      <div><label className="label">Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-field" /></div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} />
        <span className="text-sm text-gray-600">Active Account</span>
      </label>
      <button onClick={()=>onSave(form)} className="btn-gold w-full">Save Changes</button>
    </div>
  );
}

// ── PROPERTIES ───────────────────────────────────────────────────────
export function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    propertyAPI.getAll({ limit: 50, status: undefined }).then(({ data }) => { setProperties(data.properties||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);
  const handleDelete = async (id) => {
    if (!confirm('Delete property?')) return;
    try { await propertyAPI.delete(id); setProperties(p=>p.filter(x=>x._id!==id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-navy-500">Properties ({properties.length})</h2>
      <div className="bg-white shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-500 text-white">
            <tr>{['Title','Address','Price','Status','Agent','MLS#','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody>
            {properties.map(p=>(
              <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium max-w-xs truncate">{p.title}</td>
                <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{p.address?.city}, {p.address?.state}</td>
                <td className="px-4 py-3 text-gold-600 font-medium">{formatPrice(p.price)}</td>
                <td className="px-4 py-3"><span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(p.status)}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-gray-400">{p.agent?.firstName} {p.agent?.lastName||'—'}</td>
                <td className="px-4 py-3 text-gray-400">{p.mlsId||'—'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <a href={`/properties/${p._id}`} target="_blank" className="p-1.5 text-gray-400 hover:text-navy-500"><Edit size={14}/></a>
                  <button onClick={()=>handleDelete(p._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── APPOINTMENTS ─────────────────────────────────────────────────────
export function AdminAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    appointmentAPI.getAll().then(({ data }) => { setAppts(data.appointments||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);
  const updateStatus = async (id, status) => {
    try { const { data } = await appointmentAPI.update(id, { status }); setAppts(a=>a.map(x=>x._id===id?data.appointment:x)); toast.success('Updated'); }
    catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-navy-500">Appointments ({appts.length})</h2>
      <div className="bg-white shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-500 text-white">
            <tr>{['Property','Client','Agent','Date','Time','Type','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody>
            {appts.map(a=>(
              <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium max-w-xs truncate">{a.property?.title||'—'}</td>
                <td className="px-4 py-3">{a.client?.firstName} {a.client?.lastName}</td>
                <td className="px-4 py-3 text-gray-400">{a.agent?.firstName} {a.agent?.lastName}</td>
                <td className="px-4 py-3 text-gray-400">{formatDate(a.date)}</td>
                <td className="px-4 py-3 text-gray-400">{a.timeSlot}</td>
                <td className="px-4 py-3 capitalize">{a.type}</td>
                <td className="px-4 py-3"><span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(a.status)}`}>{a.status}</span></td>
                <td className="px-4 py-3">
                  <select value={a.status} onChange={e=>updateStatus(a._id,e.target.value)} className="border border-gray-200 text-xs px-2 py-1 focus:outline-none">
                    {['pending','confirmed','completed','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── LEADS ─────────────────────────────────────────────────────────────
export function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    leadAPI.getAll().then(({ data }) => { setLeads(data.leads||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);
  const updateStatus = async (id, status) => {
    try { const { data } = await leadAPI.update(id, { status }); setLeads(l=>l.map(x=>x._id===id?data.lead:x)); }
    catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-navy-500">Leads ({leads.length})</h2>
      <div className="bg-white shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-500 text-white">
            <tr>{['Name','Email','Phone','Type','Status','Date','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody>
            {leads.map(l=>(
              <tr key={l._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3 text-gray-400">{l.email}</td>
                <td className="px-4 py-3 text-gray-400">{l.phone||'—'}</td>
                <td className="px-4 py-3 capitalize text-gray-500">{l.type}</td>
                <td className="px-4 py-3"><span className={`text-xs text-white px-2 py-0.5 ${getStatusColor(l.status)}`}>{l.status}</span></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(l.createdAt)}</td>
                <td className="px-4 py-3">
                  <select value={l.status} onChange={e=>updateStatus(l._id,e.target.value)} className="border border-gray-200 text-xs px-2 py-1 focus:outline-none">
                    {['new','contacted','qualified','converted','lost'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── REVIEWS ───────────────────────────────────────────────────────────
export function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    reviewAPI.getAllAdmin().then(({ data }) => { setReviews(data.reviews || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  const handleApprove = async (id) => {
    try {
      await reviewAPI.approve(id);
      setReviews(r => r.map(x => x._id === id ? { ...x, isApproved: true } : x));
      toast.success('Review approved');
    } catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-navy-500">Reviews ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 text-center py-16">
          <p className="text-gray-400">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r._id} className="bg-white border border-gray-100 p-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-navy-500">{r.clientName || `${r.client?.firstName || ''} ${r.client?.lastName || ''}`}</h3>
                  <StarRating rating={r.rating} size={14} />
                </div>
                <p className="text-gray-400 text-sm mt-0.5">For {r.agent?.firstName} {r.agent?.lastName} · {formatDate(r.createdAt)}</p>
                {r.comment && <p className="text-gray-600 text-sm mt-2 max-w-lg">{r.comment}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 ${r.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {r.isApproved ? 'Approved' : 'Pending'}
                </span>
                {!r.isApproved && (
                  <button onClick={() => handleApprove(r._id)} className="btn-gold text-xs px-3 py-1.5 flex items-center gap-1"><Check size={13} />Approve</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── BLOGS ─────────────────────────────────────────────────────────────
export function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', slug:'', content:'', excerpt:'', category:'market-update', isPublished:false });
  useEffect(() => {
    blogAPI.getAll({ limit: 50 }).then(({ data }) => { setBlogs(data.blogs||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await blogAPI.create(form);
      setBlogs(b=>[data.blog,...b]);
      setShowForm(false);
      setForm({ title:'',slug:'',content:'',excerpt:'',category:'market-update',isPublished:false });
      toast.success('Blog created');
    } catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-navy-500">Blog Posts ({blogs.length})</h2>
        <button onClick={()=>setShowForm(true)} className="btn-gold text-xs flex items-center gap-2"><Plus size={14}/>New Post</button>
      </div>
      <div className="bg-white shadow-sm">
        {blogs.length===0?<p className="text-center text-gray-400 py-12">No posts yet</p>:blogs.map(b=>(
          <div key={b._id} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50">
            <div>
              <p className="font-medium text-sm">{b.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{b.category} · {formatDate(b.publishedAt||b.createdAt)}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 ${b.isPublished?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
              {b.isPublished?'Published':'Draft'}
            </span>
          </div>
        ))}
      </div>
      <Modal open={showForm} onClose={()=>setShowForm(false)} title="New Blog Post" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="label">Title</label><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value,slug:e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'')})} className="input-field" /></div>
          <div><label className="label">Slug</label><input required value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} className="input-field" /></div>
          <div><label className="label">Excerpt</label><textarea value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} className="input-field" rows={2} /></div>
          <div><label className="label">Content</label><textarea required value={form.content} onChange={e=>setForm({...form,content:e.target.value})} className="input-field" rows={8} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-field">
                {['market-update','buyer-tips','seller-tips','neighborhood','investment','news'].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})} />
                <span className="text-sm">Publish immediately</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn-gold w-full">Create Post</button>
        </form>
      </Modal>
    </div>
  );
}

// ── NEIGHBORHOODS ─────────────────────────────────────────────────────
export function AdminNeighborhoods() {
  const [hoods, setHoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', slug:'', city:'', state:'AZ', description:'', medianHomePrice:'', walkScore:'', activeListings:0 });
  useEffect(() => {
    neighborhoodAPI.getAll().then(({ data }) => { setHoods(data.neighborhoods||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await neighborhoodAPI.create(form);
      setHoods(h=>[...h, data.neighborhood]);
      setShowForm(false);
      toast.success('Neighborhood created');
    } catch { toast.error('Failed'); }
  };
  if (loading) return <SectionLoader />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-navy-500">Neighborhoods ({hoods.length})</h2>
        <button onClick={()=>setShowForm(true)} className="btn-gold text-xs flex items-center gap-2"><Plus size={14}/>Add Area</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hoods.map(h=>(
          <div key={h._id} className="bg-white border border-gray-100 p-5">
            <h3 className="font-display text-lg text-navy-500">{h.name}</h3>
            <p className="text-gray-400 text-sm">{h.city}, {h.state}</p>
            {h.medianHomePrice && <p className="text-gold-500 text-sm mt-1">Median: {formatPrice(h.medianHomePrice)}</p>}
            {h.description && <p className="text-gray-400 text-xs mt-2 line-clamp-2">{h.description}</p>}
          </div>
        ))}
        {hoods.length===0 && <p className="col-span-3 text-center text-gray-400 py-12">No neighborhoods yet</p>}
      </div>
      <Modal open={showForm} onClose={()=>setShowForm(false)} title="Add Neighborhood">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} className="input-field" /></div>
            <div><label className="label">Slug</label><input required value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">City</label><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="input-field" /></div>
            <div><label className="label">State</label><input value={form.state} onChange={e=>setForm({...form,state:e.target.value})} className="input-field" /></div>
          </div>
          <div><label className="label">Median Home Price</label><input type="number" value={form.medianHomePrice} onChange={e=>setForm({...form,medianHomePrice:e.target.value})} className="input-field" /></div>
          <div><label className="label">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input-field" rows={3} /></div>
          <button type="submit" className="btn-gold w-full">Add Neighborhood</button>
        </form>
      </Modal>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────
export function AdminSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-display text-2xl text-navy-500">Site Settings</h2>
      <div className="bg-white border border-gray-100 p-6 space-y-4">
        <h3 className="font-display text-lg text-navy-500 border-b border-gray-100 pb-3">Company Information</h3>
        <div><label className="label">Company Name</label><input defaultValue="LuxEstate Realty Group" className="input-field" /></div>
        <div><label className="label">Phone</label><input defaultValue="(520) 544-4400" className="input-field" /></div>
        <div><label className="label">Email</label><input defaultValue="info@luxestate.com" className="input-field" /></div>
        <div><label className="label">Address</label><input defaultValue="1234 East Broadway Blvd, Tucson, AZ 85719" className="input-field" /></div>
        <button className="btn-gold text-sm">Save Settings</button>
      </div>
    </div>
  );
}
