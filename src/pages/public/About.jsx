import React from 'react';
import { Droplet, CheckCircle, Award, Heart, Shield, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="page-container">
      <div className="page-header" style={{ textAlign: 'center', display: 'block', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ justifyContent: 'center' }}>
          <Droplet color="var(--primary)" fill="var(--primary)" size={32} />
          About Online Blood Donation System
        </h1>
        <p className="page-subtitle" style={{ maxWidth: '650px', margin: '8px auto 0' }}>
          A digital healthcare initiative connecting compassionate donors with individuals and hospitals in critical need of life-saving blood.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '48px' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} /> Our Mission
          </h2>
          <p>
            To eliminate delays in finding compatible blood during medical emergencies and surgeries. By digitizing donor databases and inventory management, we ensure transparent, fast, and accessible blood coordination.
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} /> Safety & Privacy
          </h2>
          <p>
            We strictly protect personal data through hashed passwords and role-based access control. Receiver medical details and donor contact details are securely managed for verified healthcare communications.
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.3rem', color: 'var(--accent)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} /> Community Impact
          </h2>
          <p>
            Every single donation unit can be separated into red cells, platelets, and plasma, helping up to three separate patients battling trauma, cancer therapy, or surgical complications.
          </p>
        </div>
      </div>

      {/* Blood Group Compatibility Table */}
      <div className="card" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Blood Group Compatibility Matrix</h2>
        <p style={{ marginBottom: '20px' }}>
          Understanding ABO and Rh factor compatibility is critical for successful blood transfusions.
        </p>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Blood Type</th>
                <th>Can Donate To (Recipients)</th>
                <th>Can Receive From (Donors)</th>
                <th>Special Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>O-</strong></td>
                <td>Everyone (A+, A-, B+, B-, AB+, AB-, O+, O-)</td>
                <td>O- only</td>
                <td><span className="badge badge-emergency">Universal Donor (RBC)</span></td>
              </tr>
              <tr>
                <td><strong>O+</strong></td>
                <td>O+, A+, B+, AB+</td>
                <td>O+, O-</td>
                <td>Most Requested Blood Type</td>
              </tr>
              <tr>
                <td><strong>A-</strong></td>
                <td>A-, A+, AB-, AB+</td>
                <td>A-, O-</td>
                <td>Rare Rh Negative</td>
              </tr>
              <tr>
                <td><strong>A+</strong></td>
                <td>A+, AB+</td>
                <td>A+, A-, O+, O-</td>
                <td>Common Blood Type</td>
              </tr>
              <tr>
                <td><strong>B-</strong></td>
                <td>B-, B+, AB-, AB+</td>
                <td>B-, O-</td>
                <td>Rare Rh Negative</td>
              </tr>
              <tr>
                <td><strong>B+</strong></td>
                <td>B+, AB+</td>
                <td>B+, B-, O+, O-</td>
                <td>Common Blood Type</td>
              </tr>
              <tr>
                <td><strong>AB-</strong></td>
                <td>AB-, AB+</td>
                <td>AB-, A-, B-, O-</td>
                <td>Rarest Blood Group</td>
              </tr>
              <tr>
                <td><strong>AB+</strong></td>
                <td>AB+ only</td>
                <td>Everyone (A+, A-, B+, B-, AB+, AB-, O+, O-)</td>
                <td><span className="badge badge-approved">Universal Receiver</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Project Note */}
      <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid var(--secondary)' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary)', marginBottom: '8px' }}>
          🎓 Academic Project Information
        </h3>
        <p style={{ fontSize: '0.92rem' }}>
          This project is designed as a complete Full-Stack Web Development application using <strong>React.js</strong>, <strong>Node.js</strong>, <strong>Express.js</strong>, and <strong>MySQL</strong>. It demonstrates relational schema modeling, foreign key cascades, JWT authentication, and RESTful API architecture.
        </p>
      </div>
    </div>
  );
};

export default About;
