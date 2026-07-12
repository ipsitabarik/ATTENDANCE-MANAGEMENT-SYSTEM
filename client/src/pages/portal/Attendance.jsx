import React, { useState, useEffect } from 'react';
import attendanceService from '../../services/attendanceService';
import AttendanceForm from '../../components/attendance/AttendanceForm';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import { getTodayString } from '../../utils/helpers';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-load on mount
  useEffect(() => {
    loadAttendanceSheet();
  }, []);

  const loadAttendanceSheet = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await attendanceService.getAttendance(selectedDate, selectedDepartment);
      if (res.success) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load attendance worksheet. Verify connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordChange = (employeeId, field, value) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.employeeId === employeeId ? { ...rec, [field]: value } : rec))
    );
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      // Map local record structure to bulk request payload
      const payload = records.map((rec) => ({
        employeeId: rec.employeeId,
        status: rec.status,
        remarks: rec.remarks
      }));

      const res = await attendanceService.bulkMarkAttendance(selectedDate, payload);
      if (res.success) {
        setSuccess(`Attendance successfully saved! Recorded ${res.count} items.`);
        // Reload list to sync marked status flags
        loadAttendanceSheet();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while saving attendance.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter records locally by search term
  const filteredRecords = records.filter(
    (rec) =>
      rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Mark Attendance</h1>
          <p>Select date and department to roll-call active employees or students.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <AttendanceForm 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onLoadSheet={loadAttendanceSheet}
        onSaveAttendance={handleSaveAttendance}
        isSaving={isSaving}
        count={records.length}
      />

      <div className="attendance-sheet-container">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-text">Retrieving worksheet profiles...</p>
          </div>
        ) : (
          <AttendanceTable 
            records={filteredRecords}
            onRecordChange={handleRecordChange}
          />
        )}
      </div>
    </div>
  );
};

export default Attendance;
