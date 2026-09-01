import React from 'react';

const StatusBadge = ({ status, type = 'status' }) => {
  if (!status) return null;

  let badgeClass = 'badge-normal';
  const cleanStatus = status.toString().trim();

  if (type === 'urgency') {
    if (cleanStatus === 'Emergency') badgeClass = 'badge-emergency';
    else if (cleanStatus === 'Urgent') badgeClass = 'badge-urgent';
    else badgeClass = 'badge-normal';
  } else if (type === 'availability') {
    if (cleanStatus === 'Available') badgeClass = 'badge-available';
    else badgeClass = 'badge-not-available';
  } else {
    switch (cleanStatus) {
      case 'Pending':
        badgeClass = 'badge-pending';
        break;
      case 'Approved':
        badgeClass = 'badge-approved';
        break;
      case 'Completed':
        badgeClass = 'badge-completed';
        break;
      case 'Scheduled':
        badgeClass = 'badge-scheduled';
        break;
      case 'Rejected':
      case 'Cancelled':
        badgeClass = 'badge-rejected';
        break;
      case 'Available':
        badgeClass = 'badge-available';
        break;
      case 'Not Available':
        badgeClass = 'badge-not-available';
        break;
      default:
        badgeClass = 'badge-normal';
    }
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {cleanStatus}
    </span>
  );
};

export default StatusBadge;
