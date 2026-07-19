import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSent(true);
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
          <h2 className="font-display text-4xl text-white text-center mb-4">Forgot Password</h2>
          <p className="text-white/60 text-center text-lg leading-relaxed">Enter your email and we'll send you a link to reset your password.</p>
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
          <h1 className="font-display text-3xl text-navy-500 mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm mb-8">
            Remembered it? <Link to="/login" className="text-gold-500 hover:underline">Sign in</Link>
          </p>

          {sent ? (
            <div className="p-4 bg-gold-50 border border-gold-200 text-sm text-gray-600">
              If that email exists in our system, a reset link is on its way. Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="input-field" placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Sending...' : <>Send Reset Link <ArrowRight size={16}/></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
