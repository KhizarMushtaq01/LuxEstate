import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Star, Award, Users, Home, TrendingUp, CheckCircle, ChevronLeft, ChevronRight, MapPin, Phone } from 'lucide-react';
import PropertySearch from '../components/property/PropertySearch';
import PropertyCard from '../components/property/PropertyCard';
import { SectionHeader, StarRating, SectionLoader } from '../components/ui/index';
import { propertyAPI, agentAPI, reviewAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';

const HERO_SLIDES = [
  { img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80', tag: 'Luxury Living', title: 'Find Your Dream Home in Tucson', sub: 'Explore thousands of premium listings with expert guidance' },
  { img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80', tag: 'Investment Properties', title: 'Smart Investments, Lasting Value', sub: 'Residential and commercial properties curated for maximum returns' },
  { img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80', tag: 'New Listings', title: 'Discover Premier Communities', sub: 'Beautiful neighborhoods with exceptional schools and amenities' },
];

const STATS = [
  { icon: Home, value: '10,000+', label: 'Homes Sold', color: 'text-gold-500' },
  { icon: Users, value: '150+', label: 'Expert Agents', color: 'text-gold-500' },
  { icon: Award, value: '38+', label: 'Years Experience', color: 'text-gold-500' },
  { icon: TrendingUp, value: '98%', label: 'Client Satisfaction', color: 'text-gold-500' },
];

const TESTIMONIALS = [
  { name: 'Jennifer & Mark Davis', role: 'Home Buyers', rating: 5, text: 'Our agent was phenomenal. She found us our dream home in just two weeks, negotiated $40,000 below asking, and handled everything seamlessly. We cannot recommend LuxEstate highly enough.', location: 'Oro Valley, AZ' },
  { name: 'Robert Chen', role: 'Investment Buyer', rating: 5, text: 'I have worked with many realtors across multiple states. LuxEstate\'s market knowledge and negotiation skills are unmatched. They helped me acquire three investment properties at exceptional value.', location: 'Tucson, AZ' },
  { name: 'Sarah & Tom Williams', role: 'Home Sellers', rating: 5, text: 'We listed on Friday, had 12 showings over the weekend, and accepted an offer 8% above asking by Monday. The staging advice and pricing strategy were spot-on.', location: 'Marana, AZ' },
];

const WHY_US = [
  { title: 'Local Market Experts', desc: 'Deep knowledge of every Tucson neighborhood, school district, and market trend since 1985.' },
  { title: 'Proven Negotiators', desc: 'Our agents consistently achieve above-asking prices for sellers and below-asking for buyers.' },
  { title: 'Full-Service Support', desc: 'From pre-approval to closing day, we guide you through every step of the process.' },
  { title: 'Technology-Driven', desc: 'Advanced MLS search, virtual tours, and digital signing for a seamless modern experience.' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [agents, setAgents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      propertyAPI.getFeatured().catch(() => ({ data: { properties: [] } })),
      agentAPI.getAll().catch(() => ({ data: { agents: [] } })),
      reviewAPI.getAll().catch(() => ({ data: { reviews: [] } })),
      propertyAPI.getStats().catch(() => ({ data: { stats: null } })),
    ]).then(([fp, ag, rv, st]) => {
      setFeatured(fp.data.properties || []);
      setAgents((ag.data.agents || []).slice(0, 4));
      setReviews((rv.data.reviews || []).slice(0, 3));
      setStats(st.data.stats);
      setLoading(false);
    });
  }, []);

  const cur = HERO_SLIDES[slide];

  // Helper for prev/next slide with boundary checks
  const prevSlide = () => setSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setSlide((slide + 1) % HERO_SLIDES.length);

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION - Fixed responsive issues */}
      <section className="relative h-screen min-h-[600px] md:min-h-[640px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Background slides */}
        {HERO_SLIDES.map((s, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
          >
            <img 
              src={s.img} 
              alt="" 
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-500/85 via-navy-500/60 to-transparent" />
          </div>
        ))}

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-20 md:pt-24">
          <div className="max-w-2xl">
            <span className="inline-block bg-gold-500 text-white text-xs sm:text-sm font-medium px-3 py-1.5 uppercase tracking-widest mb-4 sm:mb-6 animate-fade-in">
              {cur.tag}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-4 sm:mb-6 animate-slide-up">
              {cur.title}
            </h1>
            <p className="text-white/70 text-base sm:text-lg md:text-xl mb-6 sm:mb-10 font-light animate-slide-up">
              {cur.sub}
            </p>
            <div className="flex flex-wrap gap-3 mb-8 sm:mb-12">
              <Link to="/properties?listingType=sale" className="btn-gold text-sm sm:text-base flex items-center gap-2">
                Browse For Sale <ArrowRight size={16} />
              </Link>
              <Link to="/home-valuation" className="btn-outline text-sm sm:text-base text-white border-white hover:bg-white hover:text-navy-500">
                Free Home Valuation
              </Link>
            </div>

            {/* Quick stats bar - responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <Icon size={16} className="text-gold-400 hidden sm:block" />
                  <span className="text-white font-bold text-base sm:text-lg font-display">{value}</span>
                  <span className="text-white/60 text-xs sm:text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide controls - responsive positioning */}
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setSlide(i)}
              className={`transition-all ${i === slide ? 'bg-gold-500 w-6' : 'bg-white/40 w-2'} h-2 rounded-full`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all rounded-full z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all rounded-full z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </section>

      {/* SEARCH BAR - Responsive padding */}
      <section className="bg-white shadow-luxury relative z-10 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <PropertySearch />
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="py-12 sm:py-16 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <SectionHeader eyebrow="Hand-Picked" title="Featured Properties" subtitle="Exceptional homes curated by our top agents" />
            <Link to="/properties?featured=true" className="btn-outline text-sm flex items-center gap-2 shrink-0 self-start sm:self-auto">
              View All Listings <ArrowRight size={15} />
            </Link>
          </div>
          
          {loading ? (
            <SectionLoader />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featured.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[0,1,2].map(i => (
                <div key={i} className="card overflow-hidden">
                  <div 
                    className="h-52 sm:h-60 bg-gray-100 bg-cover bg-center"
                    style={{backgroundImage:`url(https://images.unsplash.com/photo-${['1600596542815-ffad4c1539a9','1613490493576-7fde63acd811','1560448204-e02f11c3d0e2'][i]}?w=600&q=80)`}}
                  />
                  <div className="p-4 sm:p-5">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <p className="text-center text-sm text-gray-400 mt-4">Add properties via Agent Dashboard</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STATS BANNER - Responsive padding and grid */}
      <section className="bg-navy-500 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon size={28} className="text-gold-400 mx-auto mb-2 sm:mb-3" />
                <p className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-1">{value}</p>
                <p className="text-white/50 text-xs sm:text-sm uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Responsive layout */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SectionHeader eyebrow="Why LuxEstate" title="A Legacy of Excellence in Tucson Real Estate" subtitle="For over 38 years, we have been the most trusted name in Southern Arizona real estate, combining deep local expertise with exceptional client service." />
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                {WHY_US.map(({ title, desc }) => (
                  <div key={title} className="flex gap-3 sm:gap-4">
                    <CheckCircle size={18} className="text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-navy-500 mb-0.5">{title}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                <Link to="/about" className="btn-navy text-sm">Learn More About Us</Link>
                <Link to="/contact" className="btn-outline text-sm">Contact an Agent</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg" alt="Luxury home" />
              <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80" className="w-full h-48 sm:h-56 md:h-64 object-cover mt-4 sm:mt-6 md:mt-8 rounded-lg" alt="Beautiful home" />
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" className="w-full h-48 sm:h-56 md:h-64 object-cover -mt-4 sm:-mt-6 md:-mt-8 rounded-lg" alt="Modern home" />
              <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg" alt="Home exterior" />
            </div>
          </div>
        </div>
      </section>

      {/* NEIGHBORHOODS PREVIEW */}
      <section className="py-12 sm:py-16 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <SectionHeader eyebrow="Explore Communities" title="Tucson's Premier Neighborhoods" subtitle="Discover the unique character of each community we serve" centered />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { name: 'Oro Valley', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', listings: '142', avg: '$485,000' },
              { name: 'Marana', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80', listings: '89', avg: '$412,000' },
              { name: 'Sahuarita', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', listings: '67', avg: '$365,000' },
            ].map(({ name, img, listings, avg }) => (
              <Link 
                key={name} 
                to={`/neighborhoods/${name.toLowerCase().replace(/\s+/g,'-')}`}
                className="card group relative overflow-hidden h-64 sm:h-72 block rounded-lg"
              >
                <img 
                  src={img} 
                  alt={name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-500/80 via-navy-500/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                  <h3 className="font-display text-xl sm:text-2xl text-white mb-1">{name}</h3>
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-white/70 text-xs sm:text-sm">
                    <span className="flex items-center gap-1"><MapPin size={12} />{listings} active listings</span>
                    <span>Avg: {avg}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link to="/neighborhoods" className="btn-outline text-sm inline-flex items-center gap-2">
              View All Communities <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* MEET THE AGENTS */}
      {agents.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <SectionHeader eyebrow="Our Team" title="Meet Our Expert Agents" />
              <Link to="/agents" className="btn-outline text-sm flex items-center gap-2 shrink-0 self-start sm:self-auto">
                All Agents <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {agents.map(agent => (
                <Link key={agent._id} to={`/agents/${agent._id}`} className="card group text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden mb-3 sm:mb-4 border-2 border-gold-200 group-hover:border-gold-500 transition-colors">
                    {agent.avatar ? (
                      <img src={agent.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gold-500 flex items-center justify-center text-white font-display text-xl sm:text-2xl">
                        {agent.firstName?.[0]}{agent.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-base sm:text-lg text-navy-500 mb-0.5">{agent.firstName} {agent.lastName}</h3>
                  <p className="text-gold-500 text-xs uppercase tracking-wider mb-2">Luxury Specialist</p>
                  {agent.languages?.length > 0 && (
                    <p className="text-gray-400 text-xs mb-2 sm:mb-3">{agent.languages.join(', ')}</p>
                  )}
                  <div className="flex items-center justify-center gap-1">
                    <StarRating rating={agent.rating || 5} size={12} />
                    <span className="text-xs text-gray-400">({agent.reviewCount || 0})</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-12 sm:py-16 md:py-20 bg-navy-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-gold-400 text-xs font-medium uppercase tracking-widest mb-3">Client Stories</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white">What Our Clients Say</h2>
            <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {(reviews.length > 0 ? reviews.map(r => ({
              name: r.clientName || 'Anonymous',
              role: r.transactionType ? `Home ${r.transactionType.charAt(0).toUpperCase()+r.transactionType.slice(1)}` : 'Client',
              rating: r.rating,
              text: r.comment,
              location: 'Tucson, AZ',
            })) : TESTIMONIALS).map(({ name, role, rating, text, location }, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-5 sm:p-6 md:p-8 hover:border-gold-500/40 transition-colors rounded-lg">
                <StarRating rating={rating} size={14} />
                <p className="text-white/70 text-sm leading-relaxed mt-4 mb-5 sm:mb-6 italic line-clamp-4">"{text}"</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white font-medium text-sm">{name}</p>
                  <p className="text-gold-400 text-xs mt-0.5">{role} · {location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy-500/80" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold-400 text-xs font-medium uppercase tracking-widest mb-4">Start Your Journey</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 sm:mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-white/60 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">Connect with one of our expert agents today. No pressure, just honest advice and exceptional service.</p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link to="/properties" className="btn-gold text-sm sm:text-base flex items-center gap-2">
              Search Properties <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="border border-white/30 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base hover:border-gold-500 hover:text-gold-400 transition-colors flex items-center gap-2 rounded-md">
              <Phone size={15} /> Talk to an Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}