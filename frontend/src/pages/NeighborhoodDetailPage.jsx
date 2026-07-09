import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { neighborhoodAPI } from '../services/api';
import { SectionLoader } from '../components/ui/index';
import { formatPrice } from '../utils/helpers';
import { ArrowRight } from 'lucide-react';

export default function NeighborhoodDetailPage() {
  const { slug } = useParams();
  const [hood, setHood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    neighborhoodAPI.getOne(slug)
      .then(({ data }) => { setHood(data.neighborhood); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <SectionLoader />;

  const name = slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="pt-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/neighborhoods" className="text-sm text-gold-500 hover:underline mb-6 block">← All Neighborhoods</Link>
        <h1 className="font-display text-4xl text-navy-500 mb-2">{hood?.name || name}</h1>
        {hood?.city && <p className="text-gray-400 text-sm mb-6">{hood.city}, {hood.state}</p>}
        {(hood?.description || !hood) && (
          <p className="text-gray-500 leading-relaxed mb-8">{hood?.description || 'Explore homes and real estate in this community.'}</p>
        )}
        {hood?.medianHomePrice && (
          <div className="bg-white border border-gray-100 p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div><p className="font-display text-2xl text-gold-500">{formatPrice(hood.medianHomePrice)}</p><p className="text-xs text-gray-400 mt-1">Median Price</p></div>
            {hood.walkScore && <div><p className="font-display text-2xl text-navy-500">{hood.walkScore}</p><p className="text-xs text-gray-400 mt-1">Walk Score</p></div>}
            {hood.activeListings > 0 && <div><p className="font-display text-2xl text-navy-500">{hood.activeListings}</p><p className="text-xs text-gray-400 mt-1">Active Listings</p></div>}
          </div>
        )}
        {hood?.highlights?.length > 0 && (
          <div className="bg-white border border-gray-100 p-6 mb-6">
            <h2 className="font-display text-xl text-navy-500 mb-4">Highlights</h2>
            <ul className="space-y-2">{hood.highlights.map((h, i) => <li key={i} className="text-sm text-gray-500 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />{h}</li>)}</ul>
          </div>
        )}
        <Link to={`/properties?search=${encodeURIComponent(hood?.name || name)}`} className="btn-gold inline-flex items-center gap-2">
          Browse {hood?.name || name} Listings <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
