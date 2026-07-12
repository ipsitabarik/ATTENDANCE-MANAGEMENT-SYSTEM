import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Import Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/portal/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import Attendance from './pages/portal/Attendance';
import Reports from './pages/portal/Reports';
import Profile from './pages/portal/Profile';

// Import Components
import ProtectedRoute from './components/routes/ProtectedRoute';
import RoleRoute from './components/routes/RoleRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Layout wrapper for pages inside the portal
const PortalLayout = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container-inner" style={{ width: '100%' }}>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Portal Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <Dashboard />
                </PortalLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['Admin', 'Teacher/HR']}>
                  <PortalLayout>
                    <Attendance />
                  </PortalLayout>
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['Admin', 'Teacher/HR']}>
                  <PortalLayout>
                    <Reports />
                  </PortalLayout>
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/manage-users" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['Admin']}>
                  <PortalLayout>
                    <ManageUsers />
                  </PortalLayout>
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <Profile />
                </PortalLayout>
              </ProtectedRoute>
            } 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
