import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import WorkerCard from '../../components/WorkerCard';
import { AVAILABLE_SKILLS } from '../../components/RegistrationForm';

function SearchWorkers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialSkill = searchParams.get('skill') || '';

  const [workers, setWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [sortOption, setSortOption] = useState('rating-desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const data = await api.workers.getAll(searchQuery, selectedSkill, verifiedOnly);
        
        // Apply sorting
        let sortedData = [...data];
        if (sortOption === 'rating-desc') {
          sortedData.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === 'rate-asc') {
          sortedData.sort((a, b) => a.hourlyRate - b.hourlyRate);
        } else if (sortOption === 'rate-desc') {
          sortedData.sort((a, b) => b.hourlyRate - a.hourlyRate);
        }

        setWorkers(sortedData);
      } catch (err) {
        console.error('Error fetching workers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [searchQuery, selectedSkill, verifiedOnly, sortOption]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('');
    setVerifiedOnly(true);
    setSortOption('rating-desc');
    setSearchParams({});
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Search Helpers</span>
        <h1 className="display-6">Find Local Service Workers</h1>
        <p className="text-muted">Browse, filter, and schedule verified service specialists in Metropolis</p>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="card glass-card border-0 p-4 sticky-top" style={{ top: '100px', zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white mb-0">Filters</h5>
              <button 
                onClick={handleClearFilters}
                className="btn btn-link text-info text-decoration-none p-0 small"
                style={{ fontSize: '0.85rem' }}
              >
                Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="mb-3.5">
              <label className="form-label text-muted small text-uppercase">Keyword Search</label>
              <div className="input-group">
                <span className="input-group-text bg-slate-900 border-secondary border-opacity-25 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  placeholder="Name or bio keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Skills filter */}
            <div className="mb-3.5">
              <label className="form-label text-muted small text-uppercase">Category</label>
              <select
                className="form-select form-control-custom"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                <option value="" className="bg-slate-900 text-white">All Service Types</option>
                {AVAILABLE_SKILLS.map((skill, idx) => (
                  <option key={idx} value={skill} className="bg-slate-900 text-white">
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort options */}
            <div className="mb-4">
              <label className="form-label text-muted small text-uppercase">Sort By</label>
              <select
                className="form-select form-control-custom"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="rating-desc" className="bg-slate-900 text-white">Highest Rated</option>
                <option value="rate-asc" className="bg-slate-900 text-white">Hourly Rate: Low to High</option>
                <option value="rate-desc" className="bg-slate-900 text-white">Hourly Rate: High to Low</option>
              </select>
            </div>

            {/* Verification status checkbox */}
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="verifiedSwitch"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <label className="form-check-label text-white small" htmlFor="verifiedSwitch">
                Verified Professionals Only
              </label>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
              Turn off to show newly registered, unverified workers pending verification review.
            </div>
          </div>
        </div>

        {/* Worker Cards Grid */}
        <div className="col-lg-9">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-5 border border-secondary border-opacity-10 rounded-3 bg-dark bg-opacity-10">
              <i className="bi bi-person-x-fill fs-1 text-muted"></i>
              <h5 className="text-muted mt-3">No matching workers found</h5>
              <p className="text-muted small">Try broadening your keyword queries or clearing category selections.</p>
              <button onClick={handleClearFilters} className="btn btn-outline-info btn-sm mt-2">
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {workers.map((worker) => (
                <div key={worker.id} className="col-md-6 col-xxl-4 animate-fade-in">
                  <WorkerCard worker={worker} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchWorkers;
