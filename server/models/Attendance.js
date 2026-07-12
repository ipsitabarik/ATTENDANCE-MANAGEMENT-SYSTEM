const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  dateString: {
    type: String,
    required: true // Format: YYYY-MM-DD
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],
    required: [true, 'Please specify attendance status']
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure an employee can only have one attendance record per day
AttendanceSchema.index({ dateString: 1, employee: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
