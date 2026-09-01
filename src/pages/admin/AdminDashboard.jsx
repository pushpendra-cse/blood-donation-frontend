import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import { 
  Users, 
  HeartHandshake, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  Boxes, 
  Droplet, 
  ArrowRight, 
  Clock, 
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setAlert({ type: 'danger', message: 'Failed to load administrative analytics.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStockUpdate = async (bloodGroup, action) => {
    try {
      const res = await api.put('/inventory/update', {
        blood_group: bloodGroup,
        units: 1,
        action
      });
      if (res.data.success) {
        setAlert({ type: 'success', message: `${bloodGroup} stock updated (+1/-1)` });
        fetchStats();
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update stock.' });
    }
  };

  const handleRequestStatusChange = async (requestId, newStatus) => {
    try {
      const res = await api.put(`/admin/requests/${requestId}/status`, { status: newStatus });
      if (res.data.success) {
        setAlert({ type: 'success', message: `Request #${requestId} status set to ${newStatus}` });
        fetchStats();
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update request status.' });
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '2rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
        <p style={{ marginTop: '12px' }}>Loading Admin Central Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            👑 Administrator Control Center
          </h1>
          <p className="page-subtitle">
            Real-time analytics, blood inventory management, and system operations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/inventory" className="btn btn-outline-primary btn-sm">
            <Boxes size={16} /> Manage Inventory
          </Link>
          <Link to="/admin/requests" className="btn btn-primary btn-sm">
            <FileText size={16} /> All Blood Requests
          </Link>
        </div>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {/* Primary Analytics Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total System Users"
          value={stats?.total_users || 0}
          icon={<Users size={24} />}
          color="blue"
          subtitle={`Donors: ${stats?.total_donors} | Receivers: ${stats?.total_receivers}`}
        />
        <StatCard
          label="Total Donors"
          value={stats?.total_donors || 0}
          icon={<HeartHandshake size={24} />}
          color="purple"
          subtitle="Volunteer donor base"
        />
        <StatCard
          label="Total Blood Requests"
          value={stats?.total_requests || 0}
          icon={<FileText size={24} />}
          color="amber"
          subtitle={`Pending: ${stats?.pending_requests} | Approved: ${stats?.approved_requests}`}
        />
        <StatCard
          label="Completed Donations"
          value={stats?.completed_donations || 0}
          icon={<CheckCircle2 size={24} />}
          color="green"
          subtitle={`Scheduled: ${stats?.scheduled_donations}`}
        />
        <StatCard
          label="Total Blood Bank Stock"
          value={`${stats?.total_blood_units || 0} Units`}
          icon={<Droplet size={24} />}
          color="red"
          subtitle="Aggregated available units"
        />
      </div>

      {/* Blood Inventory Quick Adjustment Cards */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h2 className="card-title">Blood Bank Real-Time Inventory Control</h2>
          <Link to="/admin/inventory" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            Full Inventory Matrix <ArrowRight size={14} style={{ display: 'inline' }} />
          </Link>
        </div>

        <div className="blood-groups-grid">
          {stats?.inventory?.map((item) => (
            <div key={item.blood_group} className="blood-card" style={{ padding: '14px 10px' }}>
              <div className="blood-type" style={{ fontSize: '1.6rem', marginBottom: '2px' }}>{item.blood_group}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
                {item.available_units} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                <button
                  onClick={() => handleQuickStockUpdate(item.blood_group, 'subtract')}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '2px 8px', borderRadius: '4px' }}
                  title="Deduct 1 Unit"
                >
                  <Minus size={13} />
                </button>
                <button
                  onClick={() => handleQuickStockUpdate(item.blood_group, 'add')}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '2px 8px', borderRadius: '4px' }}
                  title="Add 1 Unit"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Requests & Recent Donations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Recent Blood Requests */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Blood Requests</h2>
            <Link to="/admin/requests" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Manage All <ArrowRight size={14} style={{ display: 'inline' }} />
            </Link>
          </div>

          {(!stats?.recent_requests || stats.recent_requests.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No recent requests.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.recent_requests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{req.blood_group}</span>
                      <strong style={{ fontSize: '0.92rem' }}>{req.hospital_name}</strong>
                      <StatusBadge status={req.urgency} type="urgency" />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {req.city} • Units: {req.units_required} • {req.receiver_name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <StatusBadge status={req.status} />
                    {req.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => handleRequestStatusChange(req.id, 'Approved')}
                          className="btn btn-success btn-sm"
                          style={{ fontSize: '0.72rem', padding: '2px 6px' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestStatusChange(req.id, 'Rejected')}
                          className="btn btn-danger btn-sm"
                          style={{ fontSize: '0.72rem', padding: '2px 6px' }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Donations */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Donations Log</h2>
            <Link to="/admin/donations" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Manage All <ArrowRight size={14} style={{ display: 'inline' }} />
            </Link>
          </div>

          {(!stats?.recent_donations || stats.recent_donations.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No donations logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.recent_donations.map((d) => (
                <div
                  key={d.id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{d.blood_group}</span>
                      <strong>{d.donor_name}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {d.hospital_name || 'Central Blood Transfusion Unit'} • {d.units} Unit(s)
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={d.status} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                      {new Date(d.donation_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
