import axios from 'axios';

const getEmployees = async (params = {}) => {
  const response = await axios.get('/api/employees', { params });
  return response.data;
};

const getEmployeeById = async (id) => {
  const response = await axios.get(`/api/employees/${id}`);
  return response.data;
};

const createEmployee = async (employeeData) => {
  const response = await axios.post('/api/employees', employeeData);
  return response.data;
};

const updateEmployee = async (id, employeeData) => {
  const response = await axios.put(`/api/employees/${id}`, employeeData);
  return response.data;
};

const deleteEmployee = async (id) => {
  const response = await axios.delete(`/api/employees/${id}`);
  return response.data;
};

export default {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
