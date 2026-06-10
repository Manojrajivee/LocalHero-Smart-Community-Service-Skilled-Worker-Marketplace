import React from 'react';

function About() {
  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Our Story</span>
        <h1 className="display-5">About Local Hero</h1>
        <p className="text-muted max-w-xl mx-auto">
          We bridge the gap between local service specialists and residents who need reliable home assistance.
        </p>
      </div>

      <div className="row g-4 align-items-center mb-5">
        <div className="col-lg-6">
          <h2 className="mb-3">Our Mission & Purpose</h2>
          <p className="text-muted">
            Founded in 2026, Local Hero was built with a simple goal: to make finding trusted, local help safe and immediate. We believe that professional, skilled work deserves fair compensation, and home maintenance shouldn't be stressful.
          </p>
          <p className="text-muted">
            Every service worker on our platform goes through a credential verification process. We ensure credentials, professional skills, and identities are confirmed before workers can accept jobs on the platform.
          </p>
          
          <div className="row g-3 mt-2">
            <div className="col-sm-6">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-info fs-5"></i>
                <span className="fw-semibold">100% Verified Workers</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-info fs-5"></i>
                <span className="fw-semibold">Transparent Rates</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-info fs-5"></i>
                <span className="fw-semibold">Secure Bookings</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-info fs-5"></i>
                <span className="fw-semibold">Community Driven reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card glass-card border-0 p-4">
            <div className="row g-4 text-center">
              <div className="col-6 py-3 border-end border-bottom border-secondary border-opacity-25">
                <div className="fs-1 fw-bold text-info">2.5k+</div>
                <div className="text-muted small">Registered Customers</div>
              </div>
              <div className="col-6 py-3 border-bottom border-secondary border-opacity-25">
                <div className="fs-1 fw-bold text-info">150+</div>
                <div className="text-muted small">Verified Service Heroes</div>
              </div>
              <div className="col-6 py-3 border-end border-secondary border-opacity-25">
                <div className="fs-1 fw-bold text-info">10k+</div>
                <div className="text-muted small">Bookings Completed</div>
              </div>
              <div className="col-6 py-3">
                <div className="fs-1 fw-bold text-info">4.8★</div>
                <div className="text-muted small">Average Service Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-5 py-5 rounded-4 bg-slate-800 bg-opacity-40 border border-secondary border-opacity-25 px-4 px-md-5">
        <h3 className="text-center mb-4">Our Core Values</h3>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 bg-transparent border-0">
              <h5 className="text-white mb-2"><i className="bi bi-shield-check text-info me-2"></i>Trust & Safety</h5>
              <p className="text-muted small mb-0">
                Safety is our highest priority. We double-check worker licenses and verify identity docs so you can book with confidence.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 bg-transparent border-0">
              <h5 className="text-white mb-2"><i className="bi bi-currency-dollar text-info me-2"></i>Fair Compensation</h5>
              <p className="text-muted small mb-0">
                Workers set their own rates and keep 100% of their earnings. We believe in building sustainable local careers.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 bg-transparent border-0">
              <h5 className="text-white mb-2"><i className="bi bi-people-fill text-info me-2"></i>Community Support</h5>
              <p className="text-muted small mb-0">
                We support neighbors helping neighbors. Our local support team is always available to resolve disputes and answer queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-center mb-4">Meet the Leadership</h3>
        <div className="row g-4 text-center justify-content-center">
          <div className="col-lg-3 col-md-6">
            <div className="card glass-card border-0">
              <div className="rounded-circle bg-info bg-opacity-20 d-flex align-items-center justify-content-center mx-auto mb-3 text-info fw-bold" style={{ width: '80px', height: '80px', fontSize: '1.8rem' }}>
                MK
              </div>
              <h6 className="text-white mb-1">Manoj Kumar</h6>
              <p className="text-muted small mb-0">Founder & CEO</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card glass-card border-0">
              <div className="rounded-circle bg-info bg-opacity-20 d-flex align-items-center justify-content-center mx-auto mb-3 text-info fw-bold" style={{ width: '80px', height: '80px', fontSize: '1.8rem' }}>
                JS
              </div>
              <h6 className="text-white mb-1">Jane Smith</h6>
              <p className="text-muted small mb-0">Chief of Operations</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card glass-card border-0">
              <div className="rounded-circle bg-info bg-opacity-20 d-flex align-items-center justify-content-center mx-auto mb-3 text-info fw-bold" style={{ width: '80px', height: '80px', fontSize: '1.8rem' }}>
                DB
              </div>
              <h6 className="text-white mb-1">David Brown</h6>
              <p className="text-muted small mb-0">Lead Tech Architect</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
