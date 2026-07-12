import React from 'react';
import { DEPARTMENTS } from '../../utils/helpers';

const ReportFilters = ({
  filters,
  setFilters,
  onApplyFilters,
  onClearFilters,
  onExportExcel,
  onExportPDF,
  loading
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters();
  };

  return (
    <div className="card filters-card">
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="filters-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="filter-startDate">Start Date</label>
            <input 
              type="date" 
              id="filter-startDate"
              name="startDate"
              className="form-input"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="filter-endDate">End Date</label>
            <input 
              type="date" 
              id="filter-endDate"
              name="endDate"
              className="form-input"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="filter-dept">Department</label>
            <select 
              id="filter-dept"
              name="department"
              className="form-input"
              value={filters.department}
              onChange={handleChange}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="filter-status">Status</label>
            <select 
              id="filter-status"
              name="status"
              className="form-input"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          <div className="form-group emp-id-filter-group">
            <label className="form-label" htmlFor="filter-empId">Employee/Student ID</label>
            <input 
              type="text" 
              id="filter-empId"
              name="employeeId"
              placeholder="e.g. E001"
              className="form-input"
              value={filters.employeeId}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="buttons-bar">
          <div className="query-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Apply Filters
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClearFilters}>
              Clear
            </button>
          </div>

          <div className="export-actions">
            <button type="button" className="btn btn-success" onClick={onExportExcel} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M10 9H8"/>
              </svg>
              Export Excel
            </button>
            <button type="button" className="btn btn-danger" onClick={onExportPDF} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 3-3 3 3"/><path d="M12 12v6"/>
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .filters-card {
          margin-bottom: 1.5rem;
          border-left: 4px solid var(--primary);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.25rem;
        }

        .buttons-bar {
          display: flex;
          justify-content: space-between;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--surface-border);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .query-actions, .export-actions {
          display: flex;
          gap: 0.75rem;
        }

        @media (max-width: 768px) {
          .buttons-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .query-actions, .export-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportFilters;
