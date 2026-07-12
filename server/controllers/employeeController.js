const Employee = require('../models/Employee');

// @desc    Get all employees/students
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
  try {
    const { department, status, search } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query).sort({ employeeId: 1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin/Teacher/HR
const createEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, department, designation, phone, dateOfJoining, status } = req.body;

    const employeeExists = await Employee.findOne({ employeeId });
    if (employeeExists) {
      return res.status(400).json({ success: false, message: `Employee ID ${employeeId} already exists` });
    }

    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: `Email ${email} is already associated with an employee` });
    }

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      department,
      designation,
      phone,
      dateOfJoining,
      status: status || 'Active'
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin/Teacher/HR
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Check unique employeeId if updated
    if (req.body.employeeId && req.body.employeeId !== employee.employeeId) {
      const idExists = await Employee.findOne({ employeeId: req.body.employeeId });
      if (idExists) {
        return res.status(400).json({ success: false, message: `Employee ID ${req.body.employeeId} already exists` });
      }
    }

    // Check unique email if updated
    if (req.body.email && req.body.email !== employee.email) {
      const emailExists = await Employee.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: `Email ${req.body.email} is already in use` });
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Employee and user mapping removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
