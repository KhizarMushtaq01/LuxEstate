import { Link } from 'react-router-dom';
import { Bed, Bath, Square, Heart, MapPin, Eye, Calendar } from 'lucide-react';
import { formatPrice, formatNumber, getDefaultPhoto, getPropertyTypeLabel } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../services/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

const statusColors = {
  active: 'bg-green-600',
  pending: 'bg-amber-500',
  sold: 'bg-red-600',
  'off-market': 'bg-gray-500',
  'coming-soon': 'bg-blue-600',
};

export default function PropertyCard({ property, className = '' }) {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(user?.savedProperties?.includes(property._id));
  const [savingLoading, setSavingLoading] = useState(false);

  const photo = property.photos?.[0]?.url || getDefaultPhoto(Math.floor(Math.random() * 8));
  const primaryPhoto = property.photos?.find(p => p.isPrimary)?.url || photo;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to save properties'); return; }
    setSavingLoading(true);
    try {
      await authAPI.toggleSave(property._id);
      setSaved(!saved);
      toast.success(saved ? 'Removed from saved' : 'Saved to favorites');
    } catch { toast.error('Failed to save'); }
    finally { setSavingLoading(false); }
  };

  return (
    <Link to={`/properties/${property._id}`} className={`card block group ${className}`}>
      {/* Image */}
      <div className="relative overflow-hidden h-60">
        <img
          src={primaryPhoto}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { e.target.src = getDefaultPhoto(0); }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 ${statusColors[property.status] || 'bg-gray-500'} text-white text-xs font-medium px-2.5 py-1 uppercase tracking-wider`}>
          {property.status === 'coming-soon' ? 'Coming Soon' : property.status}
        </div>

        {property.isFeatured && (
          <div className="absolute top-3 left-24 bg-gold-500 text-white text-xs font-medium px-2.5 py-1 uppercase tracking-wider">
            Featured
          </div>
        )}

        {/* Save btn */}
        <button onClick={handleSave} disabled={savingLoading}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all
          ${saved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:text-red-500'}`}>
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-display text-xl font-bold drop-shadow-lg">{formatPrice(property.price)}</p>
          {property.listingType === 'rent' && <span className="text-white/80 text-xs">/month</span>}
        </div>

        {/* Type tag */}
        <div className="absolute bottom-3 right-3 bg-navy-500/80 text-white text-xs px-2 py-1">
          {getPropertyTypeLabel(property.propertyType)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg text-navy-500 mb-1 group-hover:text-gold-600 transition-colors line-clamp-1">
          {property.title}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
          <MapPin size={13} className="text-gold-500 shrink-0" />
          <span className="truncate">{property.address?.street}, {property.address?.city}, {property.address?.state}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1.5"><Bed size={15} className="text-gold-500" />{property.bedrooms} bd</span>
          <span className="flex items-center gap-1.5"><Bath size={15} className="text-gold-500" />{property.bathrooms} ba</span>
          <span className="flex items-center gap-1.5"><Square size={15} className="text-gold-500" />{formatNumber(property.squareFootage)} ft²</span>
          {property.views > 0 && (
            <span className="flex items-center gap-1 text-gray-400 ml-auto"><Eye size={12} />{property.views}</span>
          )}
        </div>

        {/* Agent */}
        {property.agent && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
            <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {property.agent.avatar
                ? <img src={property.agent.avatar} className="w-full h-full object-cover" alt="" />
                : `${property.agent.firstName?.[0]}${property.agent.lastName?.[0]}`}
            </div>
            <span className="text-xs text-gray-400">{property.agent.firstName} {property.agent.lastName}</span>
            {property.mlsId && <span className="text-xs text-gray-300 ml-auto">MLS# {property.mlsId}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
