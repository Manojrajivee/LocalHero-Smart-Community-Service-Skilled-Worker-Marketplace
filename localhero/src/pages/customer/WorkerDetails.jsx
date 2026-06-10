import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

function WorkerDetails() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        const data = await api.workers.getById(id);
        setWorker(data);
      } catch (err) {
        setError(err.message || 'Worker profile could not be retrieved.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5 text-white">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="alert alert-danger text-center border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-4 my-4">
        <i className="bi bi-exclamation-triangle-fill fs-2 mb-2 d-block"></i>
        <h4>Profile Not Found</h4>
        <p className="small mb-3">{error || 'This worker profile does not exist.'}</p>
        <Link to="/customer/search" className="btn btn-outline-danger btn-sm">
          Return to Searches
        </Link>
      </div>
    );
  }

  const initials = worker.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="mb-4">
        <Link to="/customer/search" className="text-info text-decoration-none small">
          <i className="bi bi-arrow-left me-1"></i> Back to search directories
        </Link>
      </div>

      <div className="row g-4">
        {/* Main Details Panel */}
        <div className="col-lg-8">
          <div className="card glass-card border-0 p-4 mb-4">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mb-4 text-center text-sm-start">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow"
                style={{ width: '88px', height: '88px', fontSize: '2rem', backgroundColor: '#6366f1' }}
              >
                {initials}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex flex-column flex-sm-row align-items-center gap-2.5 justify-content-center justify-content-sm-start">
                  <h2 className="text-white mb-0">{worker.name}</h2>
                  {worker.verified ? (
                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-2.5 py-1 small">
                      <i className="bi bi-patch-check-fill me-1"></i>Verified Hero
                    </span>
                  ) : (
                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-2.5 py-1 small">
                      <i className="bi bi-hourglass-split me-1"></i>Pending Verification
                    </span>
                  )}
                </div>
                
                <div className="d-flex align-items-center gap-2 mt-2 justify-content-center justify-content-sm-start text-muted small">
                  <span className="star-rating fs-6">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    <span className="fw-semibold text-white">{worker.rating > 0 ? worker.rating : 'New'}</span>
                  </span>
                  <span>•</span>
                  <span>{worker.reviewsCount} reviews</span>
                  <span>•</span>
                  <span><i className="bi bi-geo-alt me-1 text-info"></i>Metropolis</span>
                </div>
              </div>
            </div>

            <h5 className="text-white border-bottom border-secondary border-opacity-25 pb-2 mb-3">About Me</h5>
            <p className="text-muted leading-relaxed mb-4">
              {worker.description || 'This worker has not provided a description bio yet.'}
            </p>

            <h5 className="text-white border-bottom border-secondary border-opacity-25 pb-2 mb-3">Skills & Services</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {worker.skills.map((skill, idx) => (
                <span key={idx} className="badge bg-secondary bg-opacity-25 text-white fs-6 py-2 px-3 rounded-3">
                  {skill}
                </span>
              ))}
            </div>

            <h5 className="text-white border-bottom border-secondary border-opacity-25 pb-2 mb-3">Contact Support Details</h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="p-3 bg-slate-900 bg-opacity-30 border border-secondary border-opacity-10 rounded-3 d-flex align-items-center gap-3">
                  <div className="fs-4 text-info"><i className="bi bi-telephone"></i></div>
                  <div>
                    <span className="text-muted small d-block">Phone Number</span>
                    <span className="text-white small">{worker.phone || '+1 (555) 012-3456'}</span>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="p-3 bg-slate-900 bg-opacity-30 border border-secondary border-opacity-10 rounded-3 d-flex align-items-center gap-3">
                  <div className="fs-4 text-info"><i className="bi bi-envelope"></i></div>
                  <div>
                    <span className="text-muted small d-block">Email Address</span>
                    <span className="text-white small">{worker.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Tab */}
          <div className="card glass-card border-0 p-4">
            <h4 className="text-white mb-4">Customer Reviews ({worker.reviews.length})</h4>

            {worker.reviews.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                No review logs submitted for this worker profile yet.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3.5">
                {worker.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-900 bg-opacity-20 border border-secondary border-opacity-10 rounded-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="fw-semibold text-white d-block">{rev.customerName}</span>
                        <div className="star-rating small mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`bi ${i < Math.floor(rev.rating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}></i>
                          ))}
                        </div>
                      </div>
                      <span className="text-muted small">{rev.date}</span>
                    </div>
                    <p className="text-muted small mb-0">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Booking CTA Panel */}
        <div className="col-lg-4">
          <div className="card glass-card border-0 p-4 sticky-top text-center" style={{ top: '100px', zIndex: 10 }}>
            <span className="text-muted small text-uppercase">Service Rate</span>
            <div className="display-5 fw-bold text-white mb-1">
              ${worker.hourlyRate}<span className="text-muted fs-4 fw-normal">/hr</span>
            </div>
            <p className="text-muted small mb-4">Estimates calculated by hour, payment due upon job completion.</p>
            
            {worker.verified ? (
              <Link to={`/customer/book/${worker.id}`} className="btn btn-gradient-primary w-100 py-3 mb-2.5">
                <i className="bi bi-calendar-check me-2"></i>Book Service Call
              </Link>
            ) : (
              <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning rounded-3 small p-2 text-start">
                <i className="bi bi-exclamation-circle-fill me-1"></i> This worker is pending admin approval and cannot be booked at this time.
              </div>
            )}
            
            <hr className="my-3 border-secondary opacity-25" />
            
            <div className="text-start">
              <span className="fw-semibold text-white d-block small mb-2"><i className="bi bi-shield-check text-info me-1"></i>Local Hero Assurance:</span>
              <ul className="list-unstyled text-muted small ps-0 mb-0 d-flex flex-column gap-1.5">
                <li><i className="bi bi-check text-success me-1"></i> Verified certificates and identity</li>
                <li><i className="bi bi-check text-success me-1"></i> Review reports from verified tasks</li>
                <li><i className="bi bi-check text-success me-1"></i> Free cancellation 24h prior</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerDetails;
