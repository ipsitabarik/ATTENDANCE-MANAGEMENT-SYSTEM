import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="spinner-text">Checking role authorizations...</p>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
