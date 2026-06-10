import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

function Register() {
  const navigate = useNavigate();
  const [successRole, setSuccessRole] = useState(null);

  const handleRegisterSuccess = (role) => {
    if (role === 'customer') {
      // Customer auto-login happens inside context, go directly to dashboard
      navigate('/customer/dashboard');
    } else {
      // Worker needs verification, show info screen
      setSuccessRole('worker');
    }
  };

  return (
    <div className="row justify-content-center align-items-center py-5 animate-fade-in text-white">
      <div className="col-lg-7 col-md-10">
        <div className="card glass-card border-0 p-4">
          
          {!successRole ? (
            <>
              <div className="text-center mb-4">
                <div className="fs-1 text-info mb-2">
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h2 className="text-white">Create Your Account</h2>
                <p className="text-muted small">Join Local Hero as a Customer or Service Professional</p>
              </div>

              <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />

              <hr className="my-4 border-secondary opacity-25" />

              <div className="text-center">
                <p className="mb-0 text-muted small">
                  Already have an account?{' '}
                  <Link to="/login" className="text-info text-decoration-none fw-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4 animate-fade-in">
              <div className="fs-1 text-success mb-3 animate-bounce">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <h2 className="text-white">Registration Successful!</h2>
              <p className="lead text-muted mt-3">
                Your worker application has been submitted to the platform administrators.
              </p>
              
              <div className="my-4 p-3 bg-slate-900 bg-opacity-40 border border-secondary border-opacity-25 rounded-3 text-start small">
                <span className="fw-semibold text-info d-block mb-2">
                  <i className="bi bi-shield-exclamation me-1"></i> Next Steps:
                </span>
                <ol className="text-muted ps-3 mb-0 d-flex flex-column gap-2">
                  <li>Our administrators will review your profile, skills, and license details.</li>
                  <li>
                    You can test approvals immediately by logging into the Admin account (<code>admin@hero.com</code> / <code>password</code>) and approving your application.
                  </li>
                  <li>Once verified, your profile will appear on customer search dashboards for bookings!</li>
                </ol>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-gradient-primary">
                  Go to Login
                </Link>
                <Link to="/" className="btn btn-glass">
                  Back to Home
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Register;
