import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { PROPERTY_TYPES, getPropertyTypeLabel } from '../../utils/helpers';

export default function PropertySearch({ initial = {}, onSearch, compact = false }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: initial.search || '',
    listingType: initial.listingType || 'sale',
    minPrice: initial.minPrice || '',
    maxPrice: initial.maxPrice || '',
    beds: initial.beds || '',
    baths: initial.baths || '',
    type: initial.type || '',
    minSqft: initial.minSqft || '',
    maxSqft: initial.maxSqft || '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    if (onSearch) onSearch(filters);
    else navigate(`/properties?${params.toString()}`);
  };

  const clear = () => setFilters({ search:'',listingType:'sale',minPrice:'',maxPrice:'',beds:'',baths:'',type:'',minSqft:'',maxSqft:'' });

  if (compact) return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={filters.search} onChange={e => update('search', e.target.value)}
          placeholder="City, zip, or MLS#..."
          className="input-field pl-9 py-2.5 text-sm" />
      </div>
      <button type="submit" className="btn-gold px-4 py-2.5 text-sm">Search</button>
    </form>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-luxury p-6">
      {/* Type toggle */}
      <div className="flex mb-5 border border-gray-200 w-fit">
        {['sale','rent'].map(t => (
          <button key={t} type="button" onClick={() => update('listingType', t)}
            className={`px-6 py-2.5 text-sm font-medium transition-all capitalize ${filters.listingType === t ? 'bg-navy-500 text-white' : 'text-gray-500 hover:text-navy-500'}`}>
            For {t === 'sale' ? 'Sale' : 'Rent'}
          </button>
        ))}
      </div>

      {/* Main search row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div className="md:col-span-2 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filters.search} onChange={e => update('search', e.target.value)}
            placeholder="City, neighborhood, zip code, or MLS#..."
            className="input-field pl-9" />
        </div>

        <div className="relative">
          <select value={filters.beds} onChange={e => update('beds', e.target.value)} className="input-field appearance-none pr-8">
            <option value="">Any Beds</option>
            {['1','2','3','4','5'].map(n => <option key={n} value={n}>{n}+ Beds</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select value={filters.baths} onChange={e => update('baths', e.target.value)} className="input-field appearance-none pr-8">
            <option value="">Any Baths</option>
            {['1','1.5','2','3','4'].map(n => <option key={n} value={n}>{n}+ Baths</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Price row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <input value={filters.minPrice} onChange={e => update('minPrice', e.target.value)}
          placeholder="Min Price" type="number" className="input-field" />
        <input value={filters.maxPrice} onChange={e => update('maxPrice', e.target.value)}
          placeholder="Max Price" type="number" className="input-field" />
        <div className="relative">
          <select value={filters.type} onChange={e => update('type', e.target.value)} className="input-field appearance-none pr-8">
            <option value="">Property Type</option>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{getPropertyTypeLabel(t)}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-500 text-sm hover:border-gold-500 hover:text-gold-500 transition-colors px-3">
          <SlidersHorizontal size={15} /> More Filters
          <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Advanced */}
      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pt-4 border-t border-gray-100">
          <input value={filters.minSqft} onChange={e => update('minSqft', e.target.value)}
            placeholder="Min Sq Ft" type="number" className="input-field" />
          <input value={filters.maxSqft} onChange={e => update('maxSqft', e.target.value)}
            placeholder="Max Sq Ft" type="number" className="input-field" />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" className="btn-gold flex items-center gap-2 flex-1 justify-center">
          <Search size={16} /> Search Properties
        </button>
        <button type="button" onClick={clear}
          className="btn-outline flex items-center gap-2 px-4">
          <X size={15} /> Clear
        </button>
      </div>
    </form>
  );
}
