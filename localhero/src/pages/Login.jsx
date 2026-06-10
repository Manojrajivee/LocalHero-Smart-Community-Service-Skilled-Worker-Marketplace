import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';

  const handleLoginSuccess = (user) => {
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }
    
    // Default redirects based on roles
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user.role === 'worker') {
      navigate('/worker/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="row justify-content-center align-items-center py-5 animate-fade-in text-white">
      <div className="col-lg-5 col-md-8">
        <div className="card glass-card border-0 p-4">
          <div className="text-center mb-4">
            <div className="fs-1 text-info mb-2">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h2 className="text-white">Welcome Back</h2>
            <p className="text-muted small">Sign in to manage your bookings and services</p>
          </div>

          <LoginForm onLoginSuccess={handleLoginSuccess} />

          <hr className="my-4 border-secondary opacity-25" />

          {/* Test Accounts Help Box */}
          <div className="p-3 bg-slate-900 bg-opacity-40 border border-secondary border-opacity-25 rounded-3 mb-4 small text-start">
            <span className="fw-semibold text-info d-block mb-1">
              <i className="bi bi-info-circle me-1"></i> Quick Test Credentials (Password: <code>password</code>):
            </span>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-1 text-muted">
              <li>• Customer: <code>customer@hero.com</code></li>
              <li>• Worker: <code>worker@hero.com</code> (Verified)</li>
              <li>• Admin: <code>admin@hero.com</code></li>
            </ul>
          </div>

          <div className="text-center">
            <p className="mb-0 text-muted small">
              Don't have an account?{' '}
              <Link to="/register" className="text-info text-decoration-none fw-semibold">
                Sign Up Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
