import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await updateProfile(name, email, password || null);
    setLoading(false);

    if (res.success) {
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(res.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-title">
          <h1>My Profile</h1>
          <p>Update your personal account credentials and security preferences.</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="card profile-info-card">
          <div className="profile-badge-avatar">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="info-name">{user?.name}</h2>
          <p className="info-email">{user?.email}</p>

          <div className="details-list">
            <div className="detail-item">
              <span className="det-label">Portal Role:</span>
              <span className="det-val badge badge-active">{user?.role}</span>
            </div>
            {user?.employeeId && (
              <div className="detail-item">
                <span className="det-label">Employee ID Map:</span>
                <span className="det-val font-semibold">{user.employeeId}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card profile-edit-card">
          <h3 className="card-title">Account Security Details</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="prof-name">Display Name</label>
              <input 
                type="text" 
                id="prof-name"
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-email">Email Address</label>
              <input 
                type="email" 
                id="prof-email"
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prof-pass">New Password</label>
                <input 
                  type="password" 
                  id="prof-pass"
                  placeholder="Leave empty to keep current"
                  className="form-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-confpass">Confirm New Password</label>
                <input 
                  type="password" 
                  id="prof-confpass"
                  placeholder="Repeat new password"
                  className="form-input" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary profile-submit-btn"
              disabled={loading}
            >
              {loading ? 'Updating Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
        }

        .profile-info-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1.5rem;
        }

        .profile-badge-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          font-size: 2.5rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          margin-bottom: 1.25rem;
        }

        .info-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .info-email {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .details-list {
          width: 100%;
          border-top: 1px solid var(--surface-border);
          padding-top: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .det-label {
          font-weight: 500;
        }

        .det-val {
          color: var(--text-primary);
        }

        .font-semibold {
          font-weight: 600;
        }

        .profile-submit-btn {
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Profile;
