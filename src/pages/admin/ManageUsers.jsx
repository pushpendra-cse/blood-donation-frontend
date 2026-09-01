import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { Users, Search, Trash2, Shield, User, MapPin, Phone, Mail } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (roleFilter !== 'All') params.role = roleFilter;
      if (search.trim() !== '') params.search = search.trim();

      const res = await api.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setAlert({ type: 'danger', message: 'Failed to load users list.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/admin/users/${deleteTarget.id}`);
      if (res.data.success) {
        setAlert({ type: 'success', message: res.data.message });
        setDeleteTarget(null);
        fetchUsers();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to delete user.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users color="var(--primary)" size={28} />
            Manage Users Directory
          </h1>
          <p className="page-subtitle">
            View, search, filter, and manage all registered Donors, Receivers, and System Administrators.
          </p>
        </div>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr 120px',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Role Filter</label>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="donor">Donors Only</option>
                <option value="receiver">Receivers Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search Users</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, phone, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '45px' }} disabled={loading}>
              <Search size={16} /> Search
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Registered Accounts ({users.length})</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '1.8rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
            <p style={{ marginTop: '8px' }}>Loading registered users...</p>
          </div>
        ) : users.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No users match the search filters.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email Address</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>#{u.id}</strong></td>
                    <td><strong>{u.name}</strong></td>
                    <td>
                      <a href={`mailto:${u.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={13} color="var(--text-muted)" /> {u.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${u.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} color="var(--text-muted)" /> {u.phone}
                      </a>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="var(--text-muted)" /> {u.city}
                      </div>
                    </td>
                    <td>
                      <span className={`role-pill`} style={{
                        background: u.role === 'admin' ? '#1d3557' : u.role === 'donor' ? 'var(--primary)' : 'var(--info)'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <small style={{ color: 'var(--text-muted)' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                          title="Delete User"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm User Deletion"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn btn-outline" disabled={isDeleting}>
              Cancel
            </button>
            <button onClick={handleConfirmDelete} className="btn btn-danger" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete User & Records'}
            </button>
          </>
        }
      >
        {deleteTarget && (
          <div>
            <p>
              Are you sure you want to delete user <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
            </p>
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '8px' }}>
              ⚠️ Warning: This will permanently delete their profile, donor records, and any related blood requests or donations from MySQL.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
