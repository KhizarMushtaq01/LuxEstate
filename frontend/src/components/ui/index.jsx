import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 16, md: 24, lg: 40 }[size];
  return <Loader2 size={s} className={`animate-spin text-gold-500 ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-400 font-sans text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-20">
      {Icon && <Icon size={48} className="text-gray-200 mx-auto mb-4" />}
      <h3 className="font-display text-xl text-gray-400 mb-2">{title}</h3>
      {description && <p className="text-gray-400 text-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const maxW = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white ${maxW} w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="font-display text-xl text-navy-500">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function StarRating({ rating = 0, max = 5, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? '#C9A84C' : 'none'}
          stroke={i < Math.round(rating) ? '#C9A84C' : '#d1d5db'}
          strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}
        className="px-4 py-2 border border-gray-200 text-sm disabled:opacity-40 hover:border-gold-500 hover:text-gold-500 transition-colors">
        ← Prev
      </button>
      {nums.map(n => (
        <button key={n} onClick={() => onPage(n)}
          className={`w-10 h-10 text-sm border transition-colors ${page === n ? 'bg-gold-500 text-white border-gold-500' : 'border-gray-200 hover:border-gold-500 hover:text-gold-500'}`}>
          {n}
        </button>
      ))}
      {pages > 7 && <span className="text-gray-400">...</span>}
      <button disabled={page >= pages} onClick={() => onPage(page + 1)}
        className="px-4 py-2 border border-gray-200 text-sm disabled:opacity-40 hover:border-gold-500 hover:text-gold-500 transition-colors">
        Next →
      </button>
    </div>
  );
}

export function DashboardCard({ title, value, subtitle, icon: Icon, color = 'gold' }) {
  const colors = {
    gold: 'bg-gold-500',
    navy: 'bg-navy-500',
    green: 'bg-green-600',
    red: 'bg-red-600',
  };
  return (
    <div className="bg-white shadow-luxury p-6 flex items-center gap-4">
      <div className={`${colors[color]} w-14 h-14 flex items-center justify-center shrink-0`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-widest">{title}</p>
        <p className="font-display text-2xl text-navy-500 mt-0.5">{value}</p>
        {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, centered = false }) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {eyebrow && <p className="text-gold-500 text-xs font-medium uppercase tracking-widest mb-3">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      <div className={`w-12 h-0.5 bg-gold-500 my-4 ${centered ? 'mx-auto' : ''}`} />
      {subtitle && <p className="text-gray-500 text-base leading-relaxed max-w-2xl">{subtitle}</p>}
    </div>
  );
}
