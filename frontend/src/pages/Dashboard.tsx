import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Dashboard.css';

interface DashboardStats {
    tasks: {
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
    };
    priority: {
        low: number;
        medium: number;
        high: number;
    };
    overdue: number;
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/analytics/dashboard');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (!stats) return <div>Error loading stats</div>;

    return (
        <div className="container dashboard">
            <h1 className="page-title">Dashboard</h1>

            <div className="stats-grid">
                <div className="card stat-card total">
                    <h3>Total Tasks</h3>
                    <div className="value">{stats.tasks.total}</div>
                </div>
                <div className="card stat-card pending">
                    <h3>Pending</h3>
                    <div className="value">{stats.tasks.pending}</div>
                </div>
                <div className="card stat-card progress">
                    <h3>In Progress</h3>
                    <div className="value">{stats.tasks.inProgress}</div>
                </div>
                <div className="card stat-card completed">
                    <h3>Completed</h3>
                    <div className="value">{stats.tasks.completed}</div>
                </div>
            </div>

            <div className="stats-row">
                <div className="card">
                    <h3>Priority Breakdown</h3>
                    <div className="priority-list">
                        <div className="priority-item high">
                            <span>High</span>
                            <span>{stats.priority.high}</span>
                        </div>
                        <div className="priority-item medium">
                            <span>Medium</span>
                            <span>{stats.priority.medium}</span>
                        </div>
                        <div className="priority-item low">
                            <span>Low</span>
                            <span>{stats.priority.low}</span>
                        </div>
                    </div>
                </div>
                <div className="card alert-card">
                    <h3>Attention Needed</h3>
                    <div className="overdue-stat">
                        <span className="label">Overdue Tasks</span>
                        <span className="value">{stats.overdue}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
