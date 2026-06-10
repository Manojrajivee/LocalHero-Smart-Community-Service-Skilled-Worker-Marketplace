import React, { useState, useEffect } from 'react';
import { getCustomerBookings, submitReview } from '../../services/api';
import { useAuth } from '../../App';
import ReviewForm from '../../components/ReviewForm';

function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getCustomerBookings();
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

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewSuccess('');
  };

  const handleReviewSubmit = async (reviewData) => {
    setIsSubmittingReview(true);
    try {
      await submitReview({
        bookingId: selectedBooking.id,
        workerId: selectedBooking.workerId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      setReviewSuccess('Your review has been submitted successfully! Thank you.');
      const updatedBookings = bookings.map(b =>
        b.id === selectedBooking.id ? { ...b, reviewed: true } : b
      );
      setBookings(updatedBookings);
      applyFilter(updatedBookings, activeFilter);
      setTimeout(() => { setSelectedBooking(null); setReviewSuccess(''); }, 2000);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Booking Audit</span>
        <h1 className="display-6">My Service Bookings</h1>
        <p className="text-muted">Monitor scheduling statuses, review worker responses, and leave feedback</p>
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

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-5 border border-secondary border-opacity-10 rounded-3 bg-dark bg-opacity-10">
          <i className="bi bi-calendar-x fs-1 text-muted"></i>
          <h5 className="text-muted mt-3">No bookings found</h5>
          <p className="text-muted small">No bookings match the filter "{activeFilter}".</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="col-12 animate-fade-in">
              <div className="card glass-card border-0 p-4">
                <div className="row g-3 align-items-center">
                  
                  {/* Left block: details */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge-status-${booking.status?.toLowerCase()}`}>
                        {booking.status}
                      </span>
                      <span className="text-muted small">Booking Ref: #{booking.id}</span>
                    </div>
                    <h5 className="text-white mt-2 mb-1">{booking.service}</h5>
                    <p className="text-muted small mb-2">{booking.description}</p>
                    <div className="text-info small fw-semibold">
                      Worker Assigned: {booking.workerName}
                    </div>
                  </div>

                  {/* Middle block: dates & prices */}
                  <div className="col-md-4 col-sm-8">
                    <div className="mb-2">
                      <span className="text-muted small d-block">Schedule Date:</span>
                      <span className="text-white small">
                        <i className="bi bi-calendar3 me-2 text-info"></i>{booking.date} at {booking.time}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted small d-block">Calculation:</span>
                      <span className="text-white small fw-bold">
                        <i className="bi bi-currency-dollar me-1 text-info"></i>{booking.totalAmount}
                      </span>
                      <span className="text-muted small"> ({booking.hours} hrs @ ${booking.totalAmount / booking.hours}/hr)</span>
                    </div>
                    {booking.notes && (
                      <div className="mt-2 text-muted small italic">
                        <span className="text-white small">Note:</span> "{booking.notes}"
                      </div>
                    )}
                  </div>

                  {/* Right block: actions */}
                  <div className="col-md-2 col-sm-4 text-sm-end">
                    {booking.status === 'COMPLETED' && !booking.reviewed && (
                      <button
                        className="btn btn-gradient-secondary btn-sm w-100 py-2"
                        data-bs-toggle="modal"
                        data-bs-target="#reviewModal"
                        onClick={() => openReviewModal(booking)}
                      >
                        Leave Review
                      </button>
                    )}
                    {booking.status === 'COMPLETED' && booking.reviewed && (
                      <span className="text-muted small d-block"><i className="bi bi-check2-circle text-success me-1"></i>Reviewed</span>
                    )}
                    {booking.status === 'PENDING' && (
                      <span className="text-muted small">Awaiting worker acceptance...</span>
                    )}
                    {booking.status === 'ACCEPTED' && (
                      <span className="text-info small">Service active / scheduled</span>
                    )}
                    {booking.status === 'REJECTED' && (
                      <span className="text-danger small">Declined by provider</span>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bootstrap Review Modal */}
      <div 
        className="modal fade" 
        id="reviewModal" 
        tabIndex="-1" 
        aria-labelledby="reviewModalLabel" 
        aria-hidden="true"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-slate-900 border border-secondary border-opacity-25" style={{ borderRadius: '16px' }}>
            <div className="modal-header border-bottom border-secondary border-opacity-25">
              <h5 className="modal-title text-white" id="reviewModalLabel">
                {selectedBooking ? `Review: ${selectedBooking.workerName}` : 'Submit Review'}
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              {reviewSuccess ? (
                <div className="text-center py-3">
                  <i className="bi bi-check-circle-fill text-success fs-1 animate-fade-in"></i>
                  <p className="text-white mt-2 small">{reviewSuccess}</p>
                </div>
              ) : selectedBooking ? (
                <ReviewForm 
                  onSubmit={handleReviewSubmit} 
                  isSubmitting={isSubmittingReview} 
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default MyBookings;
