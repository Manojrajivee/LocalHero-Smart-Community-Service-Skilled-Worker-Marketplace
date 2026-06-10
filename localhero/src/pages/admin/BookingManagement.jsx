import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../../services/api';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchBookingsList = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      // Sort bookings (newest first based on ID or date)
      const sorted = [...data].sort((a, b) => b.id.localeCompare(a.id));
      setBookings(sorted);
      applyFilter(sorted, activeFilter);
    } catch (err) {
      console.error('Error fetching admin bookings audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsList();
  }, []);

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

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Platform Auditing</span>
        <h1 className="display-6">Global Booking Registry</h1>
        <p className="text-muted">Monitor scheduling statuses, audit user agreements, and trace system payments</p>
      </div>

      {/* Filter Tabs */}
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

      {/* Main logs table */}
      <div className="card glass-card border-0 p-4">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-5 text-muted small">
            No booking requests logged in this category.
          </div>
        ) : (
          <div className="table-responsive animate-fade-in">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Profile</th>
                  <th>Worker Profile</th>
                  <th>Service Task</th>
                  <th>Date & Time</th>
                  <th>Estimated Price</th>
                  <th className="text-end">Current Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="fw-mono text-muted">#{b.id}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-white">{b.customerName}</div>
                      <div className="small text-muted">ID: {b.customerId}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-white">{b.workerName}</div>
                      <div className="small text-muted">ID: {b.workerId}</div>
                    </td>
                    <td>
                      <div className="text-white">{b.service}</div>
                      <div className="small text-muted">{(b.description || '').substring(0, 40)}...</div>
                    </td>
                    <td>
                      <div className="small text-white">{b.date}</div>
                      <div className="small text-muted">{b.time}</div>
                    </td>
                    <td>
                      <div className="fw-bold text-white">${b.totalAmount}</div>
                      <div className="small text-muted">{b.hours} hrs @ ${b.totalAmount / b.hours}/hr</div>
                    </td>
                    <td className="text-end">
                      <span className={`badge-status-${b.status?.toLowerCase()}`}>
                        {b.status}
                      </span>
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

export default BookingManagement;
