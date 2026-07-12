const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Bulk mark attendance
// @route   POST /api/attendance/bulk
// @access  Private/Admin/Teacher/HR
const bulkMarkAttendance = async (req, res) => {
  try {
    const { date, records } = req.body; // date format: YYYY-MM-DD, records: [{ employeeId, status, remarks }]

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Please provide a date and records array' });
    }

    const dateObj = new Date(date);
    const results = [];

    for (const record of records) {
      const { employeeId, status, remarks } = record;

      // Find the employee object
      const employee = await Employee.findOne({ employeeId });
      if (!employee) continue;

      // Upsert attendance record
      const attendance = await Attendance.findOneAndUpdate(
        { dateString: date, employee: employee._id },
        {
          date: dateObj,
          dateString: date,
          employee: employee._id,
          employeeId: employeeId,
          status,
          remarks: remarks || '',
          markedBy: req.user._id
        },
        { upsert: true, new: true, runValidators: true }
      );
      results.push(attendance);
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance by date and department
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const { date, department } = req.query; // date: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide a date parameter' });
    }

    // 1. Get employees in the department (or all if department is omitted/empty)
    let empQuery = { status: 'Active' };
    if (department && department !== 'All') {
      empQuery.department = department;
    }
    const employees = await Employee.find(empQuery);

    // 2. Fetch existing attendance for this date
    const attendanceRecords = await Attendance.find({ dateString: date })
      .populate('employee', 'name department designation');

    // Create a dictionary of current attendance records
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      if (record.employee) {
        attendanceMap[record.employee._id.toString()] = record;
      }
    });

    // 3. Merge: return attendance records for all active employees (prefill status as default 'Present' if not marked)
    const data = employees.map(emp => {
      const existingRecord = attendanceMap[emp._id.toString()];
      return {
        employeeId: emp.employeeId,
        name: emp.name,
        department: emp.department,
        designation: emp.designation,
        status: existingRecord ? existingRecord.status : 'Present', // default if not marked yet
        remarks: existingRecord ? existingRecord.remarks : '',
        isMarked: !!existingRecord,
        attendanceId: existingRecord ? existingRecord._id : null
      };
    });

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance history for an individual employee/student
// @route   GET /api/attendance/employee/:employeeId
// @access  Private
const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Verify requesting user is allowed to access this profile
    // Students/Employees can only see their own attendance
    if (req.user.role === 'Student/Employee' && req.user.employeeId !== employeeId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this record' });
    }

    let query = { employee: employee._id };

    if (startDate || endDate) {
      query.dateString = {};
      if (startDate) query.dateString.$gte = startDate;
      if (endDate) query.dateString.$lte = endDate;
    }

    const records = await Attendance.find(query).sort({ dateString: -1 });

    // Calculate metrics
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const leave = records.filter(r => r.status === 'Leave').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      metrics: { total, present, absent, leave, percentage },
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get general statistics for dashboard
// @route   GET /api/attendance/stats
// @access  Private
const getAttendanceStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalEmployees = await Employee.countDocuments({ status: 'Active' });
    
    // Count for today
    const presentToday = await Attendance.countDocuments({ dateString: today, status: 'Present' });
    const absentToday = await Attendance.countDocuments({ dateString: today, status: 'Absent' });
    const leaveToday = await Attendance.countDocuments({ dateString: today, status: 'Leave' });
    const unmarkedToday = Math.max(0, totalEmployees - (presentToday + absentToday + leaveToday));

    // Department-wise distribution
    const employees = await Employee.find({ status: 'Active' });
    const depts = [...new Set(employees.map(e => e.department))];
    const deptStats = [];

    for (const dept of depts) {
      const deptEmployees = employees.filter(e => e.department === dept);
      const empIds = deptEmployees.map(e => e._id);
      
      const deptPresent = await Attendance.countDocuments({
        dateString: today,
        employee: { $in: empIds },
        status: 'Present'
      });

      deptStats.push({
        department: dept,
        total: deptEmployees.length,
        present: deptPresent,
        percentage: deptEmployees.length > 0 ? ((deptPresent / deptEmployees.length) * 100).toFixed(0) : 0
      });
    }

    res.json({
      success: true,
      data: {
        totalEmployees,
        today: {
          date: today,
          present: presentToday,
          absent: absentToday,
          leave: leaveToday,
          unmarked: unmarkedToday
        },
        departments: deptStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  bulkMarkAttendance,
  getAttendance,
  getEmployeeAttendance,
  getAttendanceStats
};
