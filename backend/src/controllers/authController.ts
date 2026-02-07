import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { MESSAGES } from '../constants/messages';
import { STATUS_CODES } from '../constants/statusCodes';
import { sendResponse } from '../utils/ApiResponse';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'User already exists');
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            const token = generateToken(user._id.toString());
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            sendResponse(res, STATUS_CODES.CREATED, MESSAGES.REGISTER_SUCCESS, {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            });
        } else {
            sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id.toString());
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGIN_SUCCESS, {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            });
        } else {
            sendResponse(res, STATUS_CODES.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
        }
    } catch (error) {
        next(error);
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGOUT_SUCCESS);
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById((req as any).user._id);
        if (user) {
            sendResponse(res, STATUS_CODES.OK, 'User profile', {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            });
        } else {
            sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }
    } catch (error) {
        next(error);
    }
};
