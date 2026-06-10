import React, { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import api, { loginUser as apiLogin, registerUser as apiRegister } from './services/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import SearchWorkers from './pages/customer/SearchWorkers';
import WorkerDetails from './pages/customer/WorkerDetails';
import BookService from './pages/customer/BookService';
import MyBookings from './pages/customer/MyBookings';
import CustomerProfile from './pages/customer/Profile';

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import ManageProfile from './pages/worker/ManageProfile';
import ViewBookings from './pages/worker/ViewBookings';
import WorkHistory from './pages/worker/WorkHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import WorkerVerification from './pages/admin/WorkerVerification';
import BookingManagement from './pages/admin/BookingManagement';
import Reports from './pages/admin/Reports';

import './App.css';

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase()) && user.role?.toLowerCase() !== 'admin') {
    if (user.role?.toLowerCase() === 'admin')  return <Navigate to="/admin/dashboard" replace />;
    if (user.role?.toLowerCase() === 'worker') return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('localHeroUser');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    // Normalise role to lowercase so ProtectedRoute comparisons work
    const normalised = { ...data, role: data.role?.toLowerCase() };
    sessionStorage.setItem('localHeroUser', JSON.stringify(normalised));
    setUser(normalised);
    return normalised;
  };

  const register = async (userData) => {
    const data = await apiRegister(userData);
    const normalised = { ...data, role: data.role?.toLowerCase() };
    if (normalised.role === 'customer') {
      sessionStorage.setItem('localHeroUser', JSON.stringify(normalised));
      setUser(normalised);
    }
    return normalised;
  };

  const logout = () => {
    sessionStorage.removeItem('localHeroUser');
    setUser(null);
  };

  const updateProfile = async (name, phone, address, workerDetails) => {
    if (workerDetails) {
      const payload = {
        ...workerDetails,
        skill: Array.isArray(workerDetails.skills) ? workerDetails.skills.join(', ') : workerDetails.skills,
        skills: Array.isArray(workerDetails.skills) ? workerDetails.skills.join(', ') : workerDetails.skills
      };
      await api.put('/worker/profile', payload);
    }
    
    const updatedUser = {
      ...user,
      name,
      phone,
      address
    };
    sessionStorage.setItem('localHeroUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 py-4 container">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer */}
            <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/customer/search"    element={<ProtectedRoute allowedRoles={['customer']}><SearchWorkers /></ProtectedRoute>} />
            <Route path="/customer/worker/:id" element={<ProtectedRoute allowedRoles={['customer']}><WorkerDetails /></ProtectedRoute>} />
            <Route path="/customer/book/:id"  element={<ProtectedRoute allowedRoles={['customer']}><BookService /></ProtectedRoute>} />
            <Route path="/customer/bookings"  element={<ProtectedRoute allowedRoles={['customer']}><MyBookings /></ProtectedRoute>} />
            <Route path="/customer/profile"   element={<ProtectedRoute allowedRoles={['customer']}><CustomerProfile /></ProtectedRoute>} />

            {/* Worker */}
            <Route path="/worker/dashboard" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
            <Route path="/worker/profile"   element={<ProtectedRoute allowedRoles={['worker']}><ManageProfile /></ProtectedRoute>} />
            <Route path="/worker/bookings"  element={<ProtectedRoute allowedRoles={['worker']}><ViewBookings /></ProtectedRoute>} />
            <Route path="/worker/history"   element={<ProtectedRoute allowedRoles={['worker']}><WorkHistory /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard"    element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users"        element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/verification" element={<ProtectedRoute allowedRoles={['admin']}><WorkerVerification /></ProtectedRoute>} />
            <Route path="/admin/bookings"     element={<ProtectedRoute allowedRoles={['admin']}><BookingManagement /></ProtectedRoute>} />
            <Route path="/admin/reports"      element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
