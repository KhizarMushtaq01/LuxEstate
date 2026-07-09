import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'client' });
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await register(form);
      toast.success(`Welcome to LuxEstate, ${user.firstName}!`);
      navigate(user.role === 'agent' ? '/agent' : '/client');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-navy-500/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-gold-500 flex items-center justify-center"><span className="text-white font-display font-bold">L</span></div>
            <div><p className="font-display text-2xl text-gold-400">LuxEstate</p><p className="text-white/40 text-xs tracking-widest -mt-1">REALTY GROUP</p></div>
          </Link>
          <h2 className="font-display text-4xl text-white text-center mb-4">Join LuxEstate</h2>
          <p className="text-white/60 text-center text-lg">Access exclusive listings, schedule showings, and track your real estate journey.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl text-navy-500 mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm mb-8">Already have an account? <Link to="/login" className="text-gold-500 hover:underline">Sign in</Link></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">First Name</label><input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required className="input-field" placeholder="John" /></div>
              <div><label className="label">Last Name</label><input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required className="input-field" placeholder="Smith" /></div>
            </div>
            <div><label className="label">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="input-field" /></div>
            <div><label className="label">Phone</label><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="(520) 555-0100" /></div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} className="input-field pr-10" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <div>
              <label className="label">I am a</label>
              <div className="flex gap-2">
                {[['client', 'Home Buyer/Renter'], ['agent', 'Real Estate Agent']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setForm({ ...form, role: v })}
                    className={`flex-1 py-2.5 text-sm border transition-all ${form.role === v ? 'bg-navy-500 text-white border-navy-500' : 'border-gray-200 text-gray-500 hover:border-navy-500'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Creating...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
            <p className="text-xs text-gray-400 text-center">By registering, you agree to our <Link to="/terms" className="text-gold-500">Terms</Link> and <Link to="/privacy-policy" className="text-gold-500">Privacy Policy</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
