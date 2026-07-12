import axios from 'axios';

const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data;
};

const register = async (name, email, password, role, employeeId) => {
  const response = await axios.post('/api/auth/register', { name, email, password, role, employeeId });
  return response.data;
};

const getMe = async () => {
  const response = await axios.get('/api/auth/me');
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await axios.put('/api/auth/profile', profileData);
  return response.data;
};

export default {
  login,
  register,
  getMe,
  updateProfile
};
