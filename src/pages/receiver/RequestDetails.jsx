import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import { FileText, ArrowLeft, Hospital, MapPin, Phone, User, Calendar, CheckCircle2 } from 'lucide-react';

const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/requests/${id}`);
        if (res.data.success) {
          setRequest(res.data.request);
        }
      } catch (err) {
        console.error('Error loading request details:', err);
        setError('Failed to load blood request details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '2rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
        <p style={{ marginTop: '12px' }}>Loading request details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="page-container">
        <Alert type="danger" message={error || 'Request not found.'} />
        <Link to="/receiver/my-requests" className="btn btn-outline">
          <ArrowLeft size={16} /> Back to Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText color="var(--primary)" size={28} />
            Blood Request #{request.id} Details
          </h1>
          <p className="page-subtitle">
            Posted on {new Date(request.created_at).toLocaleString()}
          </p>
        </div>
        <Link to="/receiver/my-requests" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Requirement Summary */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--secondary)' }}>
            Requirement Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Blood Group:</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{request.blood_group}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Units Required:</span>
              <strong>{request.units_required} Unit(s)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Urgency Level:</span>
              <StatusBadge status={request.urgency} type="urgency" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>
              <StatusBadge status={request.status} />
            </div>
          </div>
        </div>

        {/* Hospital & Location */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--secondary)' }}>
            Hospital & Patient Location
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Hospital size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <strong>{request.hospital_name}</strong>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{request.hospital_address}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <MapPin size={20} color="var(--info)" style={{ flexShrink: 0 }} />
              <div>
                <strong>City:</strong> {request.city}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <User size={20} color="var(--secondary-light)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Requested By:</strong> {request.receiver_name} ({request.receiver_phone})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Reason */}
      {request.reason && (
        <div className="card" style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '8px' }}>
            Medical Reason / Clinical Notes
          </h3>
          <p style={{ fontStyle: 'italic', background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', margin: 0 }}>
            "{request.reason}"
          </p>
        </div>
      )}

      {/* Associated Pledged Donors */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '16px' }}>
          Pledged Donors & Appointments ({request.donations?.length || 0})
        </h2>

        {(!request.donations || request.donations.length === 0) ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
            No volunteer donors have pledged to this request yet. Available donors in your city can see this request and accept.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Donor Name</th>
                  <th>Contact Phone</th>
                  <th>Location</th>
                  <th>Units Pledged</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {request.donations.map((d) => (
                  <tr key={d.donation_id}>
                    <td><strong>{d.donor_name}</strong></td>
                    <td>
                      <a href={`tel:${d.donor_phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={14} /> {d.donor_phone}
                      </a>
                    </td>
                    <td>{d.donor_city}</td>
                    <td>{d.units} Unit(s)</td>
                    <td>{new Date(d.donation_date).toLocaleDateString()}</td>
                    <td><StatusBadge status={d.donation_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;
