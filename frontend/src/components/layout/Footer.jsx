import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Home, Equal, ExternalLink } from 'lucide-react';

// Brand marks from Simple Icons (CC0). lucide-react v1 no longer ships brand icons.
const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    path: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0Zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03Zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324ZM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065c0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063a2.064 2.064 0 0 1-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'X/Twitter',
    href: 'https://x.com',
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.291 19.49h2.039L6.486 3.24H4.298l13.312 17.403Z',
  },
];

const SocialIcon = ({ label, href, path }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}
    className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-gold-500 hover:text-gold-400 hover:bg-white/5 transition-all text-white/50">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
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
            {SOCIALS.map((s) => (
              <SocialIcon key={s.label} {...s} />
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
