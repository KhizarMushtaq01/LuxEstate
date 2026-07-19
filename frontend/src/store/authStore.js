import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('luxestate_user') || 'null'),
  token: localStorage.getItem('luxestate_token') || null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('luxestate_token', data.token);
      localStorage.setItem('luxestate_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
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
      localStorage.setItem('luxestate_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
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

  logout: () => {
    localStorage.removeItem('luxestate_token');
    localStorage.removeItem('luxestate_user');
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    const updated = { ...get().user, ...userData };
    localStorage.setItem('luxestate_user', JSON.stringify(updated));
    set({ user: updated });
  },

  refreshUser: async () => {
    try {
      const { data } = await authAPI.getMe();
      localStorage.setItem('luxestate_user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch { }
  },

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',
  isAgent: () => get().user?.role === 'agent',
  isClient: () => get().user?.role === 'client',
}));

export default useAuthStore;
