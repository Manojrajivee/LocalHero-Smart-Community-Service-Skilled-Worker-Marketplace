import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../App';

const POPULAR_SERVICES = [
  { title: 'Plumbing', icon: 'bi-tools', description: 'Fix leaks, install faucets, clear drains, and repair water heaters.', price: '40' },
  { title: 'Electrical', icon: 'bi-lightning-charge-fill', description: 'Outlet updates, ceiling fans, smart home wiring, and panel repairs.', price: '45' },
  { title: 'Cleaning', icon: 'bi-brush-fill', description: 'House cleaning, deep sanitization, moving cleanups, and housekeeping.', price: '20' },
  { title: 'Gardening', icon: 'bi-flower1', description: 'Lawn mowing, hedge trimming, weeding, and landscape upkeep.', price: '25' },
  { title: 'Furniture Assembly', icon: 'bi-hammer', description: 'Flat-pack assembly, shelf mounting, cabinet setups, and bed frames.', price: '30' },
  { title: 'Painting', icon: 'bi-paint-bucket', description: 'Interior walls, trim work, door painting, and quick patch-ups.', price: '35' }
];

function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (user) {
      navigate(`/customer/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/login?redirect=/customer/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryTitle) => {
    if (user) {
      navigate(`/customer/search?skill=${encodeURIComponent(categoryTitle)}`);
    } else {
      navigate(`/login?redirect=/customer/search?skill=${encodeURIComponent(categoryTitle)}`);
    }
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      {/* Hero Section */}
      <section className="bg-hero-image py-5 px-4 md:px-5 mb-5 rounded-4 overflow-hidden" style={{ minHeight: '400px', display: 'flex', alignItems: 'center' }}>
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <h1 className="display-4 fw-extrabold mb-3">
              Your Friendly Neighborhood <br />
              <span className="text-info">Local Hero</span> is Here.
            </h1>
            <p className="lead text-light mb-4">
              Instantly find and book trusted, verified local service professionals for plumbing, electrical, cleaning, and more. Transparent pricing, reliable support.
            </p>
            
            <form onSubmit={handleSearchSubmit} className="d-flex flex-column flex-sm-row gap-2 max-w-lg mb-2">
              <div className="input-group flex-grow-1">
                <span className="input-group-text bg-slate-900 border-secondary border-opacity-25 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-custom py-3"
                  placeholder="What service do you need today? (e.g. plumber)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-gradient-primary px-4 py-3 text-nowrap">
                Find Helpers
              </button>
            </form>
            <div className="text-muted small">
              Popular: Plumbing, Electrical, Cleaning
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mb-5">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Explore Services</span>
          <h2 className="fs-1">Popular Service Categories</h2>
          <p className="text-muted max-w-xl mx-auto">
            Choose from our highly requested categories of local services. Click any category to search our verified list.
          </p>
        </div>

        <div className="row g-4">
          {POPULAR_SERVICES.map((srv, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <ServiceCard
                title={srv.title}
                icon={srv.icon}
                description={srv.description}
                startPrice={srv.price}
                onClick={() => handleCategoryClick(srv.title)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-5 mb-5 rounded-4 bg-slate-800 bg-opacity-40 border border-secondary border-opacity-25 px-4 px-md-5">
        <div className="text-center mb-5">
          <h2 className="fs-1">How Local Hero Works</h2>
          <p className="text-muted">Booking service professionals in your area has never been this straightforward.</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4 text-center">
            <div className="fs-1 text-info mb-3">
              <i className="bi bi-search-heart"></i>
            </div>
            <h5 className="text-white">1. Search Workers</h5>
            <p className="text-muted small">
              Browse through local service workers, filtering by category, ratings, distance, and hourly rate.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <div className="fs-1 text-info mb-3">
              <i className="bi bi-calendar2-check-fill"></i>
            </div>
            <h5 className="text-white">2. Book in Seconds</h5>
            <p className="text-muted small">
              Select date, time, and service details. Your selected worker will receive the booking request instantly.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <div className="fs-1 text-info mb-3">
              <i className="bi bi-hand-thumbs-up-fill"></i>
            </div>
            <h5 className="text-white">3. Job Done & Review</h5>
            <p className="text-muted small">
              After work is completed, pay securely and leave a review to share your feedback with the community.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-5">
        <div className="text-center mb-5">
          <h2 className="fs-1">What Our Customers Say</h2>
          <p className="text-muted">Read feedback left by other customers who found their local heroes.</p>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card glass-card h-100 border-0">
              <div className="card-body">
                <div className="star-rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-muted small mb-3">
                  "I had a plumbing emergency on Saturday night. I signed up, found John Smith, and booked him. He arrived within 45 minutes and fixed the leak. Life saver!"
                </p>
                <div className="fw-semibold text-white small">Jane Doe, Customer</div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-4">
            <div className="card glass-card h-100 border-0">
              <div className="card-body">
                <div className="star-rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-muted small mb-3">
                  "Alice Green updated our circuit breaker panel and rewired our living room lamps. Very professional, tidy, and clean. Pricing estimate was spot on."
                </p>
                <div className="fw-semibold text-white small">Sarah Connor, Customer</div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card glass-card h-100 border-0">
              <div className="card-body">
                <div className="star-rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-muted small mb-3">
                  "As a retired senior, finding reliable help is tough. This portal allows me to see review logs and licenses before inviting anyone in. Highly recommended."
                </p>
                <div className="fw-semibold text-white small">Albert Einstein, Customer</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
