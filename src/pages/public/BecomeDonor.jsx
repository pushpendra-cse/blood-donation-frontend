import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

const BecomeDonor = () => {
  return (
    <div className="page-container">
      <div className="page-header" style={{ textAlign: 'center', display: 'block', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ justifyContent: 'center' }}>
          <HeartHandshake color="var(--primary)" size={36} />
          Become a Voluntary Blood Donor
        </h1>
        <p className="page-subtitle" style={{ maxWidth: '600px', margin: '8px auto 0' }}>
          Join thousands of heroes who donate blood and save lives every single day.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '40px' }}>
        {/* Eligibility Checklist */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 color="var(--success)" size={22} /> Donor Eligibility Criteria
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '8px' }}></div>
              <div>
                <strong>Age:</strong> You must be at least 18 years old (and under 65).
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '8px' }}></div>
              <div>
                <strong>Weight:</strong> Minimum weight of 45–50 kg.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '8px' }}></div>
              <div>
                <strong>Hemoglobin:</strong> Minimum 12.5 g/dL.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '8px' }}></div>
              <div>
                <strong>Donation Interval:</strong> At least 90 days (3 months) since your last donation.
              </div>
            </div>
          </div>
        </div>

        {/* Temporary Deferrals */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle color="var(--warning)" size={22} /> When You Should Wait
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', marginTop: '8px' }}></div>
              <div>
                <strong>Cold, Flu, Fever:</strong> Wait until fully recovered for at least 7 days.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', marginTop: '8px' }}></div>
              <div>
                <strong>Tattoos / Piercings:</strong> Wait 6 months after getting a new tattoo or body piercing.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', marginTop: '8px' }}></div>
              <div>
                <strong>Major Surgery or Dental Extraction:</strong> Consult your doctor and wait at least 3–6 months.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Callout */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1d3557 0%, #0f172a 100%)',
        color: '#ffffff',
        textAlign: 'center',
        padding: '48px 24px'
      }}>
        <h2 style={{ color: '#ffffff', fontSize: '1.8rem', marginBottom: '12px' }}>Ready to Save a Life?</h2>
        <p style={{ color: '#cbd5e1', maxWidth: '540px', margin: '0 auto 28px' }}>
          Create your donor account now to receive instant notifications when a patient nearby needs your blood group.
        </p>
        <Link to="/register?role=donor" className="btn btn-primary btn-lg">
          <UserPlus size={20} /> Register as a Donor Today <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default BecomeDonor;
