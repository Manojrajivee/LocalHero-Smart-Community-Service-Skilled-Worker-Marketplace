import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../App';
import BookingForm from '../../components/BookingForm';

function BookService() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const data = await api.workers.getById(id);
        if (!data.verified) {
          throw new Error('This worker is currently not accepting bookings.');
        }
        setWorker(data);
      } catch (err) {
        setError(err.message || 'Could not retrieve worker details.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  const handleBookingSubmit = async (bookingData) => {
    setIsSubmitting(true);
    try {
      const newBooking = await api.bookings.create({
        workerId: worker.id,
        workerName: worker.name,
        service: bookingData.service,
        description: bookingData.description,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes,
        hours: bookingData.hours,
        totalAmount: bookingData.hours * worker.hourlyRate
      });
      setBookingSuccess(newBooking);
    } catch (err) {
      setError(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5 text-white">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !bookingSuccess) {
    return (
      <div className="alert alert-danger text-center border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-4 my-4 max-w-lg mx-auto">
        <i className="bi bi-exclamation-triangle-fill fs-2 mb-2 d-block"></i>
        <h4>Booking Denied</h4>
        <p className="small mb-3">{error}</p>
        <Link to="/customer/search" className="btn btn-outline-danger btn-sm">
          Return to search
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-9">
          
          {!bookingSuccess ? (
            <div className="card glass-card border-0 p-4">
              <div className="mb-4 d-flex align-items-center justify-content-between">
                <h3 className="text-white mb-0">Book Service</h3>
                <Link to={`/customer/worker/${worker.id}`} className="text-info text-decoration-none small">
                  Cancel
                </Link>
              </div>

              {/* Quick Worker Profile Preview */}
              <div className="p-3 bg-slate-900 bg-opacity-40 border border-secondary border-opacity-25 rounded-3 mb-4 d-flex align-items-center gap-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                  style={{ width: '48px', height: '48px', backgroundColor: '#6366f1', fontSize: '1.1rem' }}
                >
                  {worker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h6 className="text-white mb-0">{worker.name}</h6>
                  <span className="text-muted small">
                    Hourly rate: ${worker.hourlyRate}/hr • Rating: {worker.rating > 0 ? `${worker.rating}★` : 'New'}
                  </span>
                </div>
              </div>

              <BookingForm 
                worker={worker} 
                onSubmit={handleBookingSubmit} 
                isSubmitting={isSubmitting} 
              />
            </div>
          ) : (
            <div className="card glass-card border-0 p-5 text-center animate-fade-in">
              <div className="fs-1 text-success mb-3 animate-bounce">
                <i className="bi bi-calendar2-check-fill"></i>
              </div>
              <h2 className="text-white">Booking Request Placed!</h2>
              <p className="lead text-muted mt-3">
                Your request has been sent to <strong>{worker.name}</strong>.
              </p>

              <div className="my-4 p-4 bg-slate-900 bg-opacity-40 border border-secondary border-opacity-25 rounded-3 text-start small">
                <span className="fw-semibold text-info d-block mb-3">Booking Details Summary:</span>
                <ul className="list-unstyled text-muted mb-0 d-flex flex-column gap-2.5">
                  <li className="d-flex justify-content-between">
                    <span>Booking ID:</span>
                    <span className="text-white fw-mono">{bookingSuccess.id}</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Service:</span>
                    <span className="text-white">{bookingSuccess.service}</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Scheduled:</span>
                    <span className="text-white">{bookingSuccess.date} at {bookingSuccess.time}</span>
                  </li>
                  <li className="d-flex justify-content-between border-top border-secondary border-opacity-25 pt-2.5">
                    <span>Estimated Cost:</span>
                    <span className="text-white fw-bold">${bookingSuccess.totalAmount} ({bookingSuccess.hours} hrs)</span>
                  </li>
                </ul>
              </div>

              <p className="text-muted small mb-4">
                The worker can accept or reject this appointment request. You will see booking status updates on your bookings dashboard.
              </p>

              <div className="d-flex gap-3 justify-content-center">
                <Link to="/customer/bookings" className="btn btn-gradient-primary">
                  Go to My Bookings
                </Link>
                <Link to="/customer/dashboard" className="btn btn-glass">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default BookService;
