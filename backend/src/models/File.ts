import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
    filename: string;
    filepath: string;
    mimetype: string;
    size: number;
    uploadedBy: mongoose.Types.ObjectId;
    task: mongoose.Types.ObjectId;
    createdAt: Date;
}

const FileSchema: Schema = new Schema({
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
}, { timestamps: true });

export default mongoose.model<IFile>('File', FileSchema);
