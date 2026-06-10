import React, { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      // Auto clear success alert
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 800);
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Get in touch</span>
        <h1 className="display-5">Contact Us</h1>
        <p className="text-muted max-w-xl mx-auto">
          Have questions or need support? Send us a message, and our customer relations team will get back to you shortly.
        </p>
      </div>

      <div className="row g-4 justify-content-between">
        {/* Support details */}
        <div className="col-lg-5">
          <div className="card glass-card border-0 p-4 h-100">
            <h4 className="text-white mb-4">Contact Information</h4>
            
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-start gap-3">
                <div className="rounded bg-info bg-opacity-10 border border-info border-opacity-25 p-2.5 text-info">
                  <i className="bi bi-geo-alt fs-5"></i>
                </div>
                <div>
                  <h6 className="text-white mb-1">Our Location</h6>
                  <p className="text-muted small mb-0">456 Oak Avenue, Metropolis, NY 10001</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="rounded bg-info bg-opacity-10 border border-info border-opacity-25 p-2.5 text-info">
                  <i className="bi bi-telephone fs-5"></i>
                </div>
                <div>
                  <h6 className="text-white mb-1">Call Us</h6>
                  <p className="text-muted small mb-0">+1 (555) 012-3456</p>
                  <p className="text-muted small mb-0">Mon - Fri, 9:00 AM - 6:00 PM EST</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="rounded bg-info bg-opacity-10 border border-info border-opacity-25 p-2.5 text-info">
                  <i className="bi bi-envelope fs-5"></i>
                </div>
                <div>
                  <h6 className="text-white mb-1">Email Queries</h6>
                  <p className="text-muted small mb-0">support@localhero.com</p>
                  <p className="text-muted small mb-0">business@localhero.com</p>
                </div>
              </div>
            </div>

            <hr className="my-4 border-secondary opacity-25" />

            <h5 className="text-white mb-3">Frequently Asked Questions</h5>
            <div className="accordion accordion-dark" id="faqAccordion">
              <div className="accordion-item bg-transparent border-secondary border-opacity-25">
                <h2 className="accordion-header" id="faqHeadingOne">
                  <button className="accordion-button collapsed bg-transparent text-white small" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseOne" aria-expanded="false" aria-controls="faqCollapseOne">
                    Are the workers licensed?
                  </button>
                </h2>
                <div id="faqCollapseOne" className="accordion-collapse collapse" aria-labelledby="faqHeadingOne" data-bs-parent="#faqAccordion">
                  <div className="accordion-body text-muted small">
                    Yes. All service workers on our platform are required to upload license credentials, which are verified by our admin team before their listings are visible.
                  </div>
                </div>
              </div>
              
              <div className="accordion-item bg-transparent border-secondary border-opacity-25">
                <h2 className="accordion-header" id="faqHeadingTwo">
                  <button className="accordion-button collapsed bg-transparent text-white small" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseTwo" aria-expanded="false" aria-controls="faqCollapseTwo">
                    How do I pay workers?
                  </button>
                </h2>
                <div id="faqCollapseTwo" className="accordion-collapse collapse" aria-labelledby="faqHeadingTwo" data-bs-parent="#faqAccordion">
                  <div className="accordion-body text-muted small">
                    Payment details are discussed upon completing the booking. Currently, we support direct payouts between customers and workers, ensuring 100% of the earnings go straight to the worker.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-7">
          <div className="card glass-card border-0 p-4">
            <h4 className="text-white mb-4">Send Us a Message</h4>
            
            {isSubmitted && (
              <div className="alert alert-success d-flex align-items-center gap-2 border-0 bg-success bg-opacity-10 text-success rounded-3 animate-fade-in mb-4" role="alert">
                <i className="bi bi-check-circle-fill"></i>
                <div>Your request has been received! Our support representatives will reach out shortly.</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white small">Your Name</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="Enter your name"
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
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-white small">Subject</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  placeholder="e.g. Booking assistance, registration issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-white small">Message / Inquiry</label>
                <textarea
                  className="form-control form-control-custom"
                  rows={5}
                  placeholder="Write your detailed feedback or query here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-gradient-primary py-2.5 w-100" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending Message...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
