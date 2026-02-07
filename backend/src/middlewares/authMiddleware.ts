import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { MESSAGES } from '../constants/messages';
import { STATUS_CODES } from '../constants/statusCodes';
import { sendResponse } from '../utils/ApiResponse';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password') as IUser;
            next();
        } catch (error) {
            sendResponse(res, STATUS_CODES.UNAUTHORIZED, MESSAGES.UNAUTHORIZED_ACCESS);
        }
    } else {
        sendResponse(res, STATUS_CODES.UNAUTHORIZED, MESSAGES.UNAUTHORIZED_ACCESS);
    }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        sendResponse(res, STATUS_CODES.FORBIDDEN, MESSAGES.UNAUTHORIZED_ACCESS);
    }
};
