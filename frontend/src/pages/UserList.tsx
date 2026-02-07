import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Users.css';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                if (response.data.success) {
                    setUsers(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.role === 'admin') {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            await api.put(`/users/${id}`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Failed to update user role", error);
        }
    };

    if (currentUser?.role !== 'admin') {
        return <div className="container">Access Denied. Admin only.</div>;
    }

    return (
        <div className="container user-list-page">
            <h1 className="page-title">User Management</h1>

            {loading ? (
                <div>Loading users...</div>
            ) : (
                <div className="card">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="role-select"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="icon-btn delete"
                                            disabled={user._id === currentUser?._id}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;
