import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../App';
import { AVAILABLE_SKILLS } from '../../components/RegistrationForm';

function ManageProfile() {
  const { user, updateProfile } = useAuth();
  
  const [workerProfile, setWorkerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  
  // Worker-specific
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(25);
  const [description, setDescription] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const profile = await api.workers.getByUserId(user.id);
        setWorkerProfile(profile);
        setSelectedSkills(profile.skills);
        setHourlyRate(profile.hourlyRate);
        setDescription(profile.description);
        setLicenseNumber(profile.licenseNumber);
      } catch (err) {
        console.error('Error fetching worker profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerData();
  }, [user.id]);

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !address || selectedSkills.length === 0 || !hourlyRate) {
      setErrorMsg('Please complete all form fields and check at least one skill.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const workerDetails = {
        skills: selectedSkills,
        hourlyRate: Number(hourlyRate),
        description,
        licenseNumber
      };
      
      await updateProfile(name, phone, address, workerDetails);
      setSuccessMsg('Worker profile settings have been updated successfully.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Worker profile update failed.');
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

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Profile Audit</span>
        <h1 className="display-6">Manage Professional Profile</h1>
        <p className="text-muted">Configure your marketplace settings, skills, hourly rate, and bio</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
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
              {/* Account Level Profile */}
              <h5 className="text-white border-bottom border-secondary border-opacity-25 pb-2 mb-3 small text-uppercase tracking-wider">Account Contact Info</h5>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white small">Display Name</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white small">Phone Number</label>
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
                <label className="form-label text-white small">Service Base Address</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Professional Profile */}
              <h5 className="text-white border-bottom border-secondary border-opacity-25 pb-2 mb-3 mt-4 small text-uppercase tracking-wider">Workplace Listing Details</h5>

              <div className="mb-4">
                <label className="form-label text-white small d-block">Select Your Skills</label>
                <div className="row g-2">
                  {AVAILABLE_SKILLS.map((skill, index) => (
                    <div key={index} className="col-sm-6 col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`skill-${index}`}
                          checked={selectedSkills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          disabled={isSubmitting}
                        />
                        <label className="form-check-label text-muted small" htmlFor={`skill-${index}`}>
                          {skill}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white small">Hourly Billing Rate ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-custom"
                    min={10}
                    max={150}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white small">License / Certification ID</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-white small">Professional Bio / Description</label>
                <textarea
                  className="form-control form-control-custom"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-gradient-primary w-100 py-2.5 mt-3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Profile...
                  </>
                ) : (
                  'Update Worker Profile'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageProfile;
