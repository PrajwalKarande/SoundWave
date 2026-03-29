
import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || response.data);
    } catch (err) {
      setError('Failed to fetch users',err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role?role=${newRole}`);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setError('Failed to update role',err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('Failed to delete user',err.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen w-full text-primary-text">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-primary-bg w-full rounded-2xl mx-2">
      <nav className="bg-section-bg rounded-2xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-accent">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-primary-text">
                {user?.username} <span className="text-accent font-semibold">(ADMIN)</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Quick Actions */}
          <div className="mb-6 flex space-x-4">
            <button
              onClick={() => navigate('/admin/upload')}
              className="bg-accent hover:bg-accent/80 text-primary-bg font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Upload Song
            </button>
            <button className="bg-section-bg hover:bg-section-bg/80 text-primary-text font-semibold px-6 py-3 rounded-lg transition-colors">
              Manage Songs
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-primary-text">User Management</h2>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-section-bg shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-muted-text/20">
              <thead className="bg-primary-bg/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-section-bg divide-y divide-muted-text/20">
                {users.map((userItem) => (
                  <tr key={userItem._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text">
                      {userItem.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-text">
                      {userItem.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={userItem.role}
                        onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                        className="text-sm border border-muted-text/30 rounded px-2 py-1 bg-primary-bg text-primary-text"
                        disabled={userItem.email === user?.email}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-text">
                      <button
                        onClick={() => handleDeleteUser(userItem.id)}
                        disabled={userItem.email === user?.email}
                        className="text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;