import React from 'react';

function ServiceCard({ title, icon, description, startPrice, onClick }) {
  return (
    <div 
      className="card glass-card h-100 border-0 text-center p-3 animate-fade-in cursor-pointer"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body d-flex flex-column align-items-center">
        <div 
          className="rounded-3 d-flex align-items-center justify-content-center text-white mb-3"
          style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <i className={`bi ${icon} fs-2 text-info`}></i>
        </div>
        <h5 className="card-title text-white mb-2">{title}</h5>
        <p className="card-text text-muted small flex-grow-1">{description}</p>
        <div className="mt-3">
          <span className="text-muted small">Starting from</span>
          <div className="fw-bold text-white">${startPrice}/hr</div>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
