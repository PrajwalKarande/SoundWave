import { useEffect, useState } from "react";
import api from "../../Services/api";
import { useAuth } from "../../Context/AuthContextProvider";

export default function UserManagement() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.users || response.data);
        } catch (err) {
            setError('Failed to fetch users', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role?role=${newRole}`);
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            setSuccess('Role updated successfully');
        } catch (err) {
            setError('Failed to update role', err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            setSuccess('User deleted successfully');
        } catch (err) {
            setError('Failed to delete user', err.message);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen w-full text-primary-text">Loading...</div>;
    }

    return (
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">

                <h2 className="text-2xl font-bold mb-6 text-primary-text">User Management</h2>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded mb-4">
                        {success}
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
                                            onChange={(e) => handleRoleChange(userItem._id, e.target.value)}
                                            className="text-sm border border-muted-text/30 rounded px-2 py-1 bg-primary-bg text-primary-text"
                                            disabled={userItem.email === user?.email}
                                        >
                                            <option value="user">USER</option>
                                            <option value="admin">ADMIN</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-text">
                                        <button
                                            onClick={() => handleDeleteUser(userItem._id)}
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
    )
}