import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, PhoneCall, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand & Mission */}
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Droplet color="#e63946" fill="#e63946" size={24} />
            <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem' }}>LifeBlood Portal</h3>
          </div>
          <p style={{ lineHeight: 1.6, marginBottom: '16px' }}>
            A unified digital platform dedicated to saving lives by bridging voluntary blood donors, patients in critical need, and healthcare institutions seamlessly.
          </p>
          <div className="footer-emergency-box">
            <span>🚨 24/7 Emergency Blood Helpline:</span>
            <strong>+91 1800-123-BLOOD (25663)</strong>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Overview</Link></li>
            <li><Link to="/find-blood">Search Available Blood</Link></li>
            <li><Link to="/become-donor">Register as Donor</Link></li>
            <li><Link to="/about">About Blood Donation</Link></li>
            <li><Link to="/contact">Emergency Contact</Link></li>
            <li><Link to="/login">User Login Portal</Link></li>
          </ul>
        </div>

        {/* Blood Groups Information */}
        <div className="footer-section">
          <h4>Blood Groups Covered</h4>
          <p style={{ fontSize: '0.88rem', marginBottom: '12px' }}>
            Our real-time inventory tracks all 8 human blood groups:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <span
                key={bg}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {bg}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', marginTop: '12px', color: '#94a3b8' }}>
            💡 <strong>O-</strong> is the universal red blood cell donor. <strong>AB+</strong> is the universal receiver.
          </p>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact & Location</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <MapPin size={18} color="#e63946" style={{ flexShrink: 0 }} />
              <span>Central Blood Transfusion Hub, Medical Campus, New Delhi, India</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <PhoneCall size={18} color="#e63946" style={{ flexShrink: 0 }} />
              <span>+91 98765 43210 / 011-23456789</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Mail size={18} color="#e63946" style={{ flexShrink: 0 }} />
              <span>support@blooddonation.org</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Online Blood Donation Management System. Built with <Heart size={14} color="#e63946" fill="#e63946" style={{ display: 'inline' }} /> for College Academic Presentation.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
