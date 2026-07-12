import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import ReportFilters from '../../components/reports/ReportFilters';
import { formatDate } from '../../utils/helpers';

const Reports = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: 'All',
    status: 'All',
    employeeId: ''
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reportService.getReportData(filters);
      if (res.success) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to aggregate report records.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    const cleared = {
      startDate: '',
      endDate: '',
      department: 'All',
      status: 'All',
      employeeId: ''
    };
    setFilters(cleared);
    // Trigger update with cleared filters
    setLoading(true);
    reportService.getReportData(cleared)
      .then((res) => {
        if (res.success) setRecords(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleExportExcel = async () => {
    try {
      await reportService.downloadExcelReport(filters);
    } catch (err) {
      console.error(err);
      setError('Excel export download crashed.');
    }
  };

  const handleExportPDF = async () => {
    try {
      await reportService.downloadPDFReport(filters);
    } catch (err) {
      console.error(err);
      setError('PDF export download crashed.');
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Attendance Reports</h1>
          <p>Filter historical log collections and download spreadsheet spreadsheet files.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <ReportFilters 
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={fetchReportData}
        onClearFilters={handleClearFilters}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        loading={loading}
      />

      <div className="card report-table-card">
        <h3 className="card-title">
          Filtered Records Listings ({records.length})
        </h3>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-text">Aggregating records database logs...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="font-semibold">{formatDate(record.dateString)}</td>
                    <td className="emp-id">{record.employee ? record.employee.employeeId : record.employeeId}</td>
                    <td className="font-semibold">{record.employee ? record.employee.name : ''}</td>
                    <td>{record.employee ? record.employee.department : ''}</td>
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
                {records.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-secondary">
                      No records matched current query. Select alternate parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .report-table-card {
          margin-top: 1.5rem;
        }
        
        .font-semibold {
          font-weight: 600;
        }

        .emp-id {
          font-weight: 700;
          color: var(--primary);
        }

        .text-center {
          text-align: center;
        }

        .text-secondary {
          color: var(--text-secondary);
        }

        .text-muted {
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default Reports;
