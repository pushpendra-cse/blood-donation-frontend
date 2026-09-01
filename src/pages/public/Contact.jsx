import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import Alert from '../../components/Alert';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ textAlign: 'center', display: 'block', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ justifyContent: 'center' }}>
          <PhoneCall color="var(--primary)" size={32} />
          Contact & Emergency Blood Support
        </h1>
        <p className="page-subtitle">
          Have questions or need emergency assistance? Reach our 24/7 hospital coordination desk.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Contact Information Cards */}
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--secondary)' }}>
              Emergency Coordination Desk
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PhoneCall size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>24/7 Helpline</h4>
                  <p style={{ margin: '2px 0 0', fontWeight: 600, color: 'var(--secondary)' }}>+91 1800-123-BLOOD (25663)</p>
                  <small style={{ color: 'var(--text-muted)' }}>Toll-free emergency helpline</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Email Support</h4>
                  <p style={{ margin: '2px 0 0', fontWeight: 600, color: 'var(--secondary)' }}>support@blooddonation.org</p>
                  <small style={{ color: 'var(--text-muted)' }}>Response within 2 hours</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Headquarters</h4>
                  <p style={{ margin: '2px 0 0', color: 'var(--text-main)', fontSize: '0.92rem' }}>
                    National Blood Transfusion Council Complex, Medical Enclave, New Delhi - 110029
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Operating Hours</h4>
                  <p style={{ margin: '2px 0 0', color: 'var(--text-main)', fontSize: '0.92rem' }}>
                    Blood Bank: Open 24 Hours / 7 Days
                  </p>
                  <small style={{ color: 'var(--text-muted)' }}>Donor Walk-in: 08:00 AM - 08:00 PM</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Send a Message Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--secondary)' }}>
            Send Us a Message
          </h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
            Fill out the form below for general inquiries or blood donation camp organization.
          </p>

          {submitted && (
            <Alert
              type="success"
              message="Thank you! Your message has been received. Our coordination team will get back to you shortly."
              onClose={() => setSubmitted(false)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Subject</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Blood Donation Drive / Emergency Query"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Message</label>
              <textarea
                className="form-control"
                rows="4"
                required
                placeholder="Type your message or inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
