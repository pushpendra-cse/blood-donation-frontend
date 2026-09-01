import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { FileText, CheckCircle, XCircle, Trash2, Search, Hospital, Phone, User, MapPin } from 'lucide-react';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequests = async () => {
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (urgencyFilter !== 'All') params.urgency = urgencyFilter;
      if (search.trim() !== '') params.city = search.trim();

      const res = await api.get('/requests', { params });
      if (res.data.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setAlert({ type: 'danger', message: 'Failed to load requests list.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, urgencyFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/admin/requests/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setAlert({ type: 'success', message: `Request #${id} marked as ${newStatus}` });
        fetchRequests();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setAlert({ type: 'danger', message: 'Failed to update request status.' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/admin/requests/${deleteTargetId}`);
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Blood request deleted successfully.' });
        setDeleteTargetId(null);
        fetchRequests();
      }
    } catch (err) {
      console.error('Error deleting request:', err);
      setAlert({ type: 'danger', message: 'Failed to delete blood request.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText color="var(--primary)" size={28} />
            Manage Blood Requests
          </h1>
          <p className="page-subtitle">
            Approve, reject, track, or delete receiver and emergency hospital blood requests.
          </p>
        </div>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {/* Filter Row */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 120px',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status Filter</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Urgency Filter</label>
              <select
                className="form-select"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <option value="All">All Urgencies</option>
                <option value="Emergency">Emergency</option>
                <option value="Urgent">Urgent</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City / Hospital</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '45px' }} disabled={loading}>
              <Search size={16} /> Filter
            </button>
          </div>
        </form>
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Blood Requests ({requests.length})</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '1.8rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
            <p style={{ marginTop: '8px' }}>Loading blood requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No blood requests found matching criteria.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Hospital & Address</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Receiver Contact</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td><strong>#{req.id}</strong></td>
                    <td>
                      <strong>{req.hospital_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        📍 {req.hospital_address}, {req.city}
                      </div>
                      {req.reason && <small style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>"{req.reason}"</small>}
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
                    <td>
                      <div>{req.receiver_name}</div>
                      <small style={{ color: 'var(--text-muted)' }}>{req.receiver_phone}</small>
                    </td>
                    <td><StatusBadge status={req.urgency} type="urgency" /></td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>
                      <small style={{ color: 'var(--text-muted)' }}>
                        {new Date(req.created_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'Approved')}
                              className="btn btn-success btn-sm"
                              title="Approve Request"
                            >
                              <CheckCircle size={13} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                              className="btn btn-danger btn-sm"
                              title="Reject Request"
                            >
                              <XCircle size={13} />
                            </button>
                          </>
                        )}
                        {req.status === 'Approved' && (
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'Completed')}
                            className="btn btn-success btn-sm"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTargetId(req.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                          title="Delete Request"
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

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Blood Request"
        footer={
          <>
            <button onClick={() => setDeleteTargetId(null)} className="btn btn-outline" disabled={isDeleting}>
              Cancel
            </button>
            <button onClick={handleConfirmDelete} className="btn btn-danger" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Record'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete blood request <strong>#{deleteTargetId}</strong> from the database?</p>
      </Modal>
    </div>
  );
};

export default ManageRequests;
