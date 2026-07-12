const express = require('express');
const router = express.Router();
const {
  getReportData,
  exportExcelReport,
  exportPDFReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('Admin', 'Teacher/HR'));

router.get('/', getReportData);
router.get('/export/excel', exportExcelReport);
router.get('/export/pdf', exportPDFReport);

module.exports = router;
