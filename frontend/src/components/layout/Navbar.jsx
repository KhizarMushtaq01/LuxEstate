import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Heart, LogOut, Settings, LayoutDashboard, Phone } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navLinks = [
  { label: 'Buy', href: '/properties?listingType=sale' },
  { label: 'Rent', href: '/properties?listingType=rent' },
  { label: 'Sell', href: '/sell' },
  {
    label: 'Communities', href: '/neighborhoods',
    children: [
      { label: 'Neighborhood Guides', href: '/neighborhoods' },
      { label: 'Area Map', href: '/neighborhoods#map' },
    ]
  },
  {
    label: 'Resources', href: '#',
    children: [
      { label: "Buyer's Guide", href: '/buyers-guide' },
      { label: "Seller's Guide", href: '/sellers-guide' },
      { label: 'Mortgage Calculator', href: '/mortgage-calculator' },
      { label: 'Home Valuation', href: '/home-valuation' },
      { label: 'Market Reports', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
    ]
  },
  { label: 'Agents', href: '/agents' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdown(null); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); setUserMenu(false); };

  const dashPath = user?.role === 'admin' ? '/admin' : user?.role === 'agent' ? '/agent' : '/client';

  const navBg = isHome && !scrolled ? 'bg-transparent' : 'bg-white shadow-md';
  const textColor = isHome && !scrolled ? 'text-white' : 'text-navy-500';
  const logoColor = isHome && !scrolled ? 'text-gold-400' : 'text-gold-500';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}>
      {/* Top bar - hidden on mobile, visible on lg+ */}
      <div className={`border-b ${isHome && !scrolled ? 'border-white/10' : 'border-gray-100'} hidden lg:block`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex justify-between items-center">
          <div className={`flex items-center gap-4 md:gap-6 text-xs ${isHome && !scrolled ? 'text-white/70' : 'text-gray-500'}`}>
            <span className="flex items-center gap-1.5"><Phone size={11} /> (520) 544-4400</span>
            <span className="hidden sm:inline">Mon–Sat: 9AM–6PM</span>
          </div>
          <div className={`flex items-center gap-3 md:gap-4 text-xs ${isHome && !scrolled ? 'text-white/70' : 'text-gray-500'}`}>
            <Link to="/careers" className="hover:text-gold-500 transition-colors">Careers</Link>
            <Link to="/contact" className="hover:text-gold-500 transition-colors hidden sm:inline">Contact Us</Link>
            <Link to="/agent-login" className="hover:text-gold-500 transition-colors hidden sm:inline">Agent Login</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gold-500 flex items-center justify-center rounded-sm">
              <span className="text-white font-display font-bold text-sm md:text-base">L</span>
            </div>
            <div>
              <span className={`font-display text-lg md:text-xl font-bold ${logoColor}`}>LuxEstate</span>
              <span className={`hidden sm:block text-[10px] md:text-xs tracking-widest ${isHome && !scrolled ? 'text-white/60' : 'text-gray-400'} -mt-1`}>REALTY GROUP</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group"
                onMouseEnter={() => link.children && setDropdown(link.label)}
                onMouseLeave={() => setDropdown(null)}>
                <Link to={link.href}
                  className={`flex items-center gap-1 px-2 xl:px-3 py-2 text-sm font-medium ${textColor} hover:text-gold-500 transition-colors whitespace-nowrap`}>
                  {link.label}
                  {link.children && <ChevronDown size={14} className="opacity-60" />}
                </Link>
                {link.children && dropdown === link.label && (
                  <div className="absolute top-full left-0 bg-white shadow-luxury min-w-48 py-2 z-50 border-t-2 border-gold-500">
                    {link.children.map((child) => (
                      <Link key={child.label} to={child.href}
                        className="block px-5 py-2.5 text-sm text-charcoal hover:text-gold-500 hover:bg-gray-50 transition-colors whitespace-nowrap">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right section - Desktop user menu / auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className={`flex items-center gap-2 px-3 py-2 ${textColor} hover:text-gold-500 transition-colors`}>
                  <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : `${user.firstName?.[0]}${user.lastName?.[0]}`}
                  </div>
                  <span className="text-sm font-medium hidden xl:inline">{user.firstName}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full bg-white shadow-luxury min-w-52 py-2 z-50 border-t-2 border-gold-500">
                    <div className="px-5 py-3 border-b border-gray-100">
                      <p className="font-medium text-sm text-navy-500">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                    <Link to={dashPath} onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-charcoal hover:text-gold-500 hover:bg-gray-50">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/client/saved" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-charcoal hover:text-gold-500 hover:bg-gray-50">
                      <Heart size={15} /> Saved Homes
                    </Link>
                    <Link to={`${dashPath}/settings`} onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-charcoal hover:text-gold-500 hover:bg-gray-50">
                      <Settings size={15} /> Settings
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-3 py-2 text-sm font-medium ${textColor} hover:text-gold-500 transition-colors`}>Sign In</Link>
                <Link to="/register" className="btn-gold text-xs px-4 py-2.5">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - always visible on mobile/tablet */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 -mr-2 ${textColor}`}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl max-h-[calc(100vh-64px)] md:max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-5 py-4 space-y-1">
            {/* Auth buttons for mobile - shown prominently at top if not logged in */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-3 mb-4 pb-4 border-b border-gray-100">
                <Link 
                  to="/login" 
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline text-center py-2.5 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileOpen(false)}
                  className="btn-gold text-center py-2.5 text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* User profile section for mobile when logged in */}
            {user && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : `${user.firstName?.[0]}${user.lastName?.[0]}`}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-500">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation links */}
            {navLinks.map((link) => (
              <div key={link.label} className="py-0.5">
                <Link 
                  to={link.href} 
                  onClick={() => !link.children && setMobileOpen(false)}
                  className="flex items-center justify-between py-2.5 text-base font-medium text-navy-500 hover:text-gold-500 border-b border-gray-50"
                >
                  {link.label}
                  {link.children && <ChevronDown size={16} className="opacity-50" />}
                </Link>
                {link.children && (
                  <div className="pl-4 mt-1 mb-2 space-y-1 border-l-2 border-gold-200 ml-1">
                    {link.children.map((child) => (
                      <Link 
                        key={child.label} 
                        to={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm text-gray-500 hover:text-gold-500"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Extra links for mobile (from top bar) */}
            <div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
              <Link to="/careers" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-500 hover:text-gold-500">
                Careers
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-500 hover:text-gold-500">
                Contact Us
              </Link>
              <Link to="/agent-login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-500 hover:text-gold-500">
                Agent Login
              </Link>
              <div className="pt-2 flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><Phone size={12} /> (520) 544-4400</span>
                <span>Mon–Sat: 9AM–6PM</span>
              </div>
            </div>

            {/* Mobile logout button */}
            {user && (
              <div className="pt-4 mt-2 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-2.5 text-sm text-red-500 hover:text-red-600 w-full"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}