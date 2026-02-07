import { Request, Response, NextFunction } from 'express';
import File from '../models/File'; // Ensure File model is imported
import { STATUS_CODES } from '../constants/statusCodes';
import { sendResponse } from '../utils/ApiResponse';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'No file uploaded');
        }

        const { filename, path: filepath, mimetype, size } = req.file;



        const newFile = await File.create({
            filename,
            filepath,
            mimetype,
            size,
            uploadedBy: (req as any).user._id,

        });

        sendResponse(res, STATUS_CODES.CREATED, 'File uploaded successfully', newFile);
    } catch (error) {
        next(error);
    }
};
