import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkerBookings, updateBookingStatus, getMyWorkerProfile } from '../../services/api';
import { useAuth } from '../../App';

function WorkerDashboard() {
  const { user } = useAuth();
  const [workerProfile, setWorkerProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ earnings: 0, completed: 0, pending: 0 });

  const fetchDashboardData = async () => {
    try {
      const profile = await getMyWorkerProfile();
      setWorkerProfile(profile);

      const jobList = await getWorkerBookings();
      setBookings(jobList);

      const completed = jobList.filter(b => b.status === 'COMPLETED').length;
      const pending   = jobList.filter(b => b.status === 'PENDING').length;
      const earnings  = jobList.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.totalAmount, 0);
      setStats({ earnings, completed, pending });
    } catch (err) {
      console.error('Error fetching worker data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      {/* Welcome banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <h1 className="display-6 mb-1">Worker Dashboard</h1>
          <p className="text-muted mb-0">
            {workerProfile?.verified ? (
              <span className="text-info"><i className="bi bi-patch-check-fill me-1"></i>Verified Hero Account</span>
            ) : (
              <span className="text-warning"><i className="bi bi-hourglass-split me-1"></i>Verification Pending</span>
            )}
            {workerProfile && ` • Skills: ${workerProfile.skills || 'Not set'}`}
          </p>
        </div>
        <div>
          <Link to="/worker/profile" className="btn btn-gradient-primary">
            <i className="bi bi-gear me-2"></i>Configure Profile
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase tracking-wider">Total Earnings</span>
              <h3 className="fs-2 mb-0 mt-1">${stats.earnings.toFixed(2)}</h3>
            </div>
            <div className="dashboard-stat-icon bg-success bg-opacity-20 text-success">
              <i className="bi bi-currency-dollar animate-pulse"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase tracking-wider">Completed Jobs</span>
              <h3 className="fs-2 mb-0 mt-1">{stats.completed}</h3>
            </div>
            <div className="dashboard-stat-icon bg-info bg-opacity-20 text-info">
              <i className="bi bi-clipboard2-check"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase tracking-wider">Pending Bookings</span>
              <h3 className="fs-2 mb-0 mt-1">{stats.pending}</h3>
            </div>
            <div className="dashboard-stat-icon bg-warning bg-opacity-20 text-warning">
              <i className="bi bi-exclamation-circle"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Actions Panel */}
      <div className="card glass-card border-0 p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-white mb-0">Incoming Booking Requests</h4>
          <Link to="/worker/bookings" className="text-info text-decoration-none small">
            View All Jobs <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-info" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : bookings.filter(b => b.status === 'PENDING').length === 0 ? (
          <div className="text-center py-5 border border-secondary border-opacity-10 rounded-3 bg-dark bg-opacity-10 text-muted small">
            No incoming booking requests currently. You will show up in customer searches when verified!
          </div>
        ) : (
          <div className="table-responsive animate-fade-in">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Requested Service</th>
                  <th>Suggested Time</th>
                  <th>Est. Earnings</th>
                  <th className="text-end">Booking Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.filter((b) => b.status === 'PENDING').slice(0, 3).map((booking) => (
                  <tr key={booking.id}>
                    <td><div className="fw-semibold text-white">{booking.customerName}</div></td>
                    <td>
                      <div className="text-white">{booking.service}</div>
                      <div className="small text-muted">{booking.description}</div>
                    </td>
                    <td>
                      <div className="small text-white">{booking.date}</div>
                      <div className="small text-muted">{booking.time}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-white">${booking.totalAmount}</div>
                      <div className="small text-muted">{booking.hours} hrs</div>
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button onClick={() => handleBookingAction(booking.id, 'ACCEPTED')} className="btn btn-gradient-secondary btn-sm">Accept</button>
                        <button onClick={() => handleBookingAction(booking.id, 'REJECTED')} className="btn btn-glass btn-sm text-danger border-danger border-opacity-20">Decline</button>
                      </div>
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

export default WorkerDashboard;
