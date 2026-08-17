import { create } from 'zustand';
import { authAPI } from '../services/api';

// savedProperties can arrive as ids or as populated documents (older payloads /
// stale localStorage). Everything downstream compares against ids, so flatten here.
const toIds = (list) =>
  Array.isArray(list) ? list.map((p) => (typeof p === 'string' ? p : p?._id)).filter(Boolean) : [];

const normalizeUser = (user) => (user ? { ...user, savedProperties: toIds(user.savedProperties) } : user);

const persistUser = (user) => {
  localStorage.setItem('luxestate_user', JSON.stringify(user));
  return user;
};

const useAuthStore = create((set, get) => ({
  user: normalizeUser(JSON.parse(localStorage.getItem('luxestate_user') || 'null')),
  token: localStorage.getItem('luxestate_token') || null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('luxestate_token', data.token);
      const user = persistUser(normalizeUser(data.user));
      set({ user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register(userData);
      localStorage.setItem('luxestate_token', data.token);
      const user = persistUser(normalizeUser(data.user));
      set({ user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.forgotPassword(email);
      set({ loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Request failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  resetPassword: async (token, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.resetPassword(token, password);
      localStorage.setItem('luxestate_token', data.token);
      const user = persistUser(normalizeUser(data.user));
      set({ user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem('luxestate_token');
    localStorage.removeItem('luxestate_user');
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    const updated = normalizeUser({ ...get().user, ...userData });
    persistUser(updated);
    set({ user: updated });
  },

  refreshUser: async () => {
    try {
      const { data } = await authAPI.getMe();
      const user = persistUser(normalizeUser(data.user));
      set({ user });
    } catch { /* keep the cached user if the refresh fails */ }
  },

  isSaved: (propertyId) => !!propertyId && (get().user?.savedProperties || []).includes(propertyId),

  // Saves/unsaves on the server, then writes the authoritative list back into the
  // store so every consumer (cards, dashboard counter, saved tab) stays in sync.
  toggleSaved: async (propertyId) => {
    const current = get().user;
    if (!current) throw new Error('Not authenticated');
    const { data } = await authAPI.toggleSave(propertyId);
    const savedProperties = toIds(data.savedProperties);
    const updated = { ...get().user, savedProperties };
    persistUser(updated);
    set({ user: updated });
    return data.saved ?? savedProperties.includes(propertyId);
  },

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',
  isAgent: () => get().user?.role === 'agent',
  isClient: () => get().user?.role === 'client',
}));

export default useAuthStore;
