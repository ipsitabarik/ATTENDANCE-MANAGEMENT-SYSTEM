<div align="center">
  <h1>📅 Attendance Management System</h1>
  <p>
    <strong>A full-stack Attendance Management System built with the MERN stack for efficient attendance tracking, role-based management, and report generation.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&amp;logo=mongodb&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&amp;logo=express&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&amp;logo=react&amp;logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&amp;logo=nodedotjs&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&amp;logo=vite&amp;logoColor=FFD62E" />
  </p>
</div>

<br />

## 🌟 Overview

**Attendance Management System** is a modern full-stack web application developed using the **MERN Stack**. It provides secure role-based access for **Administrators**, **Teachers/HR**, and **Students/Employees**, allowing organizations and educational institutions to efficiently manage attendance records.

The system includes secure authentication, daily attendance management, analytics dashboards, Excel/PDF report generation, and a responsive user interface designed for real-world usage.

---

## 🚀 Key Features

- 🔐 **JWT Authentication** – Secure login & registration
- 👥 **Role-Based Access Control** – Admin, Teacher/HR & Student dashboards
- 📅 **Attendance Management** – Mark Present, Absent & Leave
- 📊 **Statistics Dashboard** – Attendance insights and analytics
- 📄 **Excel Export** – Download attendance reports as Excel files
- 📑 **PDF Report Generation** – Printable attendance reports
- 🔍 **Advanced Filtering** – Filter records by date, department, employee, and status
- 📝 **Remarks Support** – Add comments for attendance entries
- 📱 **Responsive Design** – Works across desktop, tablet, and mobile devices

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- Vite
- Vanilla CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- BcryptJS
- ExcelJS
- PDFKit

---

## 📁 Project Structure

```text
ATTENDANCE-MANAGEMENT-SYSTEM/
├── client/                         # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/             # Shared Components
│       ├── context/                # Authentication Context
│       ├── pages/                  # Dashboard & Pages
│       ├── services/               # API Services
│       ├── styles/                 # Custom Styling
│       ├── utils/                  # Helper Functions
│       ├── App.jsx
│       └── main.jsx
│
├── server/                         # Express Backend
│   ├── config/                     # Database Configuration
│   ├── controllers/                # Controllers
│   ├── middleware/                 # Authentication Middleware
│   ├── models/                     # MongoDB Models
│   ├── routes/                     # API Routes
│   ├── utils/                      # Excel & PDF Utilities
│   ├── seed.js                     # Database Seeder
│   ├── .env
│   └── server.js
│
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/attendance-management-system.git
cd attendance-management-system
```

---

### 2️⃣ Install Dependencies

Install all project dependencies:

```bash
npm run install-all
```

---

### 3️⃣ Configure Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=your port name
MONGO_URI=your mongodb url
JWT_SECRET=your_secret_key
JWT_EXPIRE=your expire day
NODE_ENV=development
```

---

### 4️⃣ Seed the Database

Populate the database with sample data.

```bash
npm run seed
```

---

### 5️⃣ Start the Development Server

Run both frontend and backend together.

```bash
npm run dev
```

The application will be available at:

```text
Frontend : http://localhost:3000
Backend  : http://localhost:5000
```

---

## 👤 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@attendance.com | admin123 |
| 👨‍🏫 Teacher / HR | teacher@attendance.com | teacher123 |
| 👨‍🎓 Student / Employee | student@attendance.com | student123 |

---

## 🖥️ System Modules

- 👥 User Authentication
- 🏢 Employee Management
- 📅 Attendance Marking
- 📊 Dashboard Analytics
- 📄 Report Generation
- 📑 Excel Export
- 📕 PDF Export
- ⚙️ Profile Management

---

## 🔒 Security Features

- 🔑 JWT Authentication
- 🔐 Password Encryption using BcryptJS
- 🛡️ Protected Routes
- 👥 Role-Based Authorization
- 🔒 Secure API Endpoints

---

## 🔮 Future Enhancements

- 📱 Mobile Application
- 📷 Face Recognition Attendance
- 📍 GPS-based Attendance
- 🔔 Email & SMS Notifications
- ☁️ Cloud Deployment
- 📊 Advanced Analytics Dashboard
- 🌐 Multi-language Support
- 🧠 AI Attendance Insights

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a branch (`feature/new-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 👨‍💻 Author

**Himanshu Kumar Rout**

- GitHub: https://github.com/HimanshuKumarRout
- Email: himanshurout136@gmail.com

---

## ⭐ Support

If you like this project, please **star ⭐ the repository** and share it!

---

<p align="center">Built with ❤️ using the MERN Stack for efficient attendance management.</p>