import api from './api';

export const userService = {
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data.users || response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch users');
    }
  },

  updateRole: async (userId, role) => {
    try{
      const response = await api.put(`/users/${userId}/role?role=${role}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update role');
    }
  },

  delete: async (userId) => {
    try{
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete user');
    } 
  },
};
