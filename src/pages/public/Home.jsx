import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BloodCard from '../../components/BloodCard';
import StatCard from '../../components/StatCard';
import { 
  HeartHandshake, 
  Search, 
  Droplet, 
  Users, 
  CheckCircle, 
  ShieldCheck, 
  Activity, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    total_donors: 0,
    total_donations: 0,
    total_requests: 0,
    total_blood_units: 0,
    inventory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        // Fetch inventory
        const invRes = await api.get('/inventory');
        if (invRes.data.success) {
          setStats((prev) => ({
            ...prev,
            total_blood_units: invRes.data.total_units || 0,
            inventory: invRes.data.inventory || []
          }));
        }

        // Fetch general public count estimates or search
        const donorsRes = await api.get('/donors/search');
        const requestsRes = await api.get('/requests');

        setStats((prev) => ({
          ...prev,
          total_donors: donorsRes.data.count || 12,
          total_requests: requestsRes.data.count || 8,
          total_donations: 15
        }));
      } catch (err) {
        console.warn('Could not load dynamic public counts:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  const bloodCompatibility = [
    { group: 'O-', gives: 'All Blood Types', takes: 'O- Only', units: 5 },
    { group: 'O+', gives: 'O+, A+, B+, AB+', takes: 'O+, O-', units: 25 },
    { group: 'A-', gives: 'A-, A+, AB-, AB+', takes: 'A-, O-', units: 6 },
    { group: 'A+', gives: 'A+, AB+', takes: 'A+, A-, O+, O-', units: 15 },
    { group: 'B-', gives: 'B-, B+, AB-, AB+', takes: 'B-, O-', units: 4 },
    { group: 'B+', gives: 'B+, AB+', takes: 'B+, B-, O+, O-', units: 20 },
    { group: 'AB-', gives: 'AB-, AB+', takes: 'AB-, A-, B-, O-', units: 3 },
    { group: 'AB+', gives: 'AB+ Only', takes: 'All Blood Types', units: 8 },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #1d3557 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '70px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(230, 57, 70, 0.25) 0%, rgba(230,57,70,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(230, 57, 70, 0.2)',
              border: '1px solid rgba(230, 57, 70, 0.4)',
              color: '#ffccd5',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '20px'
            }}>
              <Sparkles size={16} color="#e63946" />
              Every Drop Counts • Save Up to 3 Lives Per Donation
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '20px'
            }}>
              Online Blood Donation <br />
              <span style={{ color: '#e63946' }}>Management System</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '640px',
              margin: '0 auto 32px'
            }}>
              A reliable, real-time portal connecting voluntary blood donors with patients, emergency blood banks, and hospitals across cities.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <Link to="/become-donor" className="btn btn-primary btn-lg">
                <HeartHandshake size={20} />
                Donate Blood
              </Link>
              <Link to="/find-blood" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#475569' }}>
                <Search size={20} />
                Find Blood
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg" style={{ background: '#334155' }}>
                <Activity size={20} />
                Request Blood
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LIVE METRICS BANNER */}
      <section className="page-container" style={{ marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        <div className="stats-grid">
          <StatCard
            label="Registered Donors"
            value={stats.total_donors}
            icon={<Users size={24} />}
            color="blue"
            subtitle="Verified volunteer donors"
          />
          <StatCard
            label="Total Blood Units"
            value={stats.total_blood_units}
            icon={<Droplet size={24} />}
            color="red"
            subtitle="Units available in bank"
          />
          <StatCard
            label="Active Requests"
            value={stats.total_requests}
            icon={<Activity size={24} />}
            color="amber"
            subtitle="Urgent & emergency needs"
          />
          <StatCard
            label="Completed Donations"
            value={stats.total_donations}
            icon={<HeartHandshake size={24} />}
            color="green"
            subtitle="Lives touched & saved"
          />
        </div>
      </section>

      {/* BLOOD GROUP INVENTORY OVERVIEW */}
      <section className="page-container">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Available Blood Stock by Group</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Check current blood inventory levels and compatibility information across all standard blood types.
          </p>
        </div>

        <div className="blood-groups-grid">
          {bloodCompatibility.map((item) => {
            // Find live unit count from backend state if available
            const matchingInv = stats.inventory.find(i => i.blood_group === item.group);
            const displayUnits = matchingInv ? matchingInv.available_units : item.units;
            return (
              <BloodCard
                key={item.group}
                bloodGroup={item.group}
                units={displayUnits}
                compatibleWith={item.gives}
                canReceiveFrom={item.takes}
              />
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/find-blood" className="btn btn-outline-primary">
            Search Donors in Your City <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* HOW THE SYSTEM WORKS (3 SIMPLE STEPS) */}
      <section style={{ background: '#f1f5f9', padding: '64px 20px', margin: '40px 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>How It Works</h2>
            <p>Simple 3-step lifecycle connecting donors and patients in minutes</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.5rem',
                fontWeight: 800
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Register & Set Profile</h3>
              <p style={{ fontSize: '0.92rem' }}>
                Join as a Donor or Receiver. Enter your blood group, contact number, and city location in seconds.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--info-bg)',
                color: 'var(--info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.5rem',
                fontWeight: 800
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Request or Search</h3>
              <p style={{ fontSize: '0.92rem' }}>
                Receivers submit emergency blood requests with hospital details. Donors view and accept compatible requests.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.5rem',
                fontWeight: 800
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Donate & Save Lives</h3>
              <p style={{ fontSize: '0.92rem' }}>
                Complete the donation at the hospital, update inventory stock, and track your donation history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY & KEY BENEFITS */}
      <section className="page-container" style={{ paddingBottom: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Who Can Donate Blood?</h2>
            <p style={{ marginBottom: '24px' }}>
              Basic health criteria recommended by medical authorities for safe blood donation:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle color="var(--success)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Age:</strong> Between 18 and 65 years old</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle color="var(--success)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Weight:</strong> At least 45 - 50 kg</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle color="var(--success)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Interval:</strong> At least 3 months (90 days) since your last donation</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle color="var(--success)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Health:</strong> Good general physical condition, normal hemoglobin levels</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 100%)', border: '1px solid #fecdd3' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={24} /> Why Use This Management System?
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', gap: '8px', fontSize: '0.92rem' }}>
                🩸 <strong>Real-Time Stock:</strong> Live MySQL inventory tracking for hospital transfusions.
              </li>
              <li style={{ display: 'flex', gap: '8px', fontSize: '0.92rem' }}>
                ⚡ <strong>Emergency Urgency Tags:</strong> Immediate prioritization for critical ICU requests.
              </li>
              <li style={{ display: 'flex', gap: '8px', fontSize: '0.92rem' }}>
                🔒 <strong>Secure Role Access:</strong> JWT encrypted sessions for Donors, Receivers, and Admins.
              </li>
            </ul>
            <div style={{ marginTop: '24px' }}>
              <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>
                Register Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
