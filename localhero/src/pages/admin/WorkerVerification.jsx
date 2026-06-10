import React, { useState, useEffect } from 'react';
import { getAllWorkersAdmin, toggleVerifyWorker } from '../../services/api';

function WorkerVerification() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUnverifiedWorkers = async () => {
    setLoading(true);
    try {
      const data = await getAllWorkersAdmin();
      setWorkers(data.filter((w) => !w.verified));
    } catch (err) {
      console.error('Error fetching unverified workers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUnverifiedWorkers(); }, []);

  const handleApprove = async (workerId, name) => {
    setSuccessMsg('');
    try {
      await toggleVerifyWorker(workerId);
      setSuccessMsg(`Worker account for "${name}" has been verified and is now active.`);
      await fetchUnverifiedWorkers();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Error verifying worker:', err);
    }
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Credentials Audits</span>
        <h1 className="display-6">Worker Profile Verification</h1>
        <p className="text-muted">Review professional licenses, skills declarations, and activate worker marketplace listings</p>
      </div>

      {successMsg && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 small p-3 mb-4 d-flex align-items-center gap-2 animate-fade-in">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>{successMsg}</div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card glass-card border-0 p-4">
            <h4 className="text-white mb-4">Verification Queue ({workers.length})</h4>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-info" role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            ) : workers.length === 0 ? (
              <div className="text-center py-5 text-muted small">
                <i className="bi bi-shield-check fs-1 text-success d-block mb-3"></i>
                No worker verification requests pending. All provider listings are active!
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {workers.map((w) => (
                  <div key={w.id} className="p-4 bg-slate-900 bg-opacity-30 border border-secondary border-opacity-10 rounded-3 animate-fade-in">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h5 className="text-white mb-0">{w.user?.name || 'Unknown'}</h5>
                          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-2 py-1 small">
                            Awaiting Credentials Audit
                          </span>
                        </div>
                        <p className="text-muted small mb-2">Email: <code>{w.user?.email}</code></p>
                        <p className="text-muted small mb-3">{w.description}</p>
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                          <span className="text-muted small">Declared Skills:</span>
                          {(w.skills || '').split(',').filter(Boolean).map((s, idx) => (
                            <span key={idx} className="badge bg-secondary bg-opacity-20 text-white rounded-pill px-2 py-1 small">{s.trim()}</span>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-4 border-start border-secondary border-opacity-10 ps-md-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="mb-2">
                            <span className="text-muted small d-block">License Number:</span>
                            <span className="text-info small">{w.licenseNumber || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted small d-block">Requested Rate:</span>
                            <span className="text-white fw-bold small">${w.hourlyRate}/hr</span>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-4 mt-md-0">
                          <button
                            onClick={() => handleApprove(w.id, w.user?.name)}
                            className="btn btn-gradient-secondary btn-sm flex-grow-1 py-2"
                          >
                            Approve Listing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerVerification;
