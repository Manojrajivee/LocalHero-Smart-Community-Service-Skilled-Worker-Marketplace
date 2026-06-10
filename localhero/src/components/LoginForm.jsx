import React, { useState } from 'react';
import { useAuth } from '../App';

function LoginForm({ onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.response?.data || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 border-0 bg-danger bg-opacity-10 text-danger rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div>{error}</div>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label text-white small">Email Address</label>
        <div className="input-group">
          <span className="input-group-text bg-slate-900 border-secondary border-opacity-25 text-muted">
            <i className="bi bi-envelope"></i>
          </span>
          <input
            type="email"
            className="form-control form-control-custom"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label text-white small">Password</label>
        <div className="input-group">
          <span className="input-group-text bg-slate-900 border-secondary border-opacity-25 text-muted">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type="password"
            className="form-control form-control-custom"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-gradient-primary w-100 py-2.5"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}

export default LoginForm;
