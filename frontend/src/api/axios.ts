import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend runs on different port
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
});

// Response interceptor to handle 401 (Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Redirect to login or clear state if needed
            // But usually handled by AuthContext checking /me endpoint failure
        }
        return Promise.reject(error);
    }
);

export default api;
