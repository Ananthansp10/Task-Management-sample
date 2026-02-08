import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import type { ToastType } from '../context/ToastContext';
import '../styles/Toast.css';

const Toast = () => {
    const { toasts, removeToast } = useToast();

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <XCircle size={20} />;
            case 'warning':
                return <AlertTriangle size={20} />;
            case 'info':
            default:
                return <Info size={20} />;
        }
    };

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <div className="toast-icon">
                        {getIcon(toast.type)}
                    </div>
                    <div className="toast-message">{toast.message}</div>
                    <button
                        className="toast-close"
                        onClick={() => removeToast(toast.id)}
                        aria-label="Close notification"
                    >
                        <X size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;
