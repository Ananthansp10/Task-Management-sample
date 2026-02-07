import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, LogOut, User } from 'lucide-react';
import '../styles/Layout.css';

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Task Manager</h2>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
                        <CheckSquare size={20} /> Tasks
                    </NavLink>
                    {user?.role === 'admin' && (
                        <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
                            <User size={20} /> Users
                        </NavLink>
                    )}
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <User size={16} /> {user?.username}
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
