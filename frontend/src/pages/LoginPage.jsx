import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage({ agentLogin }) {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await login(form);
      toast.success(`Welcome back, ${user.firstName}!`);
      const path = user.role === 'admin' ? '/admin' : user.role === 'agent' ? '/agent' : '/client';
      navigate(path);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80" className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-navy-500/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-gold-500 flex items-center justify-center"><span className="text-white font-display font-bold">L</span></div>
            <div><p className="font-display text-2xl text-gold-400">LuxEstate</p><p className="text-white/40 text-xs tracking-widest -mt-1">REALTY GROUP</p></div>
          </Link>
          <h2 className="font-display text-4xl text-white text-center mb-4">{agentLogin ? 'Agent Portal' : 'Welcome Back'}</h2>
          <p className="text-white/60 text-center text-lg leading-relaxed">Sign in to access your personalized dashboard, saved properties, and more.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold-500 flex items-center justify-center"><span className="text-white font-display font-bold text-sm">L</span></div>
              <span className="font-display text-xl text-navy-500">LuxEstate</span>
            </Link>
          </div>
          <h1 className="font-display text-3xl text-navy-500 mb-2">{agentLogin ? 'Agent Sign In' : 'Sign In'}</h1>
          <p className="text-gray-400 text-sm mb-8">Don't have an account? <Link to="/register" className="text-gold-500 hover:underline">Register here</Link></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="input-field pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>
          <div className="mt-6 p-4 bg-gold-50 border border-gold-200">
            <p className="text-xs text-gray-500 mb-2 font-medium">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Admin: admin@luxestate.com / admin123</p>
              <p>Agent: agent@luxestate.com / agent123</p>
              <p>Client: client@luxestate.com / client123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
