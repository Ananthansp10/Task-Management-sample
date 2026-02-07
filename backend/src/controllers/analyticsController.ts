import { Request, Response, NextFunction } from 'express';
import Task from '../models/Task';
import { MESSAGES } from '../constants/messages';
import { STATUS_CODES } from '../constants/statusCodes';
import { sendResponse } from '../utils/ApiResponse';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: 'pending' });
        const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
        const completedTasks = await Task.countDocuments({ status: 'completed' });

        const lowPriority = await Task.countDocuments({ priority: 'low' });
        const mediumPriority = await Task.countDocuments({ priority: 'medium' });
        const highPriority = await Task.countDocuments({ priority: 'high' });

        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });

        const stats = {
            tasks: {
                total: totalTasks,
                pending: pendingTasks,
                inProgress: inProgressTasks,
                completed: completedTasks,
            },
            priority: {
                low: lowPriority,
                medium: mediumPriority,
                high: highPriority,
            },
            overdue: overdueTasks
        };

        sendResponse(res, STATUS_CODES.OK, MESSAGES.DASHBOARD_STATS_FETCHED, stats);
    } catch (error) {
        next(error);
    }
};
