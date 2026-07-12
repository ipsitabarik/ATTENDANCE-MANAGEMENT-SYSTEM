const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const Report = require('../models/Report');
const { generateExcel } = require('../utils/exportExcel');
const { generatePDF } = require('../utils/exportPDF');

// Helper to construct query filters
const buildQuery = async (filters) => {
  const { startDate, endDate, department, employeeId, status } = filters;
  const attendanceQuery = {};

  // Date filtering
  if (startDate || endDate) {
    attendanceQuery.dateString = {};
    if (startDate) attendanceQuery.dateString.$gte = startDate;
    if (endDate) attendanceQuery.dateString.$lte = endDate;
  }

  // Status filtering
  if (status && status !== 'All') {
    attendanceQuery.status = status;
  }

  // Employee matching (department / employeeId filtering)
  const employeeQuery = { status: 'Active' };
  let needsEmployeeFilter = false;

  if (department && department !== 'All') {
    employeeQuery.department = department;
    needsEmployeeFilter = true;
  }

  if (employeeId) {
    employeeQuery.employeeId = employeeId;
    needsEmployeeFilter = true;
  }

  if (needsEmployeeFilter) {
    const employees = await Employee.find(employeeQuery);
    const employeeIds = employees.map(emp => emp._id);
    attendanceQuery.employee = { $in: employeeIds };
  }

  return attendanceQuery;
};

// @desc    Get filtered report data
// @route   GET /api/reports
// @access  Private
const getReportData = async (req, res) => {
  try {
    const { startDate, endDate, department, employeeId, status } = req.query;

    const query = await buildQuery({ startDate, endDate, department, employeeId, status });
    const records = await Attendance.find(query)
      .populate('employee', 'name employeeId department designation')
      .sort({ dateString: -1, employeeId: 1 });

    // Save report generation log (optional audit tracking)
    await Report.create({
      title: `Attendance Report - ${new Date().toLocaleDateString()}`,
      type: (startDate === endDate) ? 'Daily' : 'Custom',
      generatedBy: req.user._id,
      filters: { startDate, endDate, department, employeeId, status }
    });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export report as Excel
// @route   GET /api/reports/export/excel
// @access  Private
const exportExcelReport = async (req, res) => {
  try {
    const { startDate, endDate, department, employeeId, status } = req.query;

    const query = await buildQuery({ startDate, endDate, department, employeeId, status });
    const records = await Attendance.find(query)
      .populate('employee', 'name employeeId department designation')
      .sort({ dateString: -1, employeeId: 1 });

    // Set headers for download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=attendance_report_${Date.now()}.xlsx`
    );

    await generateExcel(records, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export report as PDF
// @route   GET /api/reports/export/pdf
// @access  Private
const exportPDFReport = async (req, res) => {
  try {
    const { startDate, endDate, department, employeeId, status } = req.query;

    const query = await buildQuery({ startDate, endDate, department, employeeId, status });
    const records = await Attendance.find(query)
      .populate('employee', 'name employeeId department designation')
      .sort({ dateString: -1, employeeId: 1 });

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=attendance_report_${Date.now()}.pdf`
    );

    generatePDF(records, { startDate, endDate, department, status }, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReportData,
  exportExcelReport,
  exportPDFReport
};
