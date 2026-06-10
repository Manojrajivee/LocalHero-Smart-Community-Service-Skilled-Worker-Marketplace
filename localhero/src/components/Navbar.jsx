import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to="/">
          <i className="bi bi-shield-shaded"></i>
          <span>Local Hero</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Common Public Links */}
            {!user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/about">
                    About
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/contact">
                    Contact
                  </NavLink>
                </li>
              </>
            )}

            {/* Customer Role Links */}
            {user && user.role === 'customer' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/customer/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/customer/search">
                    Find Workers
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/customer/bookings">
                    My Bookings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/about">
                    About
                  </NavLink>
                </li>
              </>
            )}

            {/* Worker Role Links */}
            {user && user.role === 'worker' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/worker/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/worker/bookings">
                    Job Requests
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/worker/history">
                    Work History
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin Role Links */}
            {user && user.role === 'admin' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/admin/dashboard">
                    Admin Panel
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/admin/users">
                    Users
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/admin/verification">
                    Verifications
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/admin/bookings">
                    Bookings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-custom" to="/admin/reports">
                    Reports
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-glass dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className={`bi ${user.role === 'admin' ? 'bi-shield-lock-fill text-danger' : user.role === 'worker' ? 'bi-tools text-info' : 'bi-person-fill text-primary'}`}></i>
                  <span>{user.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="userDropdown">
                  {user.role === 'customer' && (
                    <li>
                      <Link className="dropdown-item" to="/customer/profile">
                        <i className="bi bi-person me-2"></i>Profile Settings
                      </Link>
                    </li>
                  )}
                  {user.role === 'worker' && (
                    <li>
                      <Link className="dropdown-item" to="/worker/profile">
                        <i className="bi bi-gear me-2"></i>Configure Profile
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-glass">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-gradient-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
