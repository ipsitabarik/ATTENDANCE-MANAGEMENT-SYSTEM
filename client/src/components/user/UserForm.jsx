import React, { useState, useEffect } from 'react';
import { DEPARTMENTS } from '../../utils/helpers';

const UserForm = ({ mode, entityType, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    // User account fields
    name: '',
    email: '',
    password: '',
    role: 'Student/Employee',
    employeeId: '',
    
    // Employee record fields
    department: 'Computer Science',
    designation: 'Student',
    phone: '',
    status: 'Active'
  });

  const [error, setError] = useState('');

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        password: '' // Never prefill passwords
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (entityType === 'user') {
      if (mode === 'create' && !formData.password) {
        setError('Password is required for new accounts');
        return;
      }
      if (formData.password && formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    } else {
      if (!formData.employeeId) {
        setError('Employee ID is required');
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {mode === 'create' ? 'Add New' : 'Edit'}{' '}
            {entityType === 'user' ? 'User Login Account' : 'Employee/Student File'}
          </h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-input" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Entity-specific forms */}
            {entityType === 'user' ? (
              <>
                <div className="form-group">
                  <label className="form-label">
                    Password {mode === 'edit' && '(Leave blank to keep unchanged)'}
                  </label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-input" 
                    value={formData.password}
                    onChange={handleChange}
                    required={mode === 'create'} 
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">System Role</label>
                    <select 
                      name="role" 
                      className="form-input" 
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="Student/Employee">Student / Employee</option>
                      <option value="Teacher/HR">Teacher / HR Manager</option>
                      <option value="Admin">System Admin</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mapped Employee ID (Optional)</label>
                    <input 
                      type="text" 
                      name="employeeId" 
                      placeholder="e.g. E001" 
                      className="form-input" 
                      value={formData.employeeId || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Employee / Student ID</label>
                    <input 
                      type="text" 
                      name="employeeId" 
                      placeholder="e.g. E001" 
                      className="form-input" 
                      value={formData.employeeId}
                      onChange={handleChange}
                      disabled={mode === 'edit'}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      className="form-input" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select 
                      name="department" 
                      className="form-input" 
                      value={formData.department}
                      onChange={handleChange}
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Designation / Title</label>
                    <input 
                      type="text" 
                      name="designation" 
                      placeholder="e.g. Student, Lead Dev" 
                      className="form-input" 
                      value={formData.designation}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Record Status</label>
                  <select 
                    name="status" 
                    className="form-input" 
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {mode === 'create' ? 'Save Record' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
