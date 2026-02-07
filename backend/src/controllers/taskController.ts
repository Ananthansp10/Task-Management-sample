import { Request, Response, NextFunction } from 'express';
import Task from '../models/Task';
import '../models/File'; // Register File model for populate
import { MESSAGES } from '../constants/messages';
import { STATUS_CODES } from '../constants/statusCodes';
import { sendResponse } from '../utils/ApiResponse';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, status, priority, dueDate, assignedTo, attachments } = req.body;
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            attachments,
            createdBy: (req as any).user._id,
        });


        if (attachments && attachments.length > 0) {
            await (require('../models/File').default).updateMany(
                { _id: { $in: attachments } },
                { $set: { task: task._id } }
            );
        }

        sendResponse(res, STATUS_CODES.CREATED, MESSAGES.TASK_CREATED, task);
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, priority, search, page = 1, limit = 10, sort_by = 'createdAt', order = 'desc' } = req.query;

        const query: any = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email')
            .sort({ [sort_by as string]: order === 'desc' ? -1 : 1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Task.countDocuments(query);

        sendResponse(res, STATUS_CODES.OK, 'Tasks fetched successfully', { tasks, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email')
            .populate('comments.user', 'username')
            .populate('attachments');

        if (!task) {
            return sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.TASK_NOT_FOUND);
        }
        sendResponse(res, STATUS_CODES.OK, 'Task details', task);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { attachments } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.TASK_NOT_FOUND);
        }


        if (attachments && attachments.length > 0) {
            await (require('../models/File').default).updateMany(
                { _id: { $in: attachments } },
                { $set: { task: task._id } }
            );
        }

        sendResponse(res, STATUS_CODES.OK, MESSAGES.TASK_UPDATED, task);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.TASK_NOT_FOUND);
        }
        sendResponse(res, STATUS_CODES.OK, MESSAGES.TASK_DELETED);
    } catch (error) {
        next(error);
    }
};

export const createTasksBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = req.body.map((task: any) => ({
            ...task,
            createdBy: (req as any).user._id
        }));
        await Task.insertMany(tasks);
        sendResponse(res, STATUS_CODES.CREATED, 'Tasks bulk created successfully');
    } catch (error) {
        next(error);
    }
};
