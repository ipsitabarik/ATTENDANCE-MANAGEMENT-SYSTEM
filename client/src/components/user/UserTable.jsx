import React from 'react';

const UserTable = ({ type, data, onEdit, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="card empty-state">
        <p>No records found in this directory.</p>
        <style>{`
          .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="custom-table">
        {type === 'user' ? (
          /* User Login Accounts Header */
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Employee ID Mapping</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
        ) : (
          /* Employee Records Header */
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
        )}

        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {type === 'user' ? (
                /* User Row */
                <>
                  <td className="font-semibold">{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className="badge badge-active">{item.role}</span>
                  </td>
                  <td className="emp-id-map">{item.employeeId || 'None'}</td>
                </>
              ) : (
                /* Employee Row */
                <>
                  <td className="emp-id">{item.employeeId}</td>
                  <td className="font-semibold">{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.department}</td>
                  <td>{item.designation}</td>
                  <td>
                    <span className={`badge ${item.status === 'Active' ? 'badge-present' : 'badge-inactive'}`}>
                      {item.status}
                    </span>
                  </td>
                </>
              )}

              {/* Common Actions */}
              <td className="actions-cell">
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => onEdit(item)}
                  title="Edit Record"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                  </svg>
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => onDelete(item._id)}
                  title="Delete Record"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .font-semibold {
          font-weight: 600;
        }

        .emp-id-map {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .actions-header {
          width: 180px;
          text-align: center;
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }

        .emp-id {
          font-weight: 700;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default UserTable;
