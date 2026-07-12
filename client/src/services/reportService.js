import axios from 'axios';

const getReportData = async (params = {}) => {
  const response = await axios.get('/api/reports', { params });
  return response.data;
};

const downloadExcelReport = async (params = {}) => {
  const response = await axios.get('/api/reports/export/excel', {
    params,
    responseType: 'blob'
  });
  
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `attendance_report_${Date.now()}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

const downloadPDFReport = async (params = {}) => {
  const response = await axios.get('/api/reports/export/pdf', {
    params,
    responseType: 'blob'
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `attendance_report_${Date.now()}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

export default {
  getReportData,
  downloadExcelReport,
  downloadPDFReport
};
