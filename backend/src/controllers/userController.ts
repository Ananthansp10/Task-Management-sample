import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { MESSAGES } from '../constants/messages';
import { STATUS_CODES } from '../constants/statusCodes';
import { sendResponse } from '../utils/ApiResponse';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().select('-password');
        sendResponse(res, STATUS_CODES.OK, MESSAGES.USERS_FETCHED, users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }
        sendResponse(res, STATUS_CODES.OK, MESSAGES.USER_FETCHED, user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) {
            return sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        sendResponse(res, STATUS_CODES.OK, MESSAGES.USER_UPDATED, user);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }
        sendResponse(res, STATUS_CODES.OK, MESSAGES.USER_DELETED);
    } catch (error) {
        next(error);
    }
};
