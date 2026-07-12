const express = require('express');
const router = express.Router();
const {
  bulkMarkAttendance,
  getAttendance,
  getEmployeeAttendance,
  getAttendanceStats
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/stats', getAttendanceStats);
router.get('/employee/:employeeId', getEmployeeAttendance);

// Only Admin and Teacher/HR can fetch general day sheets or submit marks
router.route('/')
  .get(authorize('Admin', 'Teacher/HR'), getAttendance);

router.post('/bulk', authorize('Admin', 'Teacher/HR'), bulkMarkAttendance);

module.exports = router;
