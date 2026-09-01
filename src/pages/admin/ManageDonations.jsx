import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { Layers, PlusCircle, CheckCircle, Trash2, Calendar, Phone, Droplet, Search } from 'lucide-react';

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [bloodFilter, setBloodFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Add Donation Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDonation, setNewDonation] = useState({
    donor_id: '',
    blood_group: 'O+',
    units: 1,
    donation_date: new Date().toISOString().split('T')[0],
    status: 'Completed'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDonations = async () => {
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (bloodFilter !== 'All') params.blood_group = bloodFilter;

      const [donRes, donorsRes] = await Promise.all([
        api.get('/donations', { params }),
        api.get('/admin/donors')
      ]);

      if (donRes.data.success) setDonations(donRes.data.donations || []);
      if (donorsRes.data.success) setDonors(donorsRes.data.donors || []);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setAlert({ type: 'danger', message: 'Failed to load donations.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [statusFilter, bloodFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.put(`/donations/${id}/status`, { status });
      if (res.data.success) {
        setAlert({ type: 'success', message: res.data.message });
        fetchDonations();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setAlert({ type: 'danger', message: 'Failed to update donation status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete donation #${id}?`)) return;
    try {
      const res = await api.delete(`/admin/donations/${id}`);
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Donation record deleted.' });
        fetchDonations();
      }
    } catch (err) {
      console.error('Error deleting donation:', err);
      setAlert({ type: 'danger', message: 'Failed to delete donation.' });
    }
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/donations', newDonation);
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Donation recorded and blood inventory updated!' });
        setShowAddModal(false);
        fetchDonations();
      }
    } catch (err) {
      console.error('Error creating donation:', err);
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to record donation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Layers color="var(--primary)" size={28} />
            Manage Blood Donations
          </h1>
          <p className="page-subtitle">
            Log walk-in blood donations, track schedules, and synchronize inventory units.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <PlusCircle size={18} /> Record New Donation
        </button>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {/* Filter Row */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status Filter</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Blood Group</label>
            <select
              className="form-select"
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
            >
              <option value="All">All Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Donation Records ({donations.length})</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '1.8rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
            <p style={{ marginTop: '8px' }}>Loading donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No donation records found.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Donor Name & Contact</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Hospital / Destination</th>
                  <th>Donation Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td><strong>#{d.id}</strong></td>
                    <td>
                      <strong>{d.donor_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Phone size={12} style={{ display: 'inline' }} /> {d.donor_phone} • {d.donor_city}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {d.blood_group}
                      </span>
                    </td>
                    <td><strong>{d.units}</strong> Unit(s)</td>
                    <td>
                      <div>{d.hospital_name || 'Central Blood Bank Storage'}</div>
                      {d.receiver_name && <small style={{ color: 'var(--text-muted)' }}>Patient: {d.receiver_name}</small>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} color="var(--text-muted)" />
                        {new Date(d.donation_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td><StatusBadge status={d.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {d.status === 'Scheduled' && (
                          <button
                            onClick={() => handleStatusUpdate(d.id, 'Completed')}
                            className="btn btn-success btn-sm"
                            title="Mark as Completed"
                          >
                            <CheckCircle size={13} /> Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Donation Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Record Walk-in Blood Donation"
      >
        <form onSubmit={handleCreateDonation}>
          <div className="form-group">
            <label className="form-label required">Select Donor</label>
            <select
              className="form-select"
              required
              value={newDonation.donor_id}
              onChange={(e) => {
                const selected = donors.find(d => d.donor_id == e.target.value);
                setNewDonation({
                  ...newDonation,
                  donor_id: e.target.value,
                  blood_group: selected ? selected.blood_group : newDonation.blood_group
                });
              }}
            >
              <option value="">-- Choose Registered Donor --</option>
              {donors.map(d => (
                <option key={d.donor_id} value={d.donor_id}>
                  {d.name} ({d.blood_group} - {d.city})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Blood Group</label>
              <select
                className="form-select"
                value={newDonation.blood_group}
                onChange={(e) => setNewDonation({ ...newDonation, blood_group: e.target.value })}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Units Donated</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                required
                value={newDonation.units}
                onChange={(e) => setNewDonation({ ...newDonation, units: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Donation Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={newDonation.donation_date}
                onChange={(e) => setNewDonation({ ...newDonation, donation_date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Status</label>
              <select
                className="form-select"
                value={newDonation.status}
                onChange={(e) => setNewDonation({ ...newDonation, status: e.target.value })}
              >
                <option value="Completed">Completed (Add to Inventory)</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Update Stock'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDonations;
