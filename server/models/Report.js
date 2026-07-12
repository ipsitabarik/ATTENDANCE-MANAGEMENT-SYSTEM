const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Daily', 'Monthly', 'Custom'],
    default: 'Custom'
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filters: {
    startDate: String,
    endDate: String,
    department: String,
    employeeId: String,
    status: String
  },
  filePath: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);
