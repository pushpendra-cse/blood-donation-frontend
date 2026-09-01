import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { Boxes, Plus, Minus, Edit3, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const BloodInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Edit stock modal state
  const [editGroup, setEditGroup] = useState(null);
  const [customUnits, setCustomUnits] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      if (res.data.success) {
        setInventory(res.data.inventory || []);
        setTotalUnits(res.data.total_units || 0);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setAlert({ type: 'danger', message: 'Failed to load blood inventory.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustUnits = async (bloodGroup, action, units = 1) => {
    try {
      const res = await api.put('/inventory/update', {
        blood_group: bloodGroup,
        units,
        action
      });
      if (res.data.success) {
        setAlert({ type: 'success', message: res.data.message });
        fetchInventory();
      }
    } catch (err) {
      console.error('Error updating stock:', err);
      setAlert({ type: 'danger', message: 'Failed to update blood inventory units.' });
    }
  };

  const handleCustomSet = async (e) => {
    e.preventDefault();
    if (!editGroup) return;
    setIsUpdating(true);
    try {
      const res = await api.put('/inventory/update', {
        blood_group: editGroup.blood_group,
        units: parseInt(customUnits) || 0,
        action: 'set'
      });
      if (res.data.success) {
        setAlert({ type: 'success', message: `Stock for ${editGroup.blood_group} updated to ${customUnits} units!` });
        setEditGroup(null);
        fetchInventory();
      }
    } catch (err) {
      console.error('Error setting units:', err);
      setAlert({ type: 'danger', message: 'Failed to update units.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Boxes color="var(--primary)" size={28} />
            Blood Bank Inventory Management
          </h1>
          <p className="page-subtitle">
            Total In-Stock Units: <strong>{totalUnits} Units</strong> across all 8 ABO/Rh blood groups.
          </p>
        </div>
        <button onClick={fetchInventory} className="btn btn-outline btn-sm">
          <RefreshCw size={14} /> Refresh Stock
        </button>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {/* Grid of 8 Blood Groups with Control Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {inventory.map((item) => {
          const isLow = item.available_units <= 5;
          return (
            <div
              key={item.blood_group}
              className="card"
              style={{
                borderTop: isLow ? '4px solid var(--danger)' : '4px solid var(--success)',
                textAlign: 'center',
                padding: '24px 16px'
              }}
            >
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: isLow ? 'var(--danger)' : 'var(--primary)',
                lineHeight: 1
              }}>
                {item.blood_group}
              </div>

              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)', margin: '12px 0 4px' }}>
                {item.available_units} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Units</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                {isLow ? (
                  <span className="badge badge-emergency" style={{ fontSize: '0.72rem' }}>
                    <AlertTriangle size={12} /> Low Stock Alert
                  </span>
                ) : (
                  <span className="badge badge-completed" style={{ fontSize: '0.72rem' }}>
                    <CheckCircle size={12} /> Adequate Supply
                  </span>
                )}
              </div>

              {/* Adjust Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => handleAdjustUnits(item.blood_group, 'subtract', 1)}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '6px 12px' }}
                  title="Deduct 1 Unit"
                  disabled={item.available_units <= 0}
                >
                  <Minus size={15} />
                </button>

                <button
                  onClick={() => {
                    setEditGroup(item);
                    setCustomUnits(item.available_units);
                  }}
                  className="btn btn-outline-primary btn-sm"
                  style={{ padding: '6px 12px' }}
                  title="Edit Exact Stock"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={() => handleAdjustUnits(item.blood_group, 'add', 1)}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '6px 12px' }}
                  title="Add 1 Unit"
                >
                  <Plus size={15} />
                </button>
              </div>

              <small style={{ display: 'block', marginTop: '12px', color: 'var(--text-light)', fontSize: '0.72rem' }}>
                Updated {new Date(item.updated_at).toLocaleString()}
              </small>
            </div>
          );
        })}
      </div>

      {/* Manual Set Stock Modal */}
      <Modal
        isOpen={!!editGroup}
        onClose={() => setEditGroup(null)}
        title={`Set Inventory Stock for ${editGroup?.blood_group}`}
      >
        {editGroup && (
          <form onSubmit={handleCustomSet}>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
              Enter the exact count of available blood bags for group <strong>{editGroup.blood_group}</strong>.
            </p>
            <div className="form-group">
              <label className="form-label required">Available Units</label>
              <input
                type="number"
                min="0"
                className="form-control"
                required
                value={customUnits}
                onChange={(e) => setCustomUnits(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setEditGroup(null)} className="btn btn-outline" disabled={isUpdating}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Set Stock'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default BloodInventory;
