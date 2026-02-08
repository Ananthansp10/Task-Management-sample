import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import '../styles/Tasks.css';

const TaskForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const [attachments, setAttachments] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (isEditMode) {
            const fetchTask = async () => {
                try {
                    const response = await api.get(`/tasks/${id}`);
                    if (response.data.success) {
                        const task = response.data.data;
                        console.log("Fetched task data:", task);
                        setFormData({
                            title: task.title,
                            description: task.description || '',
                            status: task.status,
                            priority: task.priority,
                            due_date: task.dueDate ? task.dueDate.split('T')[0] : '',
                        });
                        setAttachments(task.attachments || []);
                    }
                } catch (err) {
                    console.error("Failed to fetch task", err);
                    setGeneralError("Failed to load task details");
                }
            };
            fetchTask();
        }
    }, [id, isEditMode]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        } else if (formData.title.trim().length > 100) {
            newErrors.title = 'Title must not exceed 100 characters';
        }

        // Description validation (optional but with max length)
        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description must not exceed 500 characters';
        }

        // Due date validation
        if (!formData.due_date) {
            newErrors.due_date = 'Due date is required';
        } else {
            const selectedDate = new Date(formData.due_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.due_date = 'Due date cannot be in the past';
            }
        }

        // Status validation
        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        // Priority validation
        if (!formData.priority) {
            newErrors.priority = 'Priority is required';
        }

        setErrors(newErrors);

        // Show toast for validation errors
        if (Object.keys(newErrors).length > 0) {
            showToast('Please fix the validation errors', 'error');
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const data = new FormData();
            data.append('file', file);

            setUploading(true);
            try {
                const response = await api.post('/upload', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data.success) {
                    setAttachments([...attachments, response.data.data]);
                    showToast('File uploaded successfully', 'success');
                }
            } catch (err) {
                console.error("File upload failed", err);
                const errorMessage = "File upload failed";
                setGeneralError(errorMessage);
                showToast(errorMessage, 'error');
            } finally {
                setUploading(false);

                e.target.value = '';
            }
        }
    };

    const removeAttachment = (index: number) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');
        if (!validate()) return;

        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                dueDate: formData.due_date,
                attachments: attachments.map(f => f._id),
            };

            if (isEditMode) {
                await api.put(`/tasks/${id}`, payload);
                showToast('Task updated successfully!', 'success');
            } else {
                await api.post('/tasks', payload);
                showToast('Task created successfully!', 'success');
            }
            navigate('/tasks');
        } catch (err: any) {
            console.error("Failed to save task", err);
            const errorMessage = err.response?.data?.message || "Failed to save task";
            setGeneralError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    return (
        <div className="container task-form-page">
            <h1 className="page-title">{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>

            <div className="card form-card">
                {generalError && <div className="error-message general-error">{generalError}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && <div className="error-message">{errors.title}</div>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Enter task description (optional)"
                        />
                        {errors.description && <div className="error-message">{errors.description}</div>}
                    </div>

                    <div className="row">
                        <div className="form-group col">
                            <label>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            {errors.status && <div className="error-message">{errors.status}</div>}
                        </div>

                        <div className="form-group col">
                            <label>Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            {errors.priority && <div className="error-message">{errors.priority}</div>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Due Date</label>
                        <input
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                        />
                        {errors.due_date && <div className="error-message">{errors.due_date}</div>}
                    </div>

                    <div className="form-group">
                        <label>Attachments</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        {uploading && <span className="uploading-text">Uploading...</span>}

                        {attachments.length > 0 && (
                            <ul className="attachment-list">
                                {attachments.map((file, index) => (
                                    <li key={index} className="attachment-item">
                                        <a href={`http://localhost:5000/${file.filepath}`} target="_blank" rel="noopener noreferrer">
                                            {file.filename}
                                        </a>
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeAttachment(index)}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/tasks')} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || uploading}>
                            {loading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
