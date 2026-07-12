import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import employeeService from '../../services/employeeService';
import UserTable from '../../components/user/UserTable';
import UserForm from '../../components/user/UserForm';

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' or 'user'
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, employeesRes] = await Promise.all([
        userService.getUsers(),
        employeeService.getEmployees()
      ]);

      if (usersRes.success) setUsers(usersRes.data);
      if (employeesRes.success) setEmployees(employeesRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data directory. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setError('');
    setSuccess('');
    try {
      if (activeTab === 'user') {
        if (modalMode === 'create') {
          const res = await userService.createUser(formData);
          if (res.success) {
            setSuccess('User account created successfully!');
            setUsers(prev => [res.data, ...prev]);
          }
        } else {
          const res = await userService.updateUser(editingItem._id, formData);
          if (res.success) {
            setSuccess('User account updated successfully!');
            setUsers(prev => prev.map(u => u._id === editingItem._id ? res.data : u));
          }
        }
      } else {
        // Employee logic
        if (modalMode === 'create') {
          const res = await employeeService.createEmployee(formData);
          if (res.success) {
            setSuccess('Employee file added successfully!');
            setEmployees(prev => [res.data, ...prev]);
          }
        } else {
          const res = await employeeService.updateEmployee(editingItem._id, formData);
          if (res.success) {
            setSuccess('Employee record updated successfully!');
            setEmployees(prev => prev.map(e => e._id === editingItem._id ? res.data : e));
          }
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
    
    setError('');
    setSuccess('');
    try {
      if (activeTab === 'user') {
        const res = await userService.deleteUser(id);
        if (res.success) {
          setSuccess('User account deleted.');
          setUsers(prev => prev.filter(u => u._id !== id));
        }
      } else {
        const res = await employeeService.deleteEmployee(id);
        if (res.success) {
          setSuccess('Employee record deleted.');
          setEmployees(prev => prev.filter(e => e._id !== id));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Delete operation failed.');
    }
  };

  return (
    <div className="manage-users-page">
      <div className="page-header">
        <div className="page-title">
          <h1>System Directory</h1>
          <p>Manage employee profiles and system login credentials.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>
          </svg>
          Add {activeTab === 'user' ? 'User' : 'Employee'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'employee' ? 'active' : ''}`}
          onClick={() => setActiveTab('employee')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          Employee Directory ({employees.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Portal Accounts ({users.length})
        </button>
      </div>

      <div className="tab-pane">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-text">Syncing directories...</p>
          </div>
        ) : (
          <UserTable 
            type={activeTab} 
            data={activeTab === 'user' ? users : employees}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <UserForm 
          mode={modalMode}
          entityType={activeTab}
          initialData={editingItem}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <style>{`
        .tabs-header {
          display: flex;
          border-bottom: 2px solid var(--surface-border);
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .tab-btn {
          background: transparent;
          border: none;
          padding: 0.75rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--primary);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--primary);
        }

        .tab-pane {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;
