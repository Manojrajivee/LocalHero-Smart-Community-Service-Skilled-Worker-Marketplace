import React, { useState } from 'react';
import { useAuth } from '../App';

const AVAILABLE_SKILLS = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Gardening',
  'Furniture Assembly',
  'Painting',
  'Appliance Repair',
  'Carpentry'
];

function RegistrationForm({ onRegisterSuccess }) {
  const { register } = useAuth();
  
  const [role, setRole] = useState('customer'); // customer, worker
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Worker-specific fields
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(25);
  const [description, setDescription] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !address) {
      setError('Please fill in all core fields.');
      return;
    }

    if (role === 'worker' && selectedSkills.length === 0) {
      setError('Please select at least one skill.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        name, email, password,
        role: role.toUpperCase(),
        phone, address,
        ...(role === 'worker' ? {
          skills: selectedSkills.join(','),
          category: selectedSkills[0] || '',
          hourlyRate: Number(hourlyRate),
          description,
          licenseNumber,
          location: address,
          experience: ''
        } : {})
      };

      await register(payload);
      if (onRegisterSuccess) {
        onRegisterSuccess(role);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in text-start">
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 border-0 bg-danger bg-opacity-10 text-danger rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Role Selection */}
      <div className="mb-4">
        <label className="form-label text-white small d-block">Account Type</label>
        <div className="btn-group w-100" role="group">
          <input
            type="radio"
            className="btn-check"
            name="roleRadio"
            id="roleCustomer"
            checked={role === 'customer'}
            onChange={() => setRole('customer')}
            disabled={isSubmitting}
          />
          <label className="btn btn-outline-light py-2" htmlFor="roleCustomer">
            <i className="bi bi-person-fill me-1"></i> Customer
          </label>

          <input
            type="radio"
            className="btn-check"
            name="roleRadio"
            id="roleWorker"
            checked={role === 'worker'}
            onChange={() => setRole('worker')}
            disabled={isSubmitting}
          />
          <label className="btn btn-outline-light py-2" htmlFor="roleWorker">
            <i className="bi bi-tools me-1"></i> Service Worker
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label text-white small">Full Name</label>
          <input
            type="text"
            className="form-control form-control-custom"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label text-white small">Email Address</label>
          <input
            type="email"
            className="form-control form-control-custom"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label text-white small">Password</label>
          <input
            type="password"
            className="form-control form-control-custom"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isSubmitting}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label text-white small">Phone Number</label>
          <input
            type="tel"
            className="form-control form-control-custom"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label text-white small">Address</label>
        <input
          type="text"
          className="form-control form-control-custom"
          placeholder="123 Street Name, City, State"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Worker Fields */}
      {role === 'worker' && (
        <div className="border-top border-secondary border-opacity-25 pt-3 mt-3 animate-fade-in">
          <h5 className="text-white mb-3 small text-uppercase tracking-wider">Professional Profile</h5>
          
          <div className="mb-3">
            <label className="form-label text-white small d-block">Select Your Skills</label>
            <div className="row g-2">
              {AVAILABLE_SKILLS.map((skill, index) => (
                <div key={index} className="col-6">
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
              <label className="form-label text-white small">Hourly Rate ($)</label>
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
              <label className="form-label text-white small">License / Cert. Number</label>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="e.g. EL-9981"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-white small">Professional Bio / Description</label>
            <textarea
              className="form-control form-control-custom"
              rows={3}
              placeholder="Tell customers about your experience, training, and equipment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-gradient-primary w-100 py-2.5 mt-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}

export default RegistrationForm;
export { AVAILABLE_SKILLS };
