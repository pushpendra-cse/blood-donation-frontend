import React from 'react';

const StatCard = ({ label, value, icon, color = 'red', subtitle }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtitle && <small style={{ color: 'var(--text-light)', fontSize: '0.75rem', marginTop: '2px', display: 'block' }}>{subtitle}</small>}
      </div>
    </div>
  );
};

export default StatCard;
