import axios from 'axios';

const getUsers = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await axios.post('/api/users', userData);
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await axios.put(`/api/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await axios.delete(`/api/users/${id}`);
  return response.data;
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
