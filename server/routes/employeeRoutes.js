const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(authorize('Admin', 'Teacher/HR'), createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(authorize('Admin', 'Teacher/HR'), updateEmployee)
  .delete(authorize('Admin'), deleteEmployee);

module.exports = router;
