import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Home, Equal, ExternalLink } from 'lucide-react';

const SocialIcon = ({ label, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
    className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-gold-500 hover:text-gold-400 transition-all text-white/50 text-xs font-bold">
    {label[0]}
  </a>
);

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gold-500 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">L</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold text-gold-400">LuxEstate</span>
              <span className="block text-xs tracking-widest text-white/40 -mt-1">REALTY GROUP</span>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Tucson's premier real estate agency. Helping families find their perfect home since 1985, with over 10,000 successful transactions.
          </p>
          <div className="flex gap-2">
            {[['Facebook','https://facebook.com'],['Instagram','https://instagram.com'],['LinkedIn','https://linkedin.com'],['X/Twitter','https://x.com']].map(([l,h]) => (
              <SocialIcon key={l} label={l} href={h} />
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-base text-gold-400 mb-5">Quick Links</h4>
          <ul className="space-y-2.5">
            {[
              ['Properties for Sale', '/properties?listingType=sale'],
              ['Properties for Rent', '/properties?listingType=rent'],
              ['Featured Listings', '/properties?featured=true'],
              ['Recently Sold', '/sold'],
              ['Our Agents', '/agents'],
              ['Neighborhoods', '/neighborhoods'],
              ['Schedule a Showing', '/contact'],
              ['Home Valuation', '/home-valuation'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-white/60 text-sm hover:text-gold-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-display text-base text-gold-400 mb-5">Resources</h4>
          <ul className="space-y-2.5">
            {[
              ["Buyer's Guide", '/buyers-guide'],
              ["Seller's Guide", '/sellers-guide'],
              ['Mortgage Calculator', '/mortgage-calculator'],
              ['Market Reports', '/blog'],
              ['Neighborhood Guides', '/neighborhoods'],
              ['FAQ', '/faq'],
              ['Relocation Guide', '/relocation'],
              ['Preferred Vendors', '/vendors'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-white/60 text-sm hover:text-gold-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-base text-gold-400 mb-5">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
              <span className="text-white/60 text-sm">1234 East Broadway Blvd<br />Tucson, AZ 85719</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={16} className="text-gold-500 shrink-0" />
              <a href="tel:5205444400" className="text-white/60 text-sm hover:text-gold-400 transition-colors">
                (520) 544-4400
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={16} className="text-gold-500 shrink-0" />
              <a href="mailto:info@luxestate.com" className="text-white/60 text-sm hover:text-gold-400 transition-colors">
                info@luxestate.com
              </a>
            </li>
          </ul>
          <div className="mt-6 border border-white/10 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Office Hours</p>
            <p className="text-sm text-white/60">Mon–Fri: 9:00 AM – 6:00 PM</p>
            <p className="text-sm text-white/60">Sat: 10:00 AM – 4:00 PM</p>
            <p className="text-sm text-white/60">Sun: By Appointment</p>
          </div>
        </div>
      </div>

      {/* Equal Housing */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="border-2 border-white/30 p-2">
              <Equal size={18} className="text-white/50" />
            </div>
            <p className="text-white/40 text-xs max-w-md">
              Equal Housing Opportunity. We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the Nation.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-white/40">
            <Link to="/privacy-policy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Use</Link>
            <Link to="/accessibility" className="hover:text-gold-400 transition-colors">Accessibility</Link>
            <Link to="/dmca" className="hover:text-gold-400 transition-colors">DMCA</Link>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <p className="text-white/30 text-xs text-center">
              © {year} LuxEstate Realty Group. All rights reserved. | DRE License #BR553891000 | Information deemed reliable but not guaranteed.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
