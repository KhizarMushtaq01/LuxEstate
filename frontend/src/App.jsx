import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import NeighborhoodsPage from './pages/NeighborhoodsPage';
import NeighborhoodDetailPage from './pages/NeighborhoodDetailPage';
import MortgageCalculatorPage from './pages/MortgageCalculatorPage';
import HomeValuationPage from './pages/HomeValuationPage';
import BuyersGuidePage from './pages/BuyersGuidePage';
import SellersGuidePage from './pages/SellersGuidePage';
import FAQPage from './pages/FAQPage';
import SoldPage from './pages/SoldPage';
import RelocationPage from './pages/RelocationPage';
import VendorsPage from './pages/VendorsPage';
import CareersPage from './pages/CareersPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import AccessibilityPage from './pages/legal/AccessibilityPage';
import DMCAPage from './pages/legal/DMCAPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminLeads from './pages/admin/AdminLeads';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminNeighborhoods from './pages/admin/AdminNeighborhoods';
import AdminSettings from './pages/admin/AdminSettings';
import AgentLayout from './pages/agent/AgentLayout';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentProperties from './pages/agent/AgentProperties';
import AgentPropertyForm from './pages/agent/AgentPropertyForm';
import AgentAppointments from './pages/agent/AgentAppointments';
import AgentLeads from './pages/agent/AgentLeads';
import AgentProfile from './pages/agent/AgentProfile';
import ClientLayout from './pages/client/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientSaved from './pages/client/ClientSaved';
import ClientAppointments from './pages/client/ClientAppointments';
import ClientProfile from './pages/client/ClientProfile';

function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }, success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } } }} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/agent-login" element={<LoginPage agentLogin />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/neighborhoods" element={<NeighborhoodsPage />} />
          <Route path="/neighborhoods/:slug" element={<NeighborhoodDetailPage />} />
          <Route path="/mortgage-calculator" element={<MortgageCalculatorPage />} />
          <Route path="/home-valuation" element={<HomeValuationPage />} />
          <Route path="/buyers-guide" element={<BuyersGuidePage />} />
          <Route path="/sellers-guide" element={<SellersGuidePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/sold" element={<SoldPage />} />
          <Route path="/sell" element={<HomeValuationPage />} />
          <Route path="/relocation" element={<RelocationPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/dmca" element={<DMCAPage />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="neighborhoods" element={<AdminNeighborhoods />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/agent" element={<ProtectedRoute roles={['agent']}><AgentLayout /></ProtectedRoute>}>
          <Route index element={<AgentDashboard />} />
          <Route path="properties" element={<AgentProperties />} />
          <Route path="properties/new" element={<AgentPropertyForm />} />
          <Route path="properties/:id/edit" element={<AgentPropertyForm />} />
          <Route path="appointments" element={<AgentAppointments />} />
          <Route path="leads" element={<AgentLeads />} />
          <Route path="profile" element={<AgentProfile />} />
          <Route path="settings" element={<AgentProfile />} />
        </Route>
        <Route path="/client" element={<ProtectedRoute roles={['client']}><ClientLayout /></ProtectedRoute>}>
          <Route index element={<ClientDashboard />} />
          <Route path="saved" element={<ClientSaved />} />
          <Route path="appointments" element={<ClientAppointments />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="settings" element={<ClientProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
