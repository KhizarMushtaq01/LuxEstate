import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, StarRating, SectionLoader } from '../components/ui/index';
import { agentAPI, leadAPI, blogAPI, neighborhoodAPI } from '../services/api';
import { formatPrice, formatDate, calcMortgage, slugify } from '../utils/helpers';
import { Phone, Mail, MapPin, Calculator, Home, TrendingUp, CheckCircle, ChevronDown, Plus, Minus, ArrowRight, Star, Users, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import PropertyCard from '../components/property/PropertyCard';
import { propertyAPI } from '../services/api';

// ── ABOUT ─────────────────────────────────────────────────────────────
export function AboutPage() {
  const [agents, setAgents] = useState([]);
  useEffect(()=>{ agentAPI.getAll().then(({data})=>setAgents(data.agents||[])).catch(()=>{}); },[]);
  return (
    <div className="pt-20">
      <div className="relative h-72 bg-navy-500 flex items-center">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30" alt=""/>
        <div className="relative max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">About LuxEstate</h1><p className="text-white/60 text-lg">Tucson's Most Trusted Real Estate Agency</p></div>
      </div>
      <section className="py-20 bg-cream"><div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <SectionHeader eyebrow="Our Story" title="38 Years of Excellence in Tucson Real Estate" />
          <p className="text-gray-500 leading-relaxed mt-4 mb-4">Founded in 1985 by James and Patricia Whitmore, LuxEstate Realty Group began as a small boutique agency dedicated to personalized service. Over nearly four decades, we have grown to become Southern Arizona's premier real estate firm while maintaining the same commitment to excellence that defined our earliest days.</p>
          <p className="text-gray-500 leading-relaxed mb-6">Our team of over 150 licensed agents has helped more than 10,000 families buy, sell, and invest in real estate across Tucson, Oro Valley, Marana, Sahuarita, and beyond.</p>
          <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-200">
            {[['10,000+','Homes Sold'],['150+','Expert Agents'],['38+','Years Serving AZ']].map(([v,l])=>(
              <div key={l} className="text-center"><p className="font-display text-3xl text-gold-500">{v}</p><p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80" className="w-full h-52 object-cover" alt=""/>
          <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80" className="w-full h-52 object-cover mt-8" alt=""/>
        </div>
      </div></section>
      <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Our Mission" title="What Drives Us" centered />
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[['Integrity','We believe honest, transparent communication is the foundation of every successful real estate transaction.'],['Expertise','Our agents complete 40+ hours of continuing education annually to stay ahead of market trends.'],['Community','We\'re not just selling homes — we\'re building the fabric of Tucson\'s neighborhoods.']].map(([t,d])=>(
            <div key={t} className="text-center p-8 border border-gray-100 hover:border-gold-300 transition-colors">
              <div className="w-12 h-12 bg-gold-500 flex items-center justify-center mx-auto mb-4"><Star size={20} className="text-white"/></div>
              <h3 className="font-display text-xl text-navy-500 mb-3">{t}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div></section>
    </div>
  );
}

// ── AGENTS ─────────────────────────────────────────────────────────────
export function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ agentAPI.getAll().then(({data})=>{ setAgents(data.agents||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Meet Our Agents</h1><p className="text-white/50">Experienced professionals dedicated to your real estate success</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-7xl mx-auto px-6">
        {loading ? <SectionLoader /> : agents.length===0 ? (
          <div className="text-center py-20"><Users size={48} className="text-gray-200 mx-auto mb-4"/><p className="text-gray-400">No agents found. Agents can register and set their role to "Agent".</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map(agent=>(
              <Link key={agent._id} to={`/agents/${agent._id}`} className="card group text-center p-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-gray-100 group-hover:border-gold-500 transition-colors">
                  {agent.avatar ? <img src={agent.avatar} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full bg-gold-500 flex items-center justify-center text-white font-display text-2xl">{agent.firstName?.[0]}{agent.lastName?.[0]}</div>}
                </div>
                <h3 className="font-display text-lg text-navy-500">{agent.firstName} {agent.lastName}</h3>
                <p className="text-gold-500 text-xs uppercase tracking-wider mt-1">Real Estate Agent</p>
                {agent.specialties?.length>0 && <p className="text-gray-400 text-xs mt-2 line-clamp-1">{agent.specialties.join(' · ')}</p>}
                {agent.languages?.length>0 && <p className="text-gray-400 text-xs mt-1">{agent.languages.join(', ')}</p>}
                <div className="flex items-center justify-center gap-1 mt-3"><StarRating rating={agent.rating||5} size={12}/><span className="text-xs text-gray-400">({agent.reviewCount||0})</span></div>
                {agent.yearsExperience>0 && <p className="text-gray-400 text-xs mt-1">{agent.yearsExperience} yrs experience</p>}
              </Link>
            ))}
          </div>
        )}
      </div></section>
    </div>
  );
}

// ── AGENT DETAIL ───────────────────────────────────────────────────────
export function AgentDetailPage() {
  const { id } = (typeof useParams === 'function' ? require('react-router-dom') : { useParams: ()=>({}) }).useParams ? require('react-router-dom').useParams() : { id: '' };
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    if (!id) return;
    Promise.all([agentAPI.getOne(id), propertyAPI.getByAgent(id)]).then(([a,p])=>{ setAgent(a.data.agent); setProperties(p.data.properties||[]); setLoading(false); }).catch(()=>setLoading(false));
  },[id]);
  if (loading) return <SectionLoader />;
  if (!agent) return <div className="pt-32 text-center text-gray-400">Agent not found</div>;
  return (
    <div className="pt-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-gray-100 p-8 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold-200 shrink-0">
            {agent.avatar ? <img src={agent.avatar} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full bg-gold-500 flex items-center justify-center text-white font-display text-4xl">{agent.firstName?.[0]}{agent.lastName?.[0]}</div>}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl text-navy-500">{agent.firstName} {agent.lastName}</h1>
            <p className="text-gold-500 text-sm uppercase tracking-wider mt-1">Licensed Real Estate Agent</p>
            {agent.bio && <p className="text-gray-500 mt-3 leading-relaxed">{agent.bio}</p>}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
              {agent.phone && <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-gold-500"><Phone size={14}/>{agent.phone}</a>}
              {agent.email && <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-gold-500"><Mail size={14}/>{agent.email}</a>}
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {agent.specialties?.map(s=><span key={s} className="bg-gold-50 text-gold-700 text-xs px-3 py-1">{s}</span>)}
            </div>
          </div>
        </div>
        {properties.length>0 && <>
          <h2 className="font-display text-2xl text-navy-500 mb-6">Active Listings</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0,6).map(p=><PropertyCard key={p._id} property={p}/>)}
          </div>
        </>}
      </div>
    </div>
  );
}

// ── CONTACT ────────────────────────────────────────────────────────────
export function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'', type:'general' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await leadAPI.create(form); setSent(true); toast.success('Message sent! We\'ll be in touch within 24 hours.'); }
    catch { toast.error('Failed to send. Please call us directly.'); }
    finally { setLoading(false); }
  };
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Contact Us</h1><p className="text-white/50">We'd love to hear from you</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-white border border-gray-100 p-10 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4"/>
              <h2 className="font-display text-2xl text-navy-500 mb-2">Message Received!</h2>
              <p className="text-gray-400">We'll get back to you within 24 hours. For urgent inquiries, please call us directly.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 p-8">
              <h2 className="font-display text-2xl text-navy-500 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Your Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field"/></div>
                  <div><label className="label">Email *</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field"/></div>
                </div>
                <div><label className="label">Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-field"/></div>
                <div><label className="label">I'm interested in</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="input-field">
                    <option value="general">General Inquiry</option><option value="showing">Scheduling a Showing</option><option value="valuation">Home Valuation</option><option value="mortgage">Mortgage Info</option>
                  </select>
                </div>
                <div><label className="label">Message *</label><textarea required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="input-field" rows={5} placeholder="How can we help you?"/></div>
                <button type="submit" disabled={loading} className="btn-gold w-full">{loading?'Sending...':'Send Message'}</button>
              </form>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-display text-lg text-navy-500 mb-4">Office Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3"><MapPin size={16} className="text-gold-500 mt-0.5 shrink-0"/><span className="text-gray-600">1234 East Broadway Blvd<br/>Tucson, AZ 85719</span></div>
              <div className="flex gap-3 items-center"><Phone size={16} className="text-gold-500"/><a href="tel:5205444400" className="text-gray-600 hover:text-gold-500">(520) 544-4400</a></div>
              <div className="flex gap-3 items-center"><Mail size={16} className="text-gold-500"/><a href="mailto:info@luxestate.com" className="text-gray-600 hover:text-gold-500">info@luxestate.com</a></div>
            </div>
          </div>
          <div className="bg-navy-500 p-6">
            <h3 className="font-display text-lg text-white mb-3">Office Hours</h3>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex justify-between"><span>Monday – Friday</span><span>9:00 AM – 6:00 PM</span></div>
              <div className="flex justify-between"><span>Saturday</span><span>10:00 AM – 4:00 PM</span></div>
              <div className="flex justify-between"><span>Sunday</span><span>By Appointment</span></div>
            </div>
          </div>
        </div>
      </div></section>
    </div>
  );
}

// ── MORTGAGE CALCULATOR ────────────────────────────────────────────────
export function MortgageCalculatorPage() {
  const [form, setForm] = useState({ price:450000, down:20, rate:7.5, years:30, tax:3600, insurance:1200, hoa:0 });
  const principal = form.price * (1 - form.down/100);
  const monthly = calcMortgage({ price:form.price, downPayment:form.down, rate:form.rate, years:form.years });
  const total = monthly + form.tax/12 + form.insurance/12 + form.hoa;
  const totalInterest = (monthly * form.years * 12) - principal;
  const set = (k,v) => setForm(f=>({...f,[k]:Number(v)||0}));
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Mortgage Calculator</h1><p className="text-white/50">Estimate your monthly payment with taxes, insurance, and HOA</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 p-8 space-y-4">
          <h2 className="font-display text-xl text-navy-500 mb-2">Loan Details</h2>
          {[['Home Price ($)','price'],['Down Payment (%)','down'],['Interest Rate (%)','rate'],['Annual Property Tax ($)','tax'],['Annual Insurance ($)','insurance'],['Monthly HOA ($)','hoa']].map(([l,k])=>(
            <div key={k}><label className="label">{l}</label><input type="number" step={k==='rate'?'0.1':k==='down'?'1':'100'} value={form[k]} onChange={e=>set(k,e.target.value)} className="input-field"/></div>
          ))}
          <div><label className="label">Loan Term</label>
            <select value={form.years} onChange={e=>set('years',e.target.value)} className="input-field">
              <option value={15}>15 years</option><option value={20}>20 years</option><option value={30}>30 years</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-navy-500 p-8 text-center">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Total Monthly Payment</p>
            <p className="font-display text-5xl text-white">${Math.round(total).toLocaleString()}</p>
            <p className="text-white/40 text-xs mt-2">/month</p>
          </div>
          <div className="bg-white border border-gray-100 p-6 space-y-3">
            {[['Principal & Interest', Math.round(monthly)],['Property Tax', Math.round(form.tax/12)],['Home Insurance', Math.round(form.insurance/12)],['HOA Fees', Math.round(form.hoa)]].map(([l,v])=>(
              <div key={l} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-400">{l}</span>
                <span className="font-medium">${v.toLocaleString()}/mo</span>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-100 p-6 space-y-3">
            {[['Loan Amount', `$${Math.round(principal).toLocaleString()}`],['Total Interest', `$${Math.round(totalInterest).toLocaleString()}`],['Total Cost', `$${Math.round(principal+totalInterest).toLocaleString()}`]].map(([l,v])=>(
              <div key={l} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-400">{l}</span><span className="font-medium text-navy-500">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">This is an estimate. Consult a licensed lender for official rates.</p>
          <Link to="/contact" className="btn-gold w-full text-center block">Talk to a Mortgage Expert</Link>
        </div>
      </div></section>
    </div>
  );
}

// ── HOME VALUATION ─────────────────────────────────────────────────────
export function HomeValuationPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', beds:'', baths:'', sqft:'', condition:'good', type:'valuation', message:'Free CMA request' });
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await leadAPI.create(form); setSent(true); toast.success('Valuation request submitted!'); }
    catch { toast.error('Failed to submit'); }
  };
  if (sent) return (
    <div className="pt-32 text-center max-w-lg mx-auto px-6">
      <CheckCircle size={48} className="text-green-500 mx-auto mb-4"/>
      <h2 className="font-display text-3xl text-navy-500 mb-3">Request Received!</h2>
      <p className="text-gray-400 mb-6">A licensed agent will contact you within 24 hours with your free Comparative Market Analysis.</p>
      <Link to="/" className="btn-gold">Return Home</Link>
    </div>
  );
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Free Home Valuation</h1><p className="text-white/50">Get a free Comparative Market Analysis from a local expert</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-3xl mx-auto px-6">
        <div className="bg-white border border-gray-100 p-8">
          <div className="mb-6"><p className="text-gold-500 text-xs uppercase tracking-widest mb-2">No Obligation</p><h2 className="font-display text-2xl text-navy-500">What's My Home Worth?</h2><p className="text-gray-400 text-sm mt-2">Fill in your property details and one of our expert agents will prepare a detailed CMA for your home.</p></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Property Address *</label><input required value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="input-field" placeholder="123 Main St, Tucson, AZ 85701"/></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="label">Bedrooms</label><input type="number" value={form.beds} onChange={e=>setForm({...form,beds:e.target.value})} className="input-field"/></div>
              <div><label className="label">Bathrooms</label><input type="number" step="0.5" value={form.baths} onChange={e=>setForm({...form,baths:e.target.value})} className="input-field"/></div>
              <div><label className="label">Sq Footage</label><input type="number" value={form.sqft} onChange={e=>setForm({...form,sqft:e.target.value})} className="input-field"/></div>
            </div>
            <div><label className="label">Property Condition</label>
              <select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} className="input-field">
                <option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="needs-work">Needs Work</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Your Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field"/></div>
              <div><label className="label">Email *</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field"/></div>
            </div>
            <div><label className="label">Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-field"/></div>
            <button type="submit" className="btn-gold w-full">Request Free Valuation</button>
          </form>
        </div>
      </div></section>
    </div>
  );
}

// ── BLOG ───────────────────────────────────────────────────────────────
export function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ blogAPI.getAll().then(({data})=>{ setBlogs(data.blogs||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Market Updates & News</h1><p className="text-white/50">Stay informed with the latest Tucson real estate insights</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-7xl mx-auto px-6">
        {loading ? <SectionLoader /> : blogs.length===0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">No posts yet.</p>
            <p className="text-gray-300 text-sm">Admins and agents can publish market reports from their dashboards.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(b=>(
              <Link key={b._id} to={`/blog/${b.slug}`} className="card group">
                {b.coverImage && <img src={b.coverImage} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" alt=""/>}
                <div className="p-6">
                  <span className="text-xs text-gold-500 uppercase tracking-widest">{b.category?.replace('-',' ')}</span>
                  <h3 className="font-display text-xl text-navy-500 mt-2 mb-2 group-hover:text-gold-600 transition-colors">{b.title}</h3>
                  {b.excerpt && <p className="text-gray-400 text-sm line-clamp-2">{b.excerpt}</p>}
                  <p className="text-gray-300 text-xs mt-3">{formatDate(b.publishedAt)} · {b.author?.firstName} {b.author?.lastName}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div></section>
    </div>
  );
}

export function BlogDetailPage() {
  const { slug } = require('react-router-dom').useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ blogAPI.getOne(slug).then(({data})=>{ setBlog(data.blog); setLoading(false); }).catch(()=>setLoading(false)); },[slug]);
  if (loading) return <SectionLoader />;
  if (!blog) return <div className="pt-32 text-center text-gray-400">Post not found</div>;
  return (
    <div className="pt-20 bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/blog" className="text-sm text-gold-500 hover:underline mb-6 block">← Back to Blog</Link>
        {blog.coverImage && <img src={blog.coverImage} className="w-full h-64 object-cover mb-8" alt=""/>}
        <span className="text-xs text-gold-500 uppercase tracking-widest">{blog.category?.replace('-',' ')}</span>
        <h1 className="font-display text-4xl text-navy-500 mt-2 mb-4">{blog.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-200">
          <span>{blog.author?.firstName} {blog.author?.lastName}</span>
          <span>·</span><span>{formatDate(blog.publishedAt)}</span>
          {blog.views>0&&<><span>·</span><span>{blog.views} views</span></>}
        </div>
        <div className="prose text-gray-600 leading-relaxed whitespace-pre-line">{blog.content}</div>
      </div>
    </div>
  );
}

// ── NEIGHBORHOODS ──────────────────────────────────────────────────────
export function NeighborhoodsPage() {
  const [hoods, setHoods] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ neighborhoodAPI.getAll().then(({data})=>{ setHoods(data.neighborhoods||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  const defaultHoods = [
    { _id:'1', name:'Oro Valley', slug:'oro-valley', city:'Oro Valley', state:'AZ', description:'Master-planned community with top-rated schools and Catalina Mountains views.', medianHomePrice:485000, activeListings:142, img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' },
    { _id:'2', name:'Marana', slug:'marana', city:'Marana', state:'AZ', description:'Fast-growing suburb with newer construction, great amenities, and easy I-10 access.', medianHomePrice:412000, activeListings:89, img:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80' },
    { _id:'3', name:'Sahuarita', slug:'sahuarita', city:'Sahuarita', state:'AZ', description:'Affordable family-friendly community with excellent schools south of Tucson.', medianHomePrice:365000, activeListings:67, img:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
    { _id:'4', name:'Foothills', slug:'foothills', city:'Tucson', state:'AZ', description:'Stunning mountain views, luxury homes, and proximity to hiking trails.', medianHomePrice:620000, activeListings:54, img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80' },
    { _id:'5', name:'Midtown', slug:'midtown', city:'Tucson', state:'AZ', description:'Walkable urban neighborhood near restaurants, arts district, and U of A.', medianHomePrice:295000, activeListings:38, img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80' },
    { _id:'6', name:'Vail', slug:'vail', city:'Vail', state:'AZ', description:'Award-winning Vail School District with newer communities and desert scenery.', medianHomePrice:385000, activeListings:71, img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' },
  ];
  const display = hoods.length>0 ? hoods : defaultHoods;
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Neighborhood Guides</h1><p className="text-white/50">Discover the unique character of every community we serve</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-7xl mx-auto px-6">
        {loading ? <SectionLoader /> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {display.map(h=>(
              <Link key={h._id} to={`/neighborhoods/${h.slug}`} className="card group relative overflow-hidden h-64 block">
                <img src={h.img||`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt=""/>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-500/80 via-navy-500/20 to-transparent"/>
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-display text-2xl text-white">{h.name}</h3>
                  <div className="flex gap-3 text-white/60 text-sm mt-1">
                    {h.medianHomePrice&&<span>Avg: {formatPrice(h.medianHomePrice)}</span>}
                    {h.activeListings>0&&<span>{h.activeListings} listings</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div></section>
    </div>
  );
}

export function NeighborhoodDetailPage() {
  const { slug } = require('react-router-dom').useParams();
  const [hood, setHood] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ neighborhoodAPI.getOne(slug).then(({data})=>{ setHood(data.neighborhood); setLoading(false); }).catch(()=>setLoading(false)); },[slug]);
  if (loading) return <SectionLoader />;
  if (!hood) return (
    <div className="pt-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/neighborhoods" className="text-sm text-gold-500 mb-6 block">← Back to Neighborhoods</Link>
        <h1 className="font-display text-4xl text-navy-500 mb-4 capitalize">{slug?.replace(/-/g,' ')}</h1>
        <p className="text-gray-400">Neighborhood guide coming soon. <Link to="/contact" className="text-gold-500">Contact us</Link> for more information.</p>
      </div>
    </div>
  );
  return (
    <div className="pt-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/neighborhoods" className="text-sm text-gold-500 mb-6 block">← All Neighborhoods</Link>
        <h1 className="font-display text-4xl text-navy-500 mb-2">{hood.name}</h1>
        <p className="text-gray-400 text-sm mb-6">{hood.city}, {hood.state}</p>
        {hood.description && <p className="text-gray-500 leading-relaxed mb-8">{hood.description}</p>}
        {hood.medianHomePrice && (
          <div className="bg-white border border-gray-100 p-6 mb-6">
            <h3 className="font-display text-lg text-navy-500 mb-3">Market Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div><p className="font-display text-2xl text-gold-500">{formatPrice(hood.medianHomePrice)}</p><p className="text-xs text-gray-400 mt-1">Median Price</p></div>
              {hood.walkScore&&<div><p className="font-display text-2xl text-navy-500">{hood.walkScore}</p><p className="text-xs text-gray-400 mt-1">Walk Score</p></div>}
              {hood.activeListings>0&&<div><p className="font-display text-2xl text-navy-500">{hood.activeListings}</p><p className="text-xs text-gray-400 mt-1">Active Listings</p></div>}
            </div>
          </div>
        )}
        <Link to={`/properties?city=${hood.name}`} className="btn-gold inline-flex items-center gap-2">Browse {hood.name} Listings <ArrowRight size={16}/></Link>
      </div>
    </div>
  );
}

// ── BUYERS GUIDE ───────────────────────────────────────────────────────
export function BuyersGuidePage() {
  const steps = [
    { n:'01', title:'Get Pre-Approved', desc:'Before you start looking at homes, get pre-approved for a mortgage. This shows sellers you\'re serious and helps you understand your budget.' },
    { n:'02', title:'Find Your Agent', desc:'Partner with a LuxEstate buyer\'s agent who specializes in your target neighborhoods. Our agents have deep local market knowledge.' },
    { n:'03', title:'Define Your Criteria', desc:'Create a list of must-haves vs. nice-to-haves. Consider location, school districts, commute time, and future resale value.' },
    { n:'04', title:'Search & Tour Homes', desc:'We\'ll set up custom MLS alerts and schedule showings for properties that meet your criteria.' },
    { n:'05', title:'Make an Offer', desc:'When you find the right home, your agent will prepare a competitive offer with strategic contingencies.' },
    { n:'06', title:'Inspection & Due Diligence', desc:'We\'ll arrange a home inspection, review disclosures, and negotiate any repairs before you commit.' },
    { n:'07', title:'Secure Financing', desc:'Work with your lender to finalize your loan. We\'ll coordinate the appraisal and any lender requirements.' },
    { n:'08', title:'Close & Move In!', desc:'Sign documents, transfer funds, and receive your keys. Welcome home!' },
  ];
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Buyer's Guide</h1><p className="text-white/50">Everything you need to know about buying a home in Tucson</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-4xl mx-auto px-6">
        <SectionHeader eyebrow="Step by Step" title="The Home Buying Process" subtitle="From pre-approval to closing, we guide you every step of the way." />
        <div className="mt-12 space-y-6">
          {steps.map(({n,title,desc})=>(
            <div key={n} className="bg-white border border-gray-100 p-6 flex gap-6">
              <div className="w-12 h-12 bg-gold-500 flex items-center justify-center text-white font-display text-lg shrink-0">{n}</div>
              <div><h3 className="font-display text-xl text-navy-500 mb-2">{title}</h3><p className="text-gray-500 leading-relaxed">{desc}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center"><Link to="/contact" className="btn-gold">Connect with a Buyer's Agent</Link></div>
      </div></section>
    </div>
  );
}

// ── SELLERS GUIDE ──────────────────────────────────────────────────────
export function SellersGuidePage() {
  const steps = [
    {n:'01',title:'Free Home Valuation',desc:'Get a comprehensive CMA from our agents to price your home accurately and competitively.'},
    {n:'02',title:'Staging & Preparation',desc:'Our staging advice and trusted contractors help maximize your home\'s appeal and value.'},
    {n:'03',title:'Professional Photography',desc:'High-quality photos, drone footage, and 3D virtual tours attract more qualified buyers.'},
    {n:'04',title:'Strategic Marketing',desc:'Your listing appears on MLS, Zillow, Realtor.com, our website, and targeted social media campaigns.'},
    {n:'05',title:'Showings & Open Houses',desc:'We manage all showing requests and feedback, keeping you informed throughout the process.'},
    {n:'06',title:'Receive & Negotiate Offers',desc:'Your agent will review all offers and negotiate on your behalf to maximize your net proceeds.'},
    {n:'07',title:'Inspection & Repairs',desc:'We help you navigate inspection requests and make strategic decisions about repair credits.'},
    {n:'08',title:'Closing Day',desc:'Review the settlement statement, sign documents, and receive your proceeds. Done!'},
  ];
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Seller's Guide</h1><p className="text-white/50">Maximize your home's value with our proven selling strategy</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-4xl mx-auto px-6">
        <SectionHeader eyebrow="Proven Strategy" title="How to Sell Your Home for Top Dollar" />
        <div className="mt-12 space-y-6">
          {steps.map(({n,title,desc})=>(
            <div key={n} className="bg-white border border-gray-100 p-6 flex gap-6">
              <div className="w-12 h-12 bg-navy-500 flex items-center justify-center text-white font-display text-lg shrink-0">{n}</div>
              <div><h3 className="font-display text-xl text-navy-500 mb-2">{title}</h3><p className="text-gray-500 leading-relaxed">{desc}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center"><Link to="/home-valuation" className="btn-gold">Get Free Home Valuation</Link></div>
      </div></section>
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────
const FAQS = [
  {q:'What is a contingency?',a:'A contingency is a condition that must be met before a real estate transaction is finalized. Common contingencies include financing (you need to secure a mortgage), inspection (you can cancel if the inspection reveals major issues), and appraisal (the home must appraise at or near the purchase price).'},
  {q:'How much are closing costs?',a:'Closing costs typically range from 2–5% of the purchase price. Buyer costs include loan origination fees, appraisal, title insurance, escrow fees, and prepaid items. Seller costs usually include agent commissions (typically 5–6%) and any negotiated seller concessions.'},
  {q:'How long does it take to close on a house?',a:'The typical escrow period is 30–45 days. Cash purchases can close in as little as 1–2 weeks. The timeline depends on financing, inspection schedules, title search, and lender processing times.'},
  {q:'What credit score do I need to buy a home?',a:'Conventional loans typically require a minimum 620 credit score. FHA loans can go as low as 580 (3.5% down) or 500 (10% down). VA and USDA loans have their own requirements. Higher scores get better interest rates.'},
  {q:'What is an earnest money deposit?',a:'Earnest money (typically 1–3% of the purchase price) is a good-faith deposit showing the seller you\'re serious. It\'s held in escrow and applied toward your down payment or closing costs at closing. You may forfeit it if you back out without a valid contingency.'},
  {q:'Should I get a home inspection?',a:'Absolutely yes. A home inspection by a licensed inspector typically costs $300–500 and can reveal issues that could cost thousands to fix. It also gives you negotiating power for repair credits.'},
  {q:'What is the difference between pre-qualification and pre-approval?',a:'Pre-qualification is an informal estimate based on self-reported information. Pre-approval involves a formal application, credit check, income verification, and provides a conditional commitment letter — which is what sellers want to see.'},
  {q:'How do I know what to offer on a home?',a:'Your agent will prepare a Comparative Market Analysis (CMA) showing recent sales of similar homes. In competitive markets, offering above asking price or waiving contingencies may be necessary. Your agent will advise based on market conditions.'},
];
export function FAQPage() {
  const [open, setOpen] = useState(null);
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Frequently Asked Questions</h1><p className="text-white/50">Answers to common real estate questions</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-3xl mx-auto px-6">
        <div className="space-y-3">
          {FAQS.map(({q,a},i)=>(
            <div key={i} className="bg-white border border-gray-100">
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-navy-500 pr-4">{q}</span>
                {open===i ? <Minus size={18} className="text-gold-500 shrink-0"/> : <Plus size={18} className="text-gold-500 shrink-0"/>}
              </button>
              {open===i && <div className="px-5 pb-5"><p className="text-gray-500 leading-relaxed text-sm">{a}</p></div>}
            </div>
          ))}
        </div>
        <div className="mt-10 bg-navy-500 p-8 text-center">
          <h3 className="font-display text-2xl text-white mb-3">Still Have Questions?</h3>
          <p className="text-white/60 mb-5 text-sm">Our expert agents are here to help with any real estate question.</p>
          <Link to="/contact" className="btn-gold text-sm">Contact an Agent</Link>
        </div>
      </div></section>
    </div>
  );
}

// ── SOLD ───────────────────────────────────────────────────────────────
export function SoldPage() {
  const [props, setProps] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ propertyAPI.getSold().then(({data})=>{ setProps(data.properties||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Recently Sold</h1><p className="text-white/50">A showcase of our successful transactions</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-7xl mx-auto px-6">
        {loading ? <SectionLoader /> : props.length===0 ? (
          <div className="text-center py-20"><Award size={48} className="text-gray-200 mx-auto mb-4"/><p className="text-gray-400">Sold properties will appear here as agents mark listings as sold.</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {props.map(p=><PropertyCard key={p._id} property={p}/>)}
          </div>
        )}
      </div></section>
    </div>
  );
}

// ── SIMPLE PAGES ───────────────────────────────────────────────────────
export function RelocationPage() {
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Relocation Guide</h1><p className="text-white/50">Moving to Tucson? We'll make your transition seamless.</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-4xl mx-auto px-6 space-y-8">
        {[['Why Tucson?','Tucson offers a unique blend of outdoor adventure, vibrant arts scene, diverse cuisine, and affordable living. With over 350 days of sunshine, world-class hiking, and a thriving tech and education sector anchored by the University of Arizona, Tucson is one of Arizona\'s most desirable places to live.'],['Climate & Lifestyle','The Sonoran Desert climate means warm winters and monsoon summers. Outdoor enthusiasts love the Saguaro National Park, Mount Lemmon skiing, and hundreds of hiking and biking trails. The city boasts an award-winning restaurant scene and growing craft brewery culture.'],['Cost of Living','Tucson\'s cost of living is 9% below the national average, with housing costs significantly lower than Phoenix, San Diego, or Austin. You get more home for your money in every neighborhood.'],['Schools & Education','Tucson is served by multiple school districts including TUSD, SUSD, Catalina Foothills, Marana, Vail, and Amphitheater. The University of Arizona and Pima Community College offer higher education options.']].map(([t,d])=>(
          <div key={t} className="bg-white border border-gray-100 p-8">
            <h2 className="font-display text-2xl text-navy-500 mb-3">{t}</h2>
            <p className="text-gray-500 leading-relaxed">{d}</p>
          </div>
        ))}
        <div className="text-center"><Link to="/contact" className="btn-gold">Connect with a Relocation Specialist</Link></div>
      </div></section>
    </div>
  );
}

export function VendorsPage() {
  const categories = [
    {cat:'Mortgage Lenders',items:['Academy Mortgage – (520) 321-1000','Desert Financial – (520) 295-8000','Guild Mortgage – (520) 742-0000']},
    {cat:'Home Inspectors',items:['AZ Home Inspection Pro – (520) 555-0101','Desert Eagle Inspections – (520) 555-0202','Premier Property Inspections – (520) 555-0303']},
    {cat:'Title Companies',items:['Fidelity National Title – (520) 555-0401','First American Title – (520) 555-0402','Old Republic Title – (520) 555-0403']},
    {cat:'Contractors & Repairs',items:['Desert Sun Contractors – (520) 555-0501','Southwest Handyman – (520) 555-0502','Catalina Roofing – (520) 555-0503']},
    {cat:'Moving Companies',items:['Atlas Moving Tucson – (520) 555-0601','Desert Movers – (520) 555-0602','Two Men and a Truck – (520) 555-0603']},
  ];
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Preferred Vendors</h1><p className="text-white/50">Trusted local service providers we recommend</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-4xl mx-auto px-6">
        <p className="text-gray-400 text-sm mb-8 bg-yellow-50 border border-yellow-200 p-4">These vendors are provided for informational purposes. LuxEstate does not receive compensation for referrals. Always do your own due diligence.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(({cat,items})=>(
            <div key={cat} className="bg-white border border-gray-100 p-6">
              <h3 className="font-display text-lg text-navy-500 mb-4 border-b border-gray-100 pb-3">{cat}</h3>
              <ul className="space-y-2">{items.map(i=><li key={i} className="text-sm text-gray-500">{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div></section>
    </div>
  );
}

export function CareersPage() {
  return (
    <div className="pt-20">
      <div className="bg-navy-500 py-16"><div className="max-w-7xl mx-auto px-6"><h1 className="font-display text-5xl text-white mb-3">Join Our Team</h1><p className="text-white/50">Build your real estate career with Southern Arizona's best agency</p></div></div>
      <section className="py-16 bg-cream"><div className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="bg-white border border-gray-100 p-8">
          <h2 className="font-display text-2xl text-navy-500 mb-4">Why Join LuxEstate?</h2>
          <div className="space-y-3">{[['Industry-leading commission splits','Earn up to 80/20 splits with performance bonuses'],['Training & Mentorship','Our 12-week onboarding program and ongoing coaching programs'],['Marketing Support','Professional photography, social media, and listing marketing included'],['Technology Platform','Best-in-class CRM, lead management, and transaction software'],['Brand Recognition','Leverage 38 years of Tucson market credibility and referral network'],['Team Culture','Collaborative environment with annual awards, events, and community service']].map(([t,d])=>(
            <div key={t} className="flex gap-3"><CheckCircle size={18} className="text-gold-500 mt-0.5 shrink-0"/><div><p className="font-medium text-sm">{t}</p><p className="text-gray-400 text-xs">{d}</p></div></div>
          ))}</div>
        </div>
        <div className="bg-white border border-gray-100 p-8">
          <h2 className="font-display text-2xl text-navy-500 mb-6">Apply Now</h2>
          <form onSubmit={e=>{e.preventDefault();toast.success('Application submitted! We\'ll be in touch within 48 hours.');}} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Full Name</label><input required className="input-field" placeholder="Jane Smith"/></div>
              <div><label className="label">Email</label><input required type="email" className="input-field"/></div>
            </div>
            <div><label className="label">Phone</label><input type="tel" className="input-field"/></div>
            <div><label className="label">License Status</label><select className="input-field"><option>Licensed Agent</option><option>Pre-License Student</option><option>Transferring License</option><option>Team Lead Looking for Brokerage</option></select></div>
            <div><label className="label">Why LuxEstate? (Tell us about yourself)</label><textarea required rows={4} className="input-field" placeholder="Tell us about your experience and why you want to join our team..."/></div>
            <button type="submit" className="btn-gold w-full">Submit Application</button>
          </form>
        </div>
      </div></section>
    </div>
  );
}
