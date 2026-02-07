import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import api from '../api/axios';
import '../styles/Tasks.css';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    assignedTo: { username: string } | null;
}

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            if (filterPriority) params.append('priority', filterPriority);
            if (searchTerm) params.append('search', searchTerm);

            const response = await api.get(`/tasks?${params.toString()}`);
            if (response.data.success) {
                setTasks(response.data.data.tasks);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filterStatus, filterPriority]); // Debounce search for better UX in real app

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTasks();
    };

    return (
        <div className="container task-list-page">
            <div className="page-header">
                <h1>Tasks</h1>
                <Link to="/tasks/new" className="btn-primary">
                    <Plus size={18} /> New Task
                </Link>
            </div>

            <div className="filters-bar card">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit"><Search size={18} /></button>
                </form>
                <div className="filters">
                    <div className="filter-group">
                        <Filter size={16} />
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div>Loading tasks...</div>
            ) : (
                <div className="task-grid">
                    {tasks.map(task => (
                        <div key={task._id} className={`card task-card priority-${task.priority}`}>
                            <div className="task-header">
                                <span className={`status-badge ${task.status}`}>{task.status}</span>
                                <span className="priority-badge">{task.priority}</span>
                            </div>
                            <h3>{task.title}</h3>
                            <p className="task-desc">{task.description}</p>

                            <div className="task-meta">
                                {task.assignedTo && <span className="assignee">@{task.assignedTo.username}</span>}
                                {task.dueDate && <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                            </div>

                            <div className="task-actions">
                                <Link to={`/tasks/${task._id}`} className="icon-btn edit">
                                    <Edit2 size={16} />
                                </Link>
                                <button onClick={() => handleDelete(task._id)} className="icon-btn delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && <div className="no-tasks">No tasks found.</div>}
                </div>
            )}
        </div>
    );
};

export default TaskList;
