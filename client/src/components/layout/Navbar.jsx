import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <div className="menu-toggle-placeholder"></div>
        <span className="navbar-brand">Attendance System</span>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="user-profile-menu">
            <button 
              className="profile-trigger" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Toggle user menu"
            >
              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <svg 
                className={`dropdown-chevron ${dropdownOpen ? 'rotated' : ''}`}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="hdr-name">{user.name}</p>
                  <p className="hdr-email">{user.email}</p>
                </div>
                <hr className="dropdown-divider" />
                <Link 
                  to="/profile" 
                  className="dropdown-item" 
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  My Profile
                </Link>
                <button 
                  className="dropdown-item logout-btn" 
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .top-navbar {
          height: var(--navbar-height);
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          background-color: var(--surface);
          border-bottom: 1px solid var(--surface-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 100;
        }

        .navbar-brand {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: -0.5px;
        }

        .user-profile-menu {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: background-color var(--transition-fast);
        }

        .profile-trigger:hover {
          background-color: var(--background);
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 2px 4px rgba(30, 58, 138, 0.2);
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        @media (max-width: 576px) {
          .profile-details {
            display: none;
          }
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .dropdown-chevron {
          color: var(--text-secondary);
          transition: transform var(--transition-fast);
        }

        .dropdown-chevron.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background-color: var(--surface);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem;
          z-index: 110;
          animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 0.75rem;
        }

        .hdr-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .hdr-email {
          font-size: 0.75rem;
          color: var(--text-muted);
          word-break: break-all;
        }

        .dropdown-divider {
          border: 0;
          border-top: 1px solid var(--surface-border);
          margin: 0.5rem 0;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background-color var(--transition-fast);
        }

        .dropdown-item:hover {
          background-color: var(--background);
          color: var(--text-primary);
        }

        .logout-btn:hover {
          color: var(--danger);
          background-color: var(--danger-bg);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
