import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/api';

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPassword(id, token, newPassword);
      // Depending on backend, data might be truthy, or data.success might be used.
      setMessage('Password successfully reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); // Send back to login after 3 secs
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reset password. Link may be expired.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Reset Password
        </button>
      </form>
      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
