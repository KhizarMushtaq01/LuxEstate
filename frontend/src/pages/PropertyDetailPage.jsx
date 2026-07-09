import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Calendar, Phone, Mail, Heart, Share2, Printer, ChevronLeft, ChevronRight, CheckCircle, ExternalLink, Home, DollarSign, School } from 'lucide-react';
import { propertyAPI, appointmentAPI } from '../services/api';
import { leadAPI } from '../services/api';
import { formatPrice, formatNumber, formatDate, calcMortgage, getDefaultPhoto, getPropertyTypeLabel } from '../utils/helpers';
import { PageLoader, StarRating, Modal } from '../components/ui/index';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mortgage, setMortgage] = useState({ down: 20, rate: 7.5, years: 30 });
  const [apptForm, setApptForm] = useState({ date: '', timeSlot: '', type: 'in-person', notes: '', clientName: user?.firstName+' '+user?.lastName||'', clientEmail: user?.email||'', clientPhone: user?.phone||'' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    propertyAPI.getOne(id).then(({ data }) => {
      setProperty(data.property);
      setLoading(false);
    }).catch(() => { setLoading(false); navigate('/properties'); });
  }, [id]);

  useEffect(() => {
    if (apptForm.date && property?.agent?._id) {
      appointmentAPI.getSlots({ agentId: property.agent._id, date: apptForm.date })
        .then(({ data }) => setAvailableSlots(data.available || []))
        .catch(() => setAvailableSlots([]));
    }
  }, [apptForm.date, property]);

  if (loading) return <PageLoader />;
  if (!property) return null;

  const photos = property.photos?.length > 0
    ? property.photos.map(p => p.url)
    : Array(4).fill(0).map((_, i) => getDefaultPhoto(i));

  const monthly = calcMortgage({ price: property.price, downPayment: mortgage.down, rate: mortgage.rate, years: mortgage.years });

  const handleShowingSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to schedule a showing'); navigate('/login'); return; }
    setSubmitting(true);
    try {
      await appointmentAPI.create({ ...apptForm, propertyId: id, agentId: property.agent?._id });
      toast.success('Showing scheduled! The agent will confirm shortly.');
      setShowModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to schedule'); }
    finally { setSubmitting(false); }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leadAPI.create({ ...contactForm, type: 'showing', property: id, agent: property.agent?._id });
      toast.success('Message sent! Agent will contact you soon.');
      setShowContactModal(false);
    } catch { toast.error('Failed to send'); }
    finally { setSubmitting(false); }
  };

  const statusMap = { active:'Active', pending:'Pending', sold:'Sold', 'off-market':'Off Market', 'coming-soon':'Coming Soon' };

  return (
    <div className="pt-20 min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-gold-500">Home</Link> /
          <Link to="/properties" className="hover:text-gold-500">Properties</Link> /
          <span className="text-gray-600 truncate">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-8 rounded-none overflow-hidden h-96 lg:h-[520px]">
          <div className="col-span-4 lg:col-span-2 relative overflow-hidden group cursor-pointer"
            onClick={() => setPhotoIdx(0)}>
            <img src={photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>e.target.src=getDefaultPhoto(0)} />
            <div className={`absolute top-4 left-4 text-white text-xs font-medium px-3 py-1.5 uppercase tracking-wider
              ${property.status==='active'?'bg-green-600':property.status==='sold'?'bg-red-600':property.status==='pending'?'bg-amber-500':'bg-gray-600'}`}>
              {statusMap[property.status]}
            </div>
            {property.isFeatured && <div className="absolute top-4 left-28 bg-gold-500 text-white text-xs font-medium px-2.5 py-1.5 uppercase tracking-wider">Featured</div>}
          </div>
          <div className="hidden lg:grid col-span-2 grid-rows-2 gap-2">
            {[1,2,3].map(i => (
              <div key={i} className={`relative overflow-hidden cursor-pointer group ${i===3?'relative':''}`}
                onClick={() => setPhotoIdx(i)}>
                <img src={photos[i] || getDefaultPhoto(i)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>e.target.src=getDefaultPhoto(i)} />
                {i===3 && photos.length>4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-lg font-display">+{photos.length-4} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left col */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title/Price */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="font-display text-3xl lg:text-4xl text-navy-500 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={14} className="text-gold-500" />
                    {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zip}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl text-gold-600">{formatPrice(property.price)}</p>
                  {property.listingType==='rent'&&<p className="text-gray-400 text-sm">/month</p>}
                  {property.mlsId&&<p className="text-gray-400 text-xs mt-1">MLS# {property.mlsId}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>setShowContactModal(true)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-500 transition-colors border border-gray-200 px-3 py-1.5 hover:border-gold-500">
                  <Share2 size={13} /> Share
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-500 transition-colors border border-gray-200 px-3 py-1.5 hover:border-gold-500">
                  <Printer size={13} /> Print
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors border border-gray-200 px-3 py-1.5 hover:border-red-300">
                  <Heart size={13} /> Save
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                { icon: Bath, label: 'Bathrooms', value: `${property.bathrooms}${property.halfBathrooms?` + ${property.halfBathrooms} half`:''}` },
                { icon: Square, label: 'Square Feet', value: formatNumber(property.squareFootage) },
                { icon: Home, label: 'Lot Size', value: property.lotSize ? `${formatNumber(property.lotSize)} ${property.lotUnit||'sqft'}` : 'N/A' },
              ].map(({icon:Icon,label,value}) => (
                <div key={label} className="bg-white p-4 text-center border border-gray-100">
                  <Icon size={20} className="text-gold-500 mx-auto mb-2" />
                  <p className="font-display text-xl text-navy-500">{value}</p>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white p-6 border border-gray-100">
              <h2 className="font-display text-xl text-navy-500 mb-4">About This Property</h2>
              <div className="w-8 h-0.5 bg-gold-500 mb-4" />
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white p-6 border border-gray-100">
              <h2 className="font-display text-xl text-navy-500 mb-4">Property Details</h2>
              <div className="w-8 h-0.5 bg-gold-500 mb-5" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ['Property Type', getPropertyTypeLabel(property.propertyType)],
                  ['Year Built', property.yearBuilt || 'N/A'],
                  ['Garage', property.garage ? `${property.garage} car` : 'None'],
                  ['Floors', property.floors || 1],
                  ['Basement', property.basement ? 'Yes' : 'No'],
                  ['Pool', property.pool ? 'Yes' : 'No'],
                  ['Fireplace', property.fireplace ? 'Yes' : 'No'],
                  ['Heating', property.heating || 'N/A'],
                  ['Cooling', property.cooling || 'N/A'],
                  ['Parking', property.parking || 'N/A'],
                  ['HOA Fee', property.hoaFee ? `${formatPrice(property.hoaFee)}/${property.hoaFrequency}` : 'None'],
                  ['Annual Tax', property.taxAmount ? formatPrice(property.taxAmount) : 'N/A'],
                  ['Days on Market', property.daysOnMarket || 0],
                  ['Listed', formatDate(property.listingDate)],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-charcoal font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {property.features?.length > 0 && (
              <div className="bg-white p-6 border border-gray-100">
                <h2 className="font-display text-xl text-navy-500 mb-4">Features & Amenities</h2>
                <div className="w-8 h-0.5 bg-gold-500 mb-5" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-gold-500 shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Virtual Tour */}
            {property.virtualTourUrl && (
              <div className="bg-white p-6 border border-gray-100">
                <h2 className="font-display text-xl text-navy-500 mb-4">Virtual Tour</h2>
                <div className="w-8 h-0.5 bg-gold-500 mb-5" />
                <iframe src={property.virtualTourUrl} className="w-full h-80 border-0" title="Virtual Tour" allowFullScreen />
              </div>
            )}

            {/* Schools */}
            {property.schools?.length > 0 && (
              <div className="bg-white p-6 border border-gray-100">
                <h2 className="font-display text-xl text-navy-500 mb-4 flex items-center gap-2">
                  <School size={18} className="text-gold-500" /> Nearby Schools
                </h2>
                <div className="w-8 h-0.5 bg-gold-500 mb-5" />
                <div className="space-y-3">
                  {property.schools.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm border-b border-gray-50 pb-3">
                      <div>
                        <p className="font-medium text-charcoal">{s.name}</p>
                        <p className="text-gray-400 capitalize">{s.type} school · {s.distance} mi</p>
                      </div>
                      {s.rating && <div className="flex items-center gap-1"><StarRating rating={s.rating/2} size={12} /><span className="text-xs text-gray-400">{s.rating}/10</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mortgage Calculator */}
            <div className="bg-white p-6 border border-gray-100">
              <h2 className="font-display text-xl text-navy-500 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-gold-500" /> Mortgage Estimator
              </h2>
              <div className="w-8 h-0.5 bg-gold-500 mb-5" />
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="label">Down Payment (%)</label>
                  <input type="number" value={mortgage.down} onChange={e=>setMortgage({...mortgage,down:+e.target.value})} className="input-field" min="0" max="100" />
                </div>
                <div>
                  <label className="label">Interest Rate (%)</label>
                  <input type="number" step="0.1" value={mortgage.rate} onChange={e=>setMortgage({...mortgage,rate:+e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="label">Loan Term (yrs)</label>
                  <select value={mortgage.years} onChange={e=>setMortgage({...mortgage,years:+e.target.value})} className="input-field">
                    <option value={15}>15 years</option>
                    <option value={20}>20 years</option>
                    <option value={30}>30 years</option>
                  </select>
                </div>
              </div>
              <div className="bg-navy-500 p-4 text-center">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Estimated Monthly Payment</p>
                <p className="font-display text-3xl text-white">{formatPrice(monthly)}</p>
                <p className="text-white/40 text-xs mt-1">Principal & interest only. Excludes taxes & insurance.</p>
              </div>
              <p className="text-gray-400 text-xs mt-3 text-center">
                <Link to="/mortgage-calculator" className="text-gold-500 hover:underline">Use Full Calculator →</Link>
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Schedule Showing */}
            <div className="bg-navy-500 p-6">
              <h3 className="font-display text-xl text-white mb-4">Schedule a Showing</h3>
              <p className="text-white/60 text-sm mb-5">Tour this property in person or virtually at your convenience.</p>
              <button onClick={()=>setShowModal(true)} className="btn-gold w-full flex items-center justify-center gap-2 mb-3">
                <Calendar size={16} /> Schedule Showing
              </button>
              <button onClick={()=>setShowContactModal(true)} className="w-full border border-white/30 text-white px-4 py-3 text-sm hover:border-gold-500 hover:text-gold-400 transition-colors flex items-center justify-center gap-2">
                <Mail size={15} /> Ask a Question
              </button>
            </div>

            {/* Agent Card */}
            {property.agent && (
              <div className="bg-white border border-gray-100 p-6">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Listed by</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gold-500 flex items-center justify-center text-white font-display text-xl shrink-0">
                    {property.agent.avatar
                      ? <img src={property.agent.avatar} className="w-full h-full object-cover" alt="" />
                      : `${property.agent.firstName?.[0]}${property.agent.lastName?.[0]}`}
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-navy-500">{property.agent.firstName} {property.agent.lastName}</h4>
                    <div className="flex items-center gap-1">
                      <StarRating rating={property.agent.rating||5} size={12} />
                      <span className="text-xs text-gray-400">({property.agent.reviewCount||0} reviews)</span>
                    </div>
                  </div>
                </div>
                {property.agent.bio && <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{property.agent.bio}</p>}
                <div className="space-y-2">
                  {property.agent.phone && (
                    <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold-500 transition-colors">
                      <Phone size={14} className="text-gold-500" />{property.agent.phone}
                    </a>
                  )}
                  {property.agent.email && (
                    <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold-500 transition-colors">
                      <Mail size={14} className="text-gold-500" />{property.agent.email}
                    </a>
                  )}
                </div>
                <Link to={`/agents/${property.agent._id}`} className="btn-outline w-full text-center text-sm mt-4 block">View Full Profile</Link>
              </div>
            )}

            {/* Tax History */}
            {property.taxHistory?.length > 0 && (
              <div className="bg-white border border-gray-100 p-6">
                <h3 className="font-display text-lg text-navy-500 mb-4">Tax History</h3>
                <div className="space-y-2">
                  {property.taxHistory.map((t, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                      <span className="text-gray-400">{t.year}</span>
                      <span className="font-medium">{formatPrice(t.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Open Houses */}
            {property.openHouses?.length > 0 && (
              <div className="bg-gold-50 border border-gold-200 p-6">
                <h3 className="font-display text-lg text-navy-500 mb-4">Open Houses</h3>
                {property.openHouses.map((oh, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-medium text-sm text-navy-500">{formatDate(oh.date)}</p>
                    <p className="text-gray-500 text-sm">{oh.startTime} – {oh.endTime} · {oh.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Showing Modal */}
      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Schedule a Showing" size="md">
        <form onSubmit={handleShowingSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Your Name</label>
              <input value={apptForm.clientName} onChange={e=>setApptForm({...apptForm,clientName:e.target.value})} required className="input-field" placeholder="Full name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={apptForm.clientEmail} onChange={e=>setApptForm({...apptForm,clientEmail:e.target.value})} required className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <input value={apptForm.clientPhone} onChange={e=>setApptForm({...apptForm,clientPhone:e.target.value})} className="input-field" placeholder="(xxx) xxx-xxxx" />
            </div>
            <div>
              <label className="label">Tour Type</label>
              <select value={apptForm.type} onChange={e=>setApptForm({...apptForm,type:e.target.value})} className="input-field">
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Preferred Date</label>
            <input type="date" value={apptForm.date} onChange={e=>setApptForm({...apptForm,date:e.target.value,timeSlot:''})} required className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>
          {availableSlots.length > 0 && (
            <div>
              <label className="label">Available Time Slots</label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map(slot => (
                  <button key={slot} type="button" onClick={()=>setApptForm({...apptForm,timeSlot:slot})}
                    className={`p-2 text-xs border transition-colors ${apptForm.timeSlot===slot?'bg-gold-500 text-white border-gold-500':'border-gray-200 hover:border-gold-500'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="label">Notes (optional)</label>
            <textarea value={apptForm.notes} onChange={e=>setApptForm({...apptForm,notes:e.target.value})} className="input-field" rows={3} placeholder="Any special requests..." />
          </div>
          <button type="submit" disabled={submitting||!apptForm.timeSlot} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {submitting ? 'Scheduling...' : 'Confirm Showing Request'}
          </button>
        </form>
      </Modal>

      {/* Contact Modal */}
      <Modal open={showContactModal} onClose={()=>setShowContactModal(false)} title="Contact Agent">
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Name</label><input required value={contactForm.name} onChange={e=>setContactForm({...contactForm,name:e.target.value})} className="input-field" /></div>
            <div><label className="label">Email</label><input type="email" required value={contactForm.email} onChange={e=>setContactForm({...contactForm,email:e.target.value})} className="input-field" /></div>
          </div>
          <div><label className="label">Phone</label><input value={contactForm.phone} onChange={e=>setContactForm({...contactForm,phone:e.target.value})} className="input-field" /></div>
          <div><label className="label">Message</label><textarea required value={contactForm.message} onChange={e=>setContactForm({...contactForm,message:e.target.value})} className="input-field" rows={4} placeholder={`I'm interested in ${property.title}...`} /></div>
          <button type="submit" disabled={submitting} className="btn-gold w-full">{submitting?'Sending...':'Send Message'}</button>
        </form>
      </Modal>
    </div>
  );
}
