import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import { PlusCircle, Search, FileText, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const [reqRes, invRes] = await Promise.all([
          api.get('/requests/my-requests'),
          api.get('/inventory')
        ]);

        if (reqRes.data.success) setRequests(reqRes.data.requests || []);
        if (invRes.data.success) setInventory(invRes.data.inventory || []);
      } catch (err) {
        console.error('Error fetching receiver dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiverData();
  }, []);

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const completedCount = requests.filter(r => r.status === 'Completed').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            🏥 Receiver Dashboard
          </h1>
          <p className="page-subtitle">
            Welcome, <strong>{user?.name}</strong>. Manage your blood requests and search for emergency blood donors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/receiver/search" className="btn btn-outline">
            <Search size={18} /> Search Donors
          </Link>
          <Link to="/receiver/create-request" className="btn btn-primary">
            <PlusCircle size={18} /> Request Blood
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard
          label="Total Blood Requests"
          value={requests.length}
          icon={<FileText size={24} />}
          color="blue"
          subtitle="All placed requests"
        />
        <StatCard
          label="Pending Requests"
          value={pendingCount}
          icon={<Clock size={24} />}
          color="purple"
          subtitle="Awaiting donor pledge"
        />
        <StatCard
          label="Approved / Active"
          value={approvedCount}
          icon={<AlertTriangle size={24} />}
          color="amber"
          subtitle="Donor matched or approved"
        />
        <StatCard
          label="Fulfilled Requests"
          value={completedCount}
          icon={<CheckCircle2 size={24} />}
          color="green"
          subtitle="Completed transfusions"
        />
      </div>

      {/* Recent Requests Table */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h2 className="card-title">My Recent Blood Requests</h2>
          <Link to="/receiver/my-requests" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            View All ({requests.length}) <ArrowRight size={14} style={{ display: 'inline' }} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '1.8rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
            <p style={{ marginTop: '8px' }}>Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <FileText size={40} color="var(--text-light)" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>No Blood Requests Placed Yet</h3>
            <p style={{ maxWidth: '400px', margin: '6px auto 16px', color: 'var(--text-muted)' }}>
              If you or a patient need blood for surgery or medical emergency, submit a request now.
            </p>
            <Link to="/receiver/create-request" className="btn btn-primary">
              <PlusCircle size={18} /> Create Blood Request
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Committed Donors</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.hospital_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {req.city}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {req.blood_group}
                      </span>
                    </td>
                    <td><strong>{req.units_required}</strong> Unit(s)</td>
                    <td><StatusBadge status={req.urgency} type="urgency" /></td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>
                      {req.committed_donors_count > 0 ? (
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                          ✓ {req.committed_donors_count} Donor(s) Pledged
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Searching...</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/receiver/requests/${req.id}`} className="btn btn-outline-primary btn-sm">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Blood Search Prompt */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #ffffff 100%)', border: '1px solid var(--primary-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '4px' }}>Need Immediate Donors in Your City?</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Search active volunteer donors by blood group and city to get direct emergency contact numbers.
            </p>
          </div>
          <Link to="/receiver/search" className="btn btn-primary">
            <Search size={18} /> Search Donors Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
