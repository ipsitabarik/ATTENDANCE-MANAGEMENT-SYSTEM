import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import attendanceService from '../../services/attendanceService';
import { formatDate } from '../../utils/helpers';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [employeeMetrics, setEmployeeMetrics] = useState(null);
  const [employeeHistory, setEmployeeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdminOrTeacher = user && (user.role === 'Admin' || user.role === 'Teacher/HR');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        if (isAdminOrTeacher) {
          // Fetch admin/teacher stats
          const res = await attendanceService.getAttendanceStats();
          if (res.success) {
            setStats(res.data);
          }
        } else if (user && user.employeeId) {
          // Fetch student/employee individual logs
          const res = await attendanceService.getEmployeeAttendance(user.employeeId);
          if (res.success) {
            setEmployeeMetrics(res.metrics);
            setEmployeeHistory(res.data.slice(0, 10)); // Take last 10 entries
          }
        } else {
          setError('No mapped employee ID associated with this account. Access logs by mapping an ID in profile.');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAdminOrTeacher]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="spinner-text">Populating dashboard analytics...</p>
      </div>
    );
  }

  // Calculate presence percentage for today
  const getTodayPercentage = () => {
    if (!stats || stats.totalEmployees === 0) return 0;
    const { present } = stats.today;
    return ((present / stats.totalEmployees) * 100).toFixed(0);
  };

  return (
    <div className="dashboard-page">
      <div className="welcome-banner">
        <h2>Hello, {user.name}!</h2>
        <p>
          {isAdminOrTeacher 
            ? "Here's the daily summary for all departments. Mark daily attendance sheets or download reports." 
            : `Logged in as employee. Employee ID: ${user.employeeId || 'Not Set'}. Track your presence below.`
          }
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isAdminOrTeacher ? (
        /* ==========================================
           ADMIN & TEACHER DASHBOARD
           ========================================== */
        stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Total Employees</h3>
                  <p>{stats.totalEmployees}</p>
                </div>
                <div className="stat-icon-wrapper blue-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <h3>Present Today</h3>
                  <p>{stats.today.present}</p>
                </div>
                <div className="stat-icon-wrapper green-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <h3>Absent Today</h3>
                  <p>{stats.today.absent}</p>
                </div>
                <div className="stat-icon-wrapper red-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <h3>On Leave Today</h3>
                  <p>{stats.today.leave}</p>
                </div>
                <div className="stat-icon-wrapper orange-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="dashboard-row">
              <div className="card left-panel">
                <h3 className="card-title">Presence Overview Today</h3>
                <div className="progress-circle-container">
                  <div className="circular-progress" style={{ '--percent': getTodayPercentage() }}>
                    <div className="inner-circle">
                      <span className="percent-text">{getTodayPercentage()}%</span>
                      <span className="subtext">Present</span>
                    </div>
                  </div>
                  <div className="legend">
                    <div className="legend-item"><span className="dot green"></span> Present: {stats.today.present}</div>
                    <div className="legend-item"><span className="dot red"></span> Absent: {stats.today.absent}</div>
                    <div className="legend-item"><span className="dot orange"></span> Leave: {stats.today.leave}</div>
                    <div className="legend-item"><span className="dot gray"></span> Unmarked: {stats.today.unmarked}</div>
                  </div>
                </div>
              </div>

              <div className="card right-panel">
                <h3 className="card-title">Department Stats</h3>
                <div className="dept-list">
                  {stats.departments.map((dept) => (
                    <div key={dept.department} className="dept-item">
                      <span className="dept-name">{dept.department}</span>
                      <div className="dept-meta">
                        <span>{dept.present}/{dept.total} Present</span>
                        <div className="dept-progress-bar">
                          <div 
                            className="dept-progress" 
                            style={{ 
                              width: `${dept.percentage}%`,
                              backgroundColor: dept.percentage > 75 ? 'var(--success)' : dept.percentage > 40 ? 'var(--warning)' : 'var(--danger)'
                            }}
                          ></div>
                        </div>
                        <span className="percentage-num">{dept.percentage}%</span>
                      </div>
                    </div>
                  ))}
                  {stats.departments.length === 0 && <p className="text-secondary text-center">No active departments loaded.</p>}
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        /* ==========================================
           EMPLOYEE / STUDENT DASHBOARD
           ========================================== */
        employeeMetrics && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Total Days Logged</h3>
                  <p>{employeeMetrics.total}</p>
                </div>
                <div className="stat-icon-wrapper blue-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <h3>Present Days</h3>
                  <p>{employeeMetrics.present}</p>
                </div>
                <div className="stat-icon-wrapper green-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <h3>Absent Days</h3>
                  <p>{employeeMetrics.absent}</p>
                </div>
                <div className="stat-icon-wrapper red-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <h3>Attendance Rate</h3>
                  <p>{employeeMetrics.percentage}%</p>
                </div>
                <div className="stat-icon-wrapper orange-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Recent Attendance Logs</h3>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeHistory.map((record) => (
                      <tr key={record._id}>
                        <td>{formatDate(record.dateString)}</td>
                        <td>
                          <span className={`badge ${
                            record.status === 'Present' 
                              ? 'badge-present' 
                              : record.status === 'Absent' 
                              ? 'badge-absent' 
                              : 'badge-leave'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{record.remarks || <span className="text-muted">None</span>}</td>
                      </tr>
                    ))}
                    {employeeHistory.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center text-secondary">No attendance records registered yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      )}

      <style>{`
        .blue-icon { background-color: #eff6ff; color: #3b82f6; }
        .green-icon { background-color: #f0fdf4; color: #22c55e; }
        .red-icon { background-color: #fef2f2; color: #ef4444; }
        .orange-icon { background-color: #fffbeb; color: #f59e0b; }

        .dashboard-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
        }

        @media (max-width: 992px) {
          .dashboard-row {
            grid-template-columns: 1fr;
          }
        }

        /* Circular progress styling */
        .progress-circle-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem 0;
        }

        .circular-progress {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: conic-gradient(var(--primary-light) calc(var(--percent) * 1%), var(--surface-border) 0);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 1.5rem;
          transition: background-color var(--transition-normal);
        }

        .inner-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: var(--surface);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .percent-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .subtext {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .legend {
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 550;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot.green { background-color: var(--success); }
        .dot.red { background-color: var(--danger); }
        .dot.orange { background-color: var(--warning); }
        .dot.gray { background-color: var(--text-muted); }

        .text-center {
          text-align: center;
        }

        .text-muted {
          color: var(--text-muted);
          font-style: italic;
        }

        .percentage-num {
          font-weight: 700;
          color: var(--text-primary);
          min-width: 40px;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
