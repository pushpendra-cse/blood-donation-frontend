import React from 'react';

const BloodCard = ({ bloodGroup, units, compatibleWith, canReceiveFrom }) => {
  return (
    <div className="blood-card">
      <div className="blood-type">{bloodGroup}</div>
      <div className="units-available">{units !== undefined ? `${units} Units Available` : 'Blood Group'}</div>
      {compatibleWith && (
        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div><strong>Gives To:</strong> {compatibleWith}</div>
          {canReceiveFrom && <div><strong>Takes:</strong> {canReceiveFrom}</div>}
        </div>
      )}
    </div>
  );
};

export default BloodCard;
