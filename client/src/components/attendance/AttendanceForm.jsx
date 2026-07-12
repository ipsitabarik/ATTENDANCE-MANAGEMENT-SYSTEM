import React from 'react';
import { DEPARTMENTS, getTodayString } from '../../utils/helpers';

const AttendanceForm = ({ 
  selectedDate, 
  setSelectedDate, 
  selectedDepartment, 
  setSelectedDepartment,
  searchTerm,
  setSearchTerm,
  onLoadSheet,
  onSaveAttendance,
  isSaving,
  count
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLoadSheet();
  };

  return (
    <div className="card attendance-form-container">
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="attendance-date">Attendance Date</label>
            <input 
              type="date" 
              id="attendance-date"
              className="form-input"
              value={selectedDate}
              max={getTodayString()}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="attendance-dept">Department</label>
            <select 
              id="attendance-dept"
              className="form-input"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="action-row">
          <div className="search-box-wrapper">
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              className="form-input search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="buttons-wrapper">
            <button type="submit" className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              Load Sheet
            </button>

            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onSaveAttendance}
              disabled={isSaving || count === 0}
            >
              {isSaving ? (
                <>
                  <span className="spinner-mini"></span>
                  Saving Marks...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Submit Attendance
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .attendance-form-container {
          margin-bottom: 1.5rem;
        }

        .filter-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .search-box-wrapper {
          flex-grow: 1;
          max-width: 350px;
        }

        .search-input {
          padding: 0.6rem 1rem;
        }

        .buttons-wrapper {
          display: flex;
          gap: 0.75rem;
        }

        @media (max-width: 576px) {
          .action-row {
            flex-direction: column;
            align-items: stretch;
          }
          .search-box-wrapper {
            max-width: 100%;
          }
          .buttons-wrapper {
            flex-direction: column;
          }
        }

        .spinner-mini {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AttendanceForm;
