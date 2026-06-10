import React, { useState } from 'react';
import { useAuth } from '../../App';

function Profile() {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      setErrorMsg('Please fill in all profile fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await updateProfile(name, phone, address, null);
      setSuccessMsg('Your profile has been updated successfully.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Profile update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Account Settings</span>
        <h1 className="display-6">Your Profile</h1>
        <p className="text-muted">Manage your personal settings and service address</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card glass-card border-0 p-4">
            
            {successMsg && (
              <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 small p-3 mb-4 d-flex align-items-center gap-2 animate-fade-in">
                <i className="bi bi-check-circle-fill fs-5"></i>
                <div>{successMsg}</div>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 small p-3 mb-4 d-flex align-items-center gap-2 animate-fade-in">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <div>{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="text-start">
              <div className="mb-3">
                <label className="form-label text-white small">Account Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-slate-900 border-secondary border-opacity-25 text-muted">
                    <i className="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control form-control-custom"
                    value={user?.email}
                    disabled
                  />
                </div>
                <div className="form-text text-muted small">Registered email address cannot be changed.</div>
              </div>

              <div className="mb-3">
                <label className="form-label text-white small">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-slate-900 border-secondary border-opacity-25 text-muted">
                    <i className="bi bi-person-badge"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-white small">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-slate-900 border-secondary border-opacity-25 text-muted">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    type="tel"
                    className="form-control form-control-custom"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-white small">Service Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-slate-900 border-secondary border-opacity-25 text-muted">
                    <i className="bi bi-geo-alt"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-text text-muted small">This address is auto-filled on new service bookings.</div>
              </div>

              <button type="submit" className="btn btn-gradient-primary w-100 py-2.5" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
