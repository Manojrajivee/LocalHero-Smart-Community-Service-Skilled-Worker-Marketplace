import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerBookings } from '../../services/api';
import { useAuth } from '../../App';

function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, completed: 0, spent: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getCustomerBookings();
        setBookings(data);
        
        // Compute statistics
        const active = data.filter(b => b.status === 'PENDING' || b.status === 'ACCEPTED').length;
        const completed = data.filter(b => b.status === 'COMPLETED').length;
        const spent = data
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + b.totalAmount, 0);

        setStats({ active, completed, spent });
      } catch (err) {
        console.error('Error fetching customer bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.id]);

  return (
    <div className="animate-fade-in text-white pb-5">
      {/* Welcome Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <h1 className="display-6 mb-1">Hello, {user.name}!</h1>
          <p className="text-muted mb-0">What task can we help you solve in your home today?</p>
        </div>
        <div>
          <Link to="/customer/search" className="btn btn-gradient-primary">
            <i className="bi bi-search me-2"></i>Find a Worker
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase tracking-wider">Active Bookings</span>
              <h3 className="fs-2 mb-0 mt-1">{stats.active}</h3>
            </div>
            <div className="dashboard-stat-icon bg-info bg-opacity-20 text-info">
              <i className="bi bi-calendar2-range"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase tracking-wider">Jobs Completed</span>
              <h3 className="fs-2 mb-0 mt-1">{stats.completed}</h3>
            </div>
            <div className="dashboard-stat-icon bg-success bg-opacity-20 text-success">
              <i className="bi bi-check-lg"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase tracking-wider">Total Invested</span>
              <h3 className="fs-2 mb-0 mt-1">${stats.spent}</h3>
            </div>
            <div className="dashboard-stat-icon bg-indigo bg-opacity-20 text-indigo" style={{ color: '#6366f1' }}>
              <i className="bi bi-wallet2"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="card glass-card border-0 p-4 mb-5">
        <h4 className="text-white mb-3">Quick Search Categories</h4>
        <div className="row g-3">
          {[
            { name: 'Plumbing', icon: 'bi-tools', color: 'bg-primary' },
            { name: 'Electrical', icon: 'bi-lightning-charge-fill', color: 'bg-warning' },
            { name: 'Cleaning', icon: 'bi-brush-fill', color: 'bg-info' },
            { name: 'Gardening', icon: 'bi-flower1', color: 'bg-success' }
          ].map((cat, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <Link 
                to={`/customer/search?skill=${encodeURIComponent(cat.name)}`}
                className="d-flex flex-column align-items-center p-3 rounded-3 text-decoration-none hover-bg-opacity-10 border border-secondary border-opacity-10 text-center bg-dark bg-opacity-30"
                style={{ transition: 'all 0.2s ease' }}
              >
                <div className={`rounded-circle p-3 ${cat.color} bg-opacity-25 text-white mb-2 fs-4 d-flex align-items-center justify-content-center`} style={{ width: '56px', height: '56px' }}>
                  <i className={`bi ${cat.icon}`}></i>
                </div>
                <span className="text-white small fw-semibold">{cat.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings Panel */}
      <div className="card glass-card border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-white mb-0">Recent Bookings</h4>
          <Link to="/customer/bookings" className="text-info text-decoration-none small">
            View All <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5 border border-secondary border-opacity-10 rounded-3 bg-dark bg-opacity-10">
            <i className="bi bi-calendar-x fs-1 text-muted"></i>
            <h5 className="text-muted mt-3">No bookings placed yet</h5>
            <p className="text-muted small">Find and book verified service workers in Metropolis today.</p>
            <Link to="/customer/search" className="btn btn-outline-info btn-sm mt-2">
              Browse Workers
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Worker Name</th>
                  <th>Service Requested</th>
                  <th>Scheduled Date</th>
                  <th>Hourly Total</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 3).map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="fw-semibold text-white">{booking.workerName}</div>
                    </td>
                    <td>{booking.service}</td>
                    <td>
                      <div className="small text-white">{booking.date}</div>
                      <div className="small text-muted">{booking.time}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-white">${booking.totalAmount}</div>
                      <div className="small text-muted">{booking.hours} hrs @ ${booking.totalAmount / booking.hours}/hr</div>
                    </td>
                    <td>
                      <span className={`badge-status-${booking.status?.toLowerCase()}`}>
                        {booking.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link to="/customer/bookings" className="btn btn-glass btn-sm">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
