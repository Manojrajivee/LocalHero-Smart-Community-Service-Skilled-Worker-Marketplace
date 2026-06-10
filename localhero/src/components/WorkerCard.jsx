import React from 'react';
import { Link } from 'react-router-dom';

function WorkerCard({ worker }) {
  // Generate random avatar background colors based on name length to look modern
  const avatarColors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
  const colorIndex = worker.name.length % avatarColors.length;
  const avatarBg = avatarColors[colorIndex];

  return (
    <div className="card glass-card h-100 border-0 animate-fade-in">
      <div className="card-body p-4 d-flex flex-column h-100">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow"
            style={{ width: '56px', height: '56px', fontSize: '1.3rem', backgroundColor: avatarBg }}
          >
            {worker.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h5 className="card-title mb-1 text-white d-flex align-items-center gap-2">
              {worker.name}
              {worker.verified && (
                <i className="bi bi-patch-check-fill text-info" title="Verified Worker"></i>
              )}
            </h5>
            <div className="d-flex align-items-center gap-2">
              <span className="star-rating">
                <i className="bi bi-star-fill text-warning me-1"></i>
                <span className="fw-semibold text-white">{worker.rating > 0 ? worker.rating : 'New'}</span>
              </span>
              <span className="text-muted">•</span>
              <span className="text-muted small">{worker.reviewsCount} {worker.reviewsCount === 1 ? 'review' : 'reviews'}</span>
            </div>
          </div>
        </div>

        {/* Skills badges */}
        <div className="d-flex flex-wrap gap-1.5 mb-3">
          {worker.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="badge bg-secondary bg-opacity-20 text-white rounded-pill px-2.5 py-1 small me-1">
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="badge bg-dark bg-opacity-40 text-muted rounded-pill px-2 py-1 small">
              +{worker.skills.length - 3}
            </span>
          )}
        </div>

        <p className="card-text text-muted small flex-grow-1 mb-3">
          {worker.description.length > 100
            ? `${worker.description.substring(0, 100)}...`
            : worker.description || 'No description provided.'}
        </p>

        <div className="border-top border-secondary border-opacity-25 pt-3 mt-auto d-flex align-items-center justify-content-between">
          <div>
            <span className="text-muted small block">Rate</span>
            <div className="fw-bold text-white fs-5">
              ${worker.hourlyRate}<span className="text-muted fw-normal fs-6">/hr</span>
            </div>
          </div>
          <Link to={`/customer/worker/${worker.id}`} className="btn btn-gradient-secondary btn-sm px-3 py-2">
            View Details <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
