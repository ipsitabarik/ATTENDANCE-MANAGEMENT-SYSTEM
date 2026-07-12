import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z"/>
            <path d="M16 14h5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z"/>
            <path d="M3 3h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
          </svg>
        </div>
        <span className="sidebar-logo-text">TrackFlow</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">Core Actions</p>
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
          Dashboard
        </NavLink>

        {/* Admin and Teacher/HR can mark attendance */}
        {(user.role === 'Admin' || user.role === 'Teacher/HR') && (
          <>
            <NavLink 
              to="/attendance" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
              Mark Attendance
            </NavLink>

            <NavLink 
              to="/reports" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
              </svg>
              Reports
            </NavLink>
          </>
        )}

        <p className="nav-section-title">Administration</p>

        {/* Admins can manage users & employee files */}
        {user.role === 'Admin' && (
          <NavLink 
            to="/manage-users" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Manage Users
          </NavLink>
        )}

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
          </svg>
          My Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="system-tag">
          <p className="tag-title">Version 1.0.0</p>
          <p className="tag-desc">Active Environment</p>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--secondary);
          color: #f8fafc;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #1e293b;
          z-index: 99;
          transition: transform var(--transition-normal);
        }

        @media (max-width: 992px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }

        .sidebar-header {
          height: var(--navbar-height);
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          gap: 0.75rem;
          border-bottom: 1px solid #1e293b;
        }

        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }

        .sidebar-logo-text {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          flex-grow: 1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
        }

        .nav-section-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          margin: 1.25rem 0.5rem 0.5rem 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          font-size: 0.92rem;
          font-weight: 500;
          color: #94a3b8;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-link.active {
          background-color: var(--primary);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid #1e293b;
        }

        .system-tag {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
        }

        .tag-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }

        .tag-desc {
          font-size: 0.7rem;
          color: #64748b;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
