import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { user } = await resetPassword(token, password);
      toast.success('Password reset. You are now signed in.');
      const path = user.role === 'admin' ? '/admin' : user.role === 'agent' ? '/agent' : '/client';
      navigate(path);
    } catch (err) {
      toast.error(err.message);
    }
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
          <h2 className="font-display text-4xl text-white text-center mb-4">Set a New Password</h2>
          <p className="text-white/60 text-center text-lg leading-relaxed">Choose a strong password you haven't used before.</p>
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
          <h1 className="font-display text-3xl text-navy-500 mb-2">New Password</h1>
          <p className="text-gray-400 text-sm mb-8">
            Link expired? <Link to="/forgot-password" className="text-gold-500 hover:underline">Request a new one</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} className="input-field pr-10" placeholder="Min 6 characters" />
                <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type={show?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} required minLength={6} className="input-field" placeholder="Re-enter password" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Resetting...' : <>Reset Password <ArrowRight size={16}/></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
