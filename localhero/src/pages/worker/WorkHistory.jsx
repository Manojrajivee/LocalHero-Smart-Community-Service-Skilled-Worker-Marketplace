import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../App';

function WorkHistory() {
  const { user } = useAuth();
  const [completedBookings, setCompletedBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEarnings: 0, count: 0, rating: 0 });

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const workerProfile = await api.workers.getByUserId(user.id);
        const bookingsList = await api.bookings.getByUser('worker', user.id);
        const completed = bookingsList.filter((b) => b.status === 'completed');
        
        // Retrieve reviews
        const workerDetail = await api.workers.getById(workerProfile.id);
        
        setCompletedBookings(completed);
        setReviews(workerDetail.reviews);

        const totalEarnings = completed.reduce((sum, b) => sum + b.totalAmount, 0);
        setStats({
          totalEarnings,
          count: completed.length,
          rating: workerProfile.rating
        });
      } catch (err) {
        console.error('Error fetching work history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoryData();
  }, [user.id]);

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Historical Logs</span>
        <h1 className="display-6">Work History & Reviews</h1>
        <p className="text-muted">Review past completed tasks, platform payouts, and customer rating logs</p>
      </div>

      {/* Analytics widgets */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase">Cumulative Payouts</span>
              <h3 className="fs-2 mb-0 mt-1">${stats.totalEarnings}</h3>
            </div>
            <div className="dashboard-stat-icon bg-success bg-opacity-20 text-success">
              <i className="bi bi-piggy-bank"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase">Completed Projects</span>
              <h3 className="fs-2 mb-0 mt-1">{stats.count}</h3>
            </div>
            <div className="dashboard-stat-icon bg-info bg-opacity-20 text-info">
              <i className="bi bi-journal-check"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-stat-card glass-card border-0">
            <div>
              <span className="text-muted small text-uppercase">Average Rating</span>
              <h3 className="fs-2 mb-0 mt-1">
                {stats.rating > 0 ? `${stats.rating}★` : 'New'}
              </h3>
            </div>
            <div className="dashboard-stat-icon bg-warning bg-opacity-20 text-warning">
              <i className="bi bi-star"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Completed list */}
        <div className="col-lg-7">
          <div className="card glass-card border-0 p-4 h-100">
            <h4 className="text-white mb-4">Completed Bookings</h4>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : completedBookings.length === 0 ? (
              <div className="text-center py-5 text-muted small">
                No completed jobs in your platform history yet.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3.5">
                {completedBookings.map((booking) => (
                  <div key={booking.id} className="p-3 bg-slate-900 bg-opacity-20 border border-secondary border-opacity-10 rounded-3 animate-fade-in">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="text-white mb-0">{booking.service}</h6>
                        <span className="text-muted small">Client: {booking.customerName}</span>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2.5 py-0.5 small">
                        Job Done
                      </span>
                    </div>
                    <p className="text-muted small mb-2">{booking.description}</p>
                    <div className="d-flex justify-content-between align-items-center text-muted small border-top border-secondary border-opacity-10 pt-2">
                      <span><i className="bi bi-calendar3 me-1.5 text-info"></i>{booking.date}</span>
                      <span className="text-white fw-bold">${booking.totalAmount} ({booking.hours} hrs)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews list */}
        <div className="col-lg-5">
          <div className="card glass-card border-0 p-4 h-100">
            <h4 className="text-white mb-4">Client Feedback Logs</h4>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-5 text-muted small">
                No feedback reviews logged in the system yet.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3.5">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-900 bg-opacity-20 border border-secondary border-opacity-10 rounded-3 animate-fade-in">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="fw-semibold text-white small d-block">{rev.customerName}</span>
                        <div className="star-rating small">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`bi ${i < rev.rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}></i>
                          ))}
                        </div>
                      </div>
                      <span className="text-muted small">{rev.date}</span>
                    </div>
                    <p className="text-muted small mb-0 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkHistory;
