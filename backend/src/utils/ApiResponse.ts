import { Response } from 'express';

export class ApiResponse {
    constructor(
        public statusCode: number,
        public data: any,
        public message: string = "Operation successful"
    ) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export const sendResponse = (res: Response, statusCode: number, message: string, data: any = null) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        statusCode,
        message,
        data,
    });
};
