// Real API service - connects to Spring Boot backend at http://localhost:8080
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
// ─── Axios instance ──────────────────────────────────────────────────────────
export const api = axios.create({ baseURL: BASE_URL });

// Compatibility namespaces for frontend pages
api.admin = {
  getDashboardStats: async () => {
    const [statsRes, bookingsRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/bookings')
    ]);
    const stats = statsRes.data;
    const bookings = bookingsRes.data || [];
    
    const bookingStats = {
      pending: bookings.filter(b => b.status === 'PENDING').length,
      accepted: bookings.filter(b => b.status === 'ACCEPTED').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      rejected: bookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length
    };

    const serviceStats = {};
    bookings.forEach(b => {
      const sName = b.service || 'Other';
      serviceStats[sName] = (serviceStats[sName] || 0) + 1;
    });

    return {
      bookingStats,
      serviceStats,
      totalBookings: stats.totalBookings || bookings.length,
      totalCustomers: (stats.totalUsers || 0) - (stats.totalWorkers || 0),
      totalWorkers: stats.totalWorkers || 0,
      totalRevenue: stats.totalRevenue || 0
    };
  }
};

api.workers = {
  getById: async (id) => {
    const res = await api.get(`/workers/${id}`);
    return res.data;
  },
  getAll: async (search = '', category = '', verifiedOnly = true) => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    const res = await api.get('/workers', { params });
    let data = res.data || [];
    if (verifiedOnly) {
      data = data.filter(w => w.verified);
    }
    return data;
  },
  getByUserId: async (userId) => {
    const res = await api.get('/worker/profile');
    return res.data;
  }
};

api.bookings = {
  create: async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  },
  getByUser: async (role, userId) => {
    if (role === 'worker') {
      const res = await api.get('/bookings/worker');
      return res.data;
    } else {
      const res = await api.get('/bookings/customer');
      return res.data;
    }
  }
};

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const session = sessionStorage.getItem('localHeroUser');
  if (session) {
    const user = JSON.parse(session);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const registerUser = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

// ─── Workers ─────────────────────────────────────────────────────────────────
export const getWorkers = async (search = '', category = '') => {
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  const res = await api.get('/workers', { params });
  return res.data;
};

export const getWorkerById = async (id) => {
  const res = await api.get(`/workers/${id}`);
  return res.data;
};

export const getMyWorkerProfile = async () => {
  const res = await api.get('/worker/profile');
  return res.data;
};

export const updateWorkerProfile = async (workerId, updates) => {
  const res = await api.put(`/workers/${workerId}`, updates);
  return res.data;
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const createBooking = async (bookingData) => {
  const res = await api.post('/bookings', bookingData);
  return res.data;
};

export const getCustomerBookings = async () => {
  const res = await api.get('/bookings/customer');
  return res.data;
};

export const getWorkerBookings = async () => {
  const res = await api.get('/bookings/worker');
  return res.data;
};

export const getAllBookings = async () => {
  const res = await api.get('/bookings');
  return res.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const res = await api.put(`/bookings/${bookingId}/status`, { status });
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await api.put(`/bookings/${bookingId}/cancel`);
  return res.data;
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const submitReview = async (reviewData) => {
  const res = await api.post('/reviews', reviewData);
  return res.data;
};

export const getWorkerReviews = async (workerId) => {
  const res = await api.get(`/reviews/worker/${workerId}`);
  return res.data;
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const getAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const toggleBlockUser = async (userId) => {
  const res = await api.put(`/admin/users/${userId}/block`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
};

export const getAllWorkersAdmin = async () => {
  const res = await api.get('/admin/workers');
  return res.data;
};

export const toggleVerifyWorker = async (workerId) => {
  const res = await api.put(`/admin/workers/${workerId}/verify`);
  return res.data;
};

export const deleteWorker = async (workerId) => {
  const res = await api.delete(`/workers/${workerId}`);
  return res.data;
};

export default api;
