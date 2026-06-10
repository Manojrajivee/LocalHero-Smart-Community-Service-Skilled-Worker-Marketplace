import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-custom py-5 mt-auto">
      <div className="container">
        <div className="row justify-content-between g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-shield-shaded text-info"></i> Local Hero
            </h5>
            <p className="text-muted">
              Connecting local, skilled service providers with community customers who need reliable home assistance. Safe, verified, and professional.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-muted fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
          
          <div className="col-md-3">
            <h6 className="text-white text-uppercase mb-3">Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/" className="text-muted text-decoration-none hover-text-white">Home</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none hover-text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none hover-text-white">Contact Support</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h6 className="text-white text-uppercase mb-3">Contact Support</h6>
            <p className="mb-1 text-muted"><i className="bi bi-geo-alt me-2 text-info"></i> 456 Oak Avenue, Metropolis, NY 10001</p>
            <p className="mb-1 text-muted"><i className="bi bi-telephone me-2 text-info"></i> +1 (555) 012-3456</p>
            <p className="mb-0 text-muted"><i className="bi bi-envelope me-2 text-info"></i> support@localhero.com</p>
          </div>
        </div>
        
        <hr className="my-4 border-secondary opacity-25" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} Local Hero. All rights reserved.</p>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted text-decoration-none hover-text-white">Privacy Policy</a>
            <a href="#" className="text-muted text-decoration-none hover-text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
