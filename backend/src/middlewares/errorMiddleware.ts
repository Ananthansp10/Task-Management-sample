import { Request, Response, NextFunction } from 'express';
import { MESSAGES } from '../constants/messages';
import { STATUS_CODES } from '../constants/statusCodes';
import { sendResponse } from '../utils/ApiResponse';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? STATUS_CODES.INTERNAL_SERVER_ERROR : res.statusCode;
    console.error(err.stack);
    sendResponse(res, statusCode, err.message || MESSAGES.SERVER_ERROR, process.env.NODE_ENV === 'production' ? null : err.stack);
};
