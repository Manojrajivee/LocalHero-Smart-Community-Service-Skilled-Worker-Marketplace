import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminStats = await api.admin.getDashboardStats();
        setStats(adminStats);
      } catch (err) {
        console.error('Error loading reports stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5 text-white">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Calculate percentages for visual progress charts
  const totalStatus = stats ? (
    stats.bookingStats.pending + 
    stats.bookingStats.accepted + 
    stats.bookingStats.completed + 
    stats.bookingStats.rejected
  ) : 0;

  const getPercent = (value) => {
    if (!totalStatus) return 0;
    return Math.round((value / totalStatus) * 100);
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Analytics reports</span>
        <h1 className="display-6">Platform Performance Reports</h1>
        <p className="text-muted">Analyze business metrics, service category volumes, and transaction metrics</p>
      </div>

      <div className="row g-4">
        {/* Left Side: Summary metrics & Category booking volumes */}
        <div className="col-lg-6">
          <div className="card glass-card border-0 p-4 mb-4">
            <h5 className="text-white mb-4"><i className="bi bi-bar-chart-fill text-info me-2"></i>Service Category Volume</h5>
            
            {stats && Object.keys(stats.serviceStats).length === 0 ? (
              <div className="text-center py-5 text-muted small">
                No services booked yet. Volume indicators will show up here.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3.5 mt-2">
                {stats && Object.entries(stats.serviceStats).map(([service, count], idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between text-white small mb-1.5 fw-semibold">
                      <span>{service}</span>
                      <span>{count} {count === 1 ? 'Booking' : 'Bookings'}</span>
                    </div>
                    <div className="progress bg-dark bg-opacity-40" style={{ height: '10px', borderRadius: '5px' }}>
                      <div 
                        className="progress-bar bg-info" 
                        role="progressbar" 
                        style={{ width: `${(count / stats.totalBookings) * 100}%`, borderRadius: '5px' }}
                        aria-valuenow={(count / stats.totalBookings) * 100} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card glass-card border-0 p-4">
            <h5 className="text-white mb-3"><i className="bi bi-activity text-info me-2"></i>Platform Growth Indicators</h5>
            <p className="text-muted small">Seeded snapshot metrics of platform users and support activity.</p>
            
            <div className="row text-center mt-2.5">
              <div className="col-6 py-2 border-end border-secondary border-opacity-10">
                <span className="text-muted small d-block">Active Clients</span>
                <span className="text-white fs-4 fw-bold">{stats?.totalCustomers}</span>
              </div>
              <div className="col-6 py-2">
                <span className="text-muted small d-block">Activated Heroes</span>
                <span className="text-white fs-4 fw-bold">{stats?.totalWorkers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Status Distribution & Revenue Audit */}
        <div className="col-lg-6">
          <div className="card glass-card border-0 p-4 mb-4">
            <h5 className="text-white mb-4"><i className="bi bi-pie-chart-fill text-info me-2"></i>Booking Status Distribution</h5>
            
            {stats && (
              <div className="d-flex flex-column gap-3.5">
                <div>
                  <div className="d-flex justify-content-between text-white small mb-1.5">
                    <span>Completed Jobs</span>
                    <span>{stats.bookingStats.completed} ({getPercent(stats.bookingStats.completed)}%)</span>
                  </div>
                  <div className="progress bg-dark bg-opacity-40" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: `${getPercent(stats.bookingStats.completed)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between text-white small mb-1.5">
                    <span>Accepted / Active</span>
                    <span>{stats.bookingStats.accepted} ({getPercent(stats.bookingStats.accepted)}%)</span>
                  </div>
                  <div className="progress bg-dark bg-opacity-40" style={{ height: '8px' }}>
                    <div className="progress-bar bg-info" role="progressbar" style={{ width: `${getPercent(stats.bookingStats.accepted)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between text-white small mb-1.5">
                    <span>Pending Action</span>
                    <span>{stats.bookingStats.pending} ({getPercent(stats.bookingStats.pending)}%)</span>
                  </div>
                  <div className="progress bg-dark bg-opacity-40" style={{ height: '8px' }}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${getPercent(stats.bookingStats.pending)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between text-white small mb-1.5">
                    <span>Declined / Cancelled</span>
                    <span>{stats.bookingStats.rejected} ({getPercent(stats.bookingStats.rejected)}%)</span>
                  </div>
                  <div className="progress bg-dark bg-opacity-40" style={{ height: '8px' }}>
                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${getPercent(stats.bookingStats.rejected)}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card glass-card border-0 p-4">
            <h5 className="text-white mb-3"><i className="bi bi-cash-stack text-info me-2"></i>Platform Revenue Audit</h5>
            <p className="text-muted small">Cumulative revenue flows generated from completed jobs.</p>
            
            <div className="p-3 bg-slate-900 bg-opacity-40 border border-secondary border-opacity-25 rounded-3 d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small d-block">Platform Gross Volume:</span>
                <span className="text-white small">Sum of all completed booking invoices</span>
              </div>
              <div className="text-end">
                <span className="text-success fw-bold fs-3">${stats?.totalRevenue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
