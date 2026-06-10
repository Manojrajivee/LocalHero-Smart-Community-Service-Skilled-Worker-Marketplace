import React, { useState, useEffect } from 'react';
import { getWorkerBookings, updateBookingStatus } from '../../services/api';
import { useAuth } from '../../App';

function ViewBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getWorkerBookings();
      // Sort bookings (newest first based on ID or date)
      const sorted = [...data].sort((a, b) => b.id.localeCompare(a.id));
      setBookings(sorted);
      applyFilter(sorted, activeFilter);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user.id]);

  const applyFilter = (data, filter) => {
    if (filter === 'all') {
      setFilteredBookings(data);
    } else {
      setFilteredBookings(data.filter((b) => b.status === filter));
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilter(bookings, filter);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      await fetchBookings();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Job Board</span>
        <h1 className="display-6">Incoming Job Requests</h1>
        <p className="text-muted">Manage active scheduling, accept client requests, and update project stages</p>
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {['all', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleFilterChange(tab)}
            className={`btn btn-sm text-capitalize ${
              activeFilter === tab ? 'btn-gradient-primary' : 'btn-glass text-muted'
            }`}
            style={{ borderRadius: '20px', padding: '0.45rem 1.2rem' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-5 border border-secondary border-opacity-10 rounded-3 bg-dark bg-opacity-10 text-muted small">
          No job bookings match the filter "{activeFilter}".
        </div>
      ) : (
        <div className="row g-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="col-12 animate-fade-in">
              <div className="card glass-card border-0 p-4">
                <div className="row g-3 align-items-center">
                  
                  {/* Left Column: Client & Task details */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge-status-${booking.status?.toLowerCase()}`}>
                        {booking.status}
                      </span>
                      <span className="text-muted small">Job ID: #{booking.id}</span>
                    </div>
                    <h5 className="text-white mt-2 mb-1">{booking.service}</h5>
                    <p className="text-muted small mb-2">{booking.description}</p>
                    <div className="text-info small fw-semibold">
                      Client: {booking.customerName}
                    </div>
                  </div>

                  {/* Middle Column: Schedule & Calculation */}
                  <div className="col-md-4 col-sm-8">
                    <div className="mb-2">
                      <span className="text-muted small d-block">Scheduled:</span>
                      <span className="text-white small">
                        <i className="bi bi-calendar3 me-2 text-info"></i>{booking.date} at {booking.time}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted small d-block">Payout Estimate:</span>
                      <span className="text-white small fw-bold">
                        <i className="bi bi-currency-dollar me-1 text-info"></i>{booking.totalAmount}
                      </span>
                      <span className="text-muted small"> ({booking.hours} hrs @ ${booking.totalAmount / booking.hours}/hr)</span>
                    </div>
                    {booking.notes && (
                      <div className="mt-2 text-muted small italic">
                        <span className="text-white small">Client instructions:</span> "{booking.notes}"
                      </div>
                    )}
                  </div>

                  {/* Right Column: Dynamic Action Buttons */}
                  <div className="col-md-2 col-sm-4 text-sm-end">
                    {booking.status === 'PENDING' && (
                      <div className="d-flex flex-column gap-2">
                        <button onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')} className="btn btn-gradient-secondary btn-sm py-2">Accept Job</button>
                        <button onClick={() => handleStatusUpdate(booking.id, 'REJECTED')} className="btn btn-glass btn-sm py-2 text-danger border-danger border-opacity-10">Decline</button>
                      </div>
                    )}
                    {booking.status === 'ACCEPTED' && (
                      <button onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')} className="btn btn-gradient-primary btn-sm w-100 py-2">Complete Job</button>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <span className="text-muted small d-block"><i className="bi bi-check-circle-fill text-success me-1"></i>Completed</span>
                    )}
                    {booking.status === 'REJECTED' && (
                      <span className="text-muted small d-block text-danger"><i className="bi bi-x-circle-fill me-1"></i>Declined</span>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewBookings;
