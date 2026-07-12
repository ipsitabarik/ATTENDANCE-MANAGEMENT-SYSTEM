import React from 'react';

const AttendanceTable = ({ records, onRecordChange }) => {
  if (records.length === 0) {
    return (
      <div className="card empty-state">
        <p>No active employees found matching the filters. Load a sheet or add employees first.</p>
        <style>{`
          .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--text-secondary);
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="custom-table attendance-edit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th className="status-header">Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            let rowClass = '';
            if (record.status === 'Present') rowClass = 'row-present';
            else if (record.status === 'Absent') rowClass = 'row-absent';
            else if (record.status === 'Leave') rowClass = 'row-leave';

            return (
              <tr key={record.employeeId} className={rowClass}>
                <td className="emp-id">{record.employeeId}</td>
                <td className="emp-name">{record.name}</td>
                <td>{record.department}</td>
                <td>{record.designation}</td>
                <td className="status-cell">
                  <div className="status-selector">
                    <label className={`status-option opt-present ${record.status === 'Present' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name={`status-${record.employeeId}`} 
                        value="Present"
                        checked={record.status === 'Present'}
                        onChange={() => onRecordChange(record.employeeId, 'status', 'Present')}
                      />
                      <span>P</span>
                    </label>

                    <label className={`status-option opt-absent ${record.status === 'Absent' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name={`status-${record.employeeId}`} 
                        value="Absent"
                        checked={record.status === 'Absent'}
                        onChange={() => onRecordChange(record.employeeId, 'status', 'Absent')}
                      />
                      <span>A</span>
                    </label>

                    <label className={`status-option opt-leave ${record.status === 'Leave' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name={`status-${record.employeeId}`} 
                        value="Leave"
                        checked={record.status === 'Leave'}
                        onChange={() => onRecordChange(record.employeeId, 'status', 'Leave')}
                      />
                      <span>L</span>
                    </label>
                  </div>
                </td>
                <td>
                  <input 
                    type="text" 
                    placeholder="Add comment..." 
                    className="form-input table-remarks-input"
                    value={record.remarks}
                    onChange={(e) => onRecordChange(record.employeeId, 'remarks', e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <style>{`
        .status-header {
          width: 160px;
          text-align: center;
        }

        .status-cell {
          text-align: center;
        }

        .status-selector {
          display: inline-flex;
          background-color: #f1f5f9;
          padding: 3px;
          border-radius: 9999px;
          border: 1px solid var(--surface-border);
        }

        .status-option {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.85rem;
          transition: all var(--transition-fast);
        }

        .status-option input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        /* Present Styles */
        .opt-present {
          color: #16a34a;
        }
        .opt-present.active {
          background-color: var(--success);
          color: white;
          box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
        }

        /* Absent Styles */
        .opt-absent {
          color: #dc2626;
        }
        .opt-absent.active {
          background-color: var(--danger);
          color: white;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }

        /* Leave Styles */
        .opt-leave {
          color: #d97706;
        }
        .opt-leave.active {
          background-color: var(--warning);
          color: white;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
        }

        .table-remarks-input {
          padding: 0.4rem 0.75rem;
          font-size: 0.85rem;
          border-radius: var(--radius-sm);
        }

        .emp-id {
          font-weight: 700;
          color: var(--primary);
        }

        .emp-name {
          font-weight: 600;
        }

        /* Row styles for visual feedback */
        .attendance-edit-table tbody tr {
          transition: background-color var(--transition-fast);
        }

        .row-present:hover {
          background-color: #f0fdf4 !important;
        }

        .row-absent:hover {
          background-color: #fef2f2 !important;
        }

        .row-leave:hover {
          background-color: #fffbeb !important;
        }
      `}</style>
    </div>
  );
};

export default AttendanceTable;
