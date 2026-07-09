import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid3X3, List, Map, SlidersHorizontal, ChevronDown, ArrowUpDown } from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';
import PropertySearch from '../components/property/PropertySearch';
import { Pagination, SectionLoader, EmptyState } from '../components/ui/index';
import { propertyAPI } from '../services/api';
import { formatNumber, formatPrice } from '../utils/helpers';
import { Home } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Sq Ft: Large to Small', value: '-squareFootage' },
  { label: 'Most Views', value: '-views' },
];

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('-createdAt');

  const getFilters = useCallback(() => {
    const f = {};
    for (const [k, v] of searchParams.entries()) if (v) f[k] = v;
    return f;
  }, [searchParams]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const filters = getFilters();
      const { data } = await propertyAPI.getAll({ ...filters, page, sort, limit: 12 });
      setProperties(data.properties || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch { setProperties([]); }
    finally { setLoading(false); }
  }, [getFilters, page, sort]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
    setPage(1);
  };

  const initial = Object.fromEntries(searchParams.entries());

  return (
    <div className="pt-28 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy-500 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-3xl text-white mb-1">
            {initial.listingType === 'rent' ? 'Homes for Rent' : initial.search ? `Results for "${initial.search}"` : 'All Properties'}
          </h1>
          <p className="text-white/50 text-sm">{total > 0 ? `${formatNumber(total)} properties found` : 'Search our listings'}</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <PropertySearch initial={initial} onSearch={handleSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-gray-500 text-sm">
            {loading ? 'Loading...' : `Showing ${properties.length} of ${formatNumber(total)} results`}
          </p>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                className="border border-gray-200 px-4 py-2 text-sm text-gray-600 bg-white pr-8 appearance-none focus:outline-none focus:border-gold-500 cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ArrowUpDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* View toggle */}
            <div className="flex border border-gray-200">
              {[['grid', Grid3X3], ['list', List]].map(([v, Icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className={`p-2.5 transition-colors ${view === v ? 'bg-navy-500 text-white' : 'text-gray-400 hover:text-navy-500'}`}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? <SectionLoader /> : properties.length === 0 ? (
          <EmptyState icon={Home} title="No Properties Found"
            description="Try adjusting your filters or search in a different area."
            action={<button onClick={() => { setSearchParams({}); setPage(1); }} className="btn-gold text-sm">Clear Filters</button>} />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map(p => (
              <div key={p._id} className="card flex flex-col md:flex-row overflow-hidden">
                <div className="md:w-72 h-52 md:h-auto shrink-0">
                  <img src={p.photos?.[0]?.url || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80`}
                    className="w-full h-full object-cover" alt={p.title}
                    onError={e => e.target.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'} />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-xl text-navy-500">{p.title}</h3>
                    <span className="font-display text-2xl text-gold-600">{formatPrice(p.price)}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{p.address?.street}, {p.address?.city}, {p.address?.state} {p.address?.zip}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>{p.bedrooms} Beds</span>
                    <span>{p.bathrooms} Baths</span>
                    <span>{formatNumber(p.squareFootage)} Sq Ft</span>
                    {p.yearBuilt && <span>Built {p.yearBuilt}</span>}
                    {p.mlsId && <span className="text-gray-400">MLS# {p.mlsId}</span>}
                  </div>
                  <div className="mt-4">
                    <a href={`/properties/${p._id}`} className="btn-gold text-xs px-4 py-2">View Details</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} pages={pages} onPage={p => { setPage(p); window.scrollTo(0,0); }} />
      </div>
    </div>
  );
}
