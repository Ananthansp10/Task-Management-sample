import mongoose, { Schema, Document } from 'mongoose';

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export interface ITask extends Document {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    assignedTo?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    comments: any[];
    attachments: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [CommentSchema],
    attachments: [{ type: Schema.Types.ObjectId, ref: 'File' }],
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
