export const formatPrice = (price) => {
  if (!price) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
};

export const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n);

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatShortDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getStatusColor = (status) => {
  const map = {
    active: 'bg-green-600',
    pending: 'bg-yellow-500',
    sold: 'bg-red-600',
    'off-market': 'bg-gray-500',
    'coming-soon': 'bg-blue-600',
    confirmed: 'bg-green-600',
    cancelled: 'bg-red-600',
    completed: 'bg-gray-600',
    rescheduled: 'bg-yellow-500',
    new: 'bg-blue-600',
    contacted: 'bg-yellow-500',
    qualified: 'bg-green-500',
    converted: 'bg-emerald-700',
    lost: 'bg-red-500',
  };
  return map[status] || 'bg-gray-500';
};

export const getPropertyTypeLabel = (type) => {
  const map = {
    'single-family': 'Single Family',
    'condo': 'Condo',
    'townhouse': 'Townhouse',
    'multi-family': 'Multi-Family',
    'land': 'Land',
    'commercial': 'Commercial',
    'luxury': 'Luxury',
  };
  return map[type] || type;
};

export const truncate = (str, n = 100) => str?.length > n ? str.slice(0, n) + '...' : str;

export const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const calcMortgage = ({ price, downPayment = 20, rate = 7.5, years = 30 }) => {
  const principal = price * (1 - downPayment / 100);
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
};

export const generateTimeSlots = () => [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM'
];

export const PROPERTY_TYPES = ['single-family','condo','townhouse','multi-family','land','commercial','luxury'];
export const LISTING_TYPES = ['sale','rent'];
export const BED_OPTIONS = ['1','2','3','4','5+'];
export const BATH_OPTIONS = ['1','1.5','2','3','4+'];

export const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
];

export const getDefaultPhoto = (index = 0) => MOCK_IMAGES[index % MOCK_IMAGES.length];
