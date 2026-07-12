import axios from 'axios';

const bulkMarkAttendance = async (date, records) => {
  const response = await axios.post('/api/attendance/bulk', { date, records });
  return response.data;
};

const getAttendance = async (date, department) => {
  const response = await axios.get('/api/attendance', {
    params: { date, department }
  });
  return response.data;
};

const getEmployeeAttendance = async (employeeId, startDate = '', endDate = '') => {
  const response = await axios.get(`/api/attendance/employee/${employeeId}`, {
    params: { startDate, endDate }
  });
  return response.data;
};

const getAttendanceStats = async () => {
  const response = await axios.get('/api/attendance/stats');
  return response.data;
};

export default {
  bulkMarkAttendance,
  getAttendance,
  getEmployeeAttendance,
  getAttendanceStats
};
