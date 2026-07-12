require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance_db');
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing collections.');

    // 1. Create Employees
    const employees = [
      {
        employeeId: 'E001',
        name: 'John Doe',
        email: 'student@attendance.com',
        department: 'Computer Science',
        designation: 'Student',
        phone: '1234567890',
        status: 'Active'
      },
      {
        employeeId: 'E002',
        name: 'Alice Smith',
        email: 'alice.smith@attendance.com',
        department: 'Information Technology',
        designation: 'Assistant Professor',
        phone: '9876543210',
        status: 'Active'
      },
      {
        employeeId: 'E003',
        name: 'Bob Jones',
        email: 'bob.jones@attendance.com',
        department: 'Human Resources',
        designation: 'HR Coordinator',
        phone: '5551234567',
        status: 'Active'
      },
      {
        employeeId: 'E004',
        name: 'Eva Green',
        email: 'eva.green@attendance.com',
        department: 'Marketing',
        designation: 'PR Lead',
        phone: '4449876543',
        status: 'Active'
      },
      {
        employeeId: 'E005',
        name: 'David Vance',
        email: 'david.vance@attendance.com',
        department: 'Computer Science',
        designation: 'Lecturer',
        phone: '8881112222',
        status: 'Active'
      }
    ];

    const createdEmployees = await Employee.create(employees);
    console.log(`Seeded ${createdEmployees.length} employee records.`);

    // 2. Create Users
    const users = [
      {
        name: 'System Admin',
        email: 'admin@attendance.com',
        password: 'admin123', // Will be hashed via pre-save hook
        role: 'Admin',
        employeeId: null
      },
      {
        name: 'Sarah Teacher',
        email: 'teacher@attendance.com',
        password: 'teacher123',
        role: 'Teacher/HR',
        employeeId: null
      },
      {
        name: 'John Doe (Student)',
        email: 'student@attendance.com',
        password: 'student123',
        role: 'Student/Employee',
        employeeId: 'E001' // Mapped to John Doe employee record
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`Seeded ${createdUsers.length} user accounts.`);

    // 3. Create Sample Attendance Records
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    const todayString = new Date().toISOString().split('T')[0];

    // Seed yesterday's attendance
    const attendanceRecords = [
      {
        date: yesterday,
        dateString: yesterdayString,
        employee: createdEmployees[0]._id, // John Doe
        employeeId: 'E001',
        status: 'Present',
        remarks: 'On time',
        markedBy: createdUsers[1]._id // Sarah Teacher
      },
      {
        date: yesterday,
        dateString: yesterdayString,
        employee: createdEmployees[1]._id, // Alice Smith
        employeeId: 'E002',
        status: 'Absent',
        remarks: 'Sick leave requested',
        markedBy: createdUsers[1]._id
      },
      {
        date: yesterday,
        dateString: yesterdayString,
        employee: createdEmployees[2]._id, // Bob Jones
        employeeId: 'E003',
        status: 'Present',
        remarks: '',
        markedBy: createdUsers[1]._id
      },
      {
        date: yesterday,
        dateString: yesterdayString,
        employee: createdEmployees[3]._id, // Eva Green
        employeeId: 'E004',
        status: 'Leave',
        remarks: 'Annual Leave Approved',
        markedBy: createdUsers[1]._id
      },
      {
        date: yesterday,
        dateString: yesterdayString,
        employee: createdEmployees[4]._id, // David Vance
        employeeId: 'E005',
        status: 'Present',
        remarks: '',
        markedBy: createdUsers[1]._id
      }
    ];

    // Seed today's attendance (partial)
    const todayRecords = [
      {
        date: new Date(),
        dateString: todayString,
        employee: createdEmployees[0]._id,
        employeeId: 'E001',
        status: 'Present',
        remarks: '',
        markedBy: createdUsers[1]._id
      },
      {
        date: new Date(),
        dateString: todayString,
        employee: createdEmployees[1]._id,
        employeeId: 'E002',
        status: 'Present',
        remarks: 'Recovered',
        markedBy: createdUsers[1]._id
      },
      {
        date: new Date(),
        dateString: todayString,
        employee: createdEmployees[2]._id,
        employeeId: 'E003',
        status: 'Present',
        remarks: '',
        markedBy: createdUsers[1]._id
      }
    ];

    await Attendance.create([...attendanceRecords, ...todayRecords]);
    console.log('Seeded sample attendance logs.');

    console.log('Database seeding successfully finished!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
