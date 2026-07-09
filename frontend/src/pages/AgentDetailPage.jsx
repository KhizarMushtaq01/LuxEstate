import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { agentAPI, propertyAPI } from '../services/api';
import { SectionLoader, StarRating } from '../components/ui/index';
import PropertyCard from '../components/property/PropertyCard';

export default function AgentDetailPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      agentAPI.getOne(id),
      propertyAPI.getByAgent(id),
    ]).then(([a, p]) => {
      setAgent(a.data.agent);
      setProperties(p.data.properties || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <SectionLoader />;
  if (!agent) return <div className="pt-32 text-center text-gray-400">Agent not found</div>;

  return (
    <div className="pt-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/agents" className="text-sm text-gold-500 hover:underline mb-6 block">← All Agents</Link>
        <div className="bg-white border border-gray-100 p-8 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold-200 shrink-0">
            {agent.avatar
              ? <img src={agent.avatar} className="w-full h-full object-cover" alt="" />
              : <div className="w-full h-full bg-gold-500 flex items-center justify-center text-white font-display text-4xl">
                  {agent.firstName?.[0]}{agent.lastName?.[0]}
                </div>}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl text-navy-500">{agent.firstName} {agent.lastName}</h1>
            <p className="text-gold-500 text-sm uppercase tracking-wider mt-1">Licensed Real Estate Agent</p>
            {agent.licenseNumber && <p className="text-gray-400 text-xs mt-1">License #{agent.licenseNumber}</p>}
            {agent.bio && <p className="text-gray-500 mt-3 leading-relaxed">{agent.bio}</p>}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
              {agent.phone && <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-gold-500"><Phone size={14} />{agent.phone}</a>}
              {agent.email && <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-gold-500"><Mail size={14} />{agent.email}</a>}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {agent.specialties?.map(s => <span key={s} className="bg-gold-50 text-gold-700 text-xs px-3 py-1">{s}</span>)}
            </div>
            {agent.languages?.length > 0 && <p className="text-gray-400 text-xs mt-3">Languages: {agent.languages.join(', ')}</p>}
            <div className="flex items-center gap-2 mt-3">
              <StarRating rating={agent.rating || 5} size={14} />
              <span className="text-gray-400 text-xs">({agent.reviewCount || 0} reviews)</span>
              {agent.yearsExperience > 0 && <span className="text-gray-400 text-xs ml-2">· {agent.yearsExperience} yrs experience</span>}
            </div>
          </div>
        </div>
        {properties.length > 0 && (
          <>
            <h2 className="font-display text-2xl text-navy-500 mb-6">Active Listings by {agent.firstName}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
