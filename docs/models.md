# Data Models

This document describes the data models used in the Task Management API.

## User Model

### Schema

```typescript
{
  _id: ObjectId,
  username: string,
  email: string,           // unique
  password: string,        // hashed with bcrypt
  role: 'admin' | 'user',  // default: 'user'
  createdAt: Date,
  updatedAt: Date
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique identifier |
| username | string | Yes | User's display name |
| email | string | Yes | User's email (unique) |
| password | string | Yes | Hashed password (bcrypt, 10 rounds) |
| role | string | No | User role: `admin` or `user` (default: `user`) |
| createdAt | Date | Auto | Account creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

### Notes

- Passwords are automatically hashed before storage
- Email must be unique across all users
- Password field is excluded from query results for security
- Timestamps are automatically managed by MongoDB

---

## Task Model

### Schema

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  status: 'pending' | 'in-progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  assignedTo: ObjectId,    // ref: User
  createdBy: ObjectId,     // ref: User
  comments: [
    {
      user: ObjectId,      // ref: User
      content: string,
      createdAt: Date
    }
  ],
  attachments: [ObjectId], // ref: File
  createdAt: Date,
  updatedAt: Date
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique identifier |
| title | string | Yes | Task title |
| description | string | No | Detailed description |
| status | string | No | Task status (default: `pending`) |
| priority | string | No | Task priority (default: `medium`) |
| dueDate | Date | No | Due date for the task |
| assignedTo | ObjectId | No | User assigned to the task |
| createdBy | ObjectId | Yes | User who created the task |
| comments | Array | Auto | Array of comment objects |
| attachments | Array | No | Array of File IDs |
| createdAt | Date | Auto | Task creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

### Status Values

- `pending` - Task not started
- `in-progress` - Task is being worked on
- `completed` - Task is finished

### Priority Values

- `low` - Low priority task
- `medium` - Medium priority task (default)
- `high` - High priority task

### Comment Schema

Each comment in the `comments` array has:

| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | User who made the comment (ref: User) |
| content | string | Comment text |
| createdAt | Date | Comment timestamp |

### Relationships

- `assignedTo` → References User model
- `createdBy` → References User model
- `comments.user` → References User model
- `attachments` → References File model (array)

---

## File Model

### Schema

```typescript
{
  _id: ObjectId,
  filename: string,
  filepath: string,
  mimetype: string,
  size: number,
  uploadedBy: ObjectId,    // ref: User
  task: ObjectId,          // ref: Task
  createdAt: Date,
  updatedAt: Date
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique identifier |
| filename | string | Yes | Original filename |
| filepath | string | Yes | Server file path |
| mimetype | string | Yes | MIME type (e.g., `application/pdf`) |
| size | number | Yes | File size in bytes |
| uploadedBy | ObjectId | Yes | User who uploaded the file |
| task | ObjectId | No | Associated task (set when task is created/updated) |
| createdAt | Date | Auto | Upload timestamp |
| updatedAt | Date | Auto | Last update timestamp |

### Relationships

- `uploadedBy` → References User model
- `task` → References Task model

### Notes

- Files are stored on disk in the `uploads/` directory
- Filepath includes timestamp prefix to avoid conflicts
- File metadata is stored in MongoDB
- Files can be accessed via `/uploads/<filename>` URL

---

## Relationship Diagram

```
User
 ├─ Created Tasks (Task.createdBy)
 ├─ Assigned Tasks (Task.assignedTo)
 ├─ Comments (Task.comments.user)
 └─ Uploaded Files (File.uploadedBy)

Task
 ├─ Created By → User
 ├─ Assigned To → User
 ├─ Comments → [User]
 └─ Attachments → [File]

File
 ├─ Uploaded By → User
 └─ Task → Task
```

---

## Example Documents

### User Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$...",
  "role": "user",
  "createdAt": "2026-02-01T00:00:00.000Z",
  "updatedAt": "2026-02-01T00:00:00.000Z"
}
```

### Task Document

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-02-15T00:00:00.000Z",
  "assignedTo": "507f1f77bcf86cd799439011",
  "createdBy": "507f1f77bcf86cd799439011",
  "comments": [
    {
      "user": "507f1f77bcf86cd799439011",
      "content": "Started working on this",
      "createdAt": "2026-02-08T07:00:00.000Z"
    }
  ],
  "attachments": ["507f1f77bcf86cd799439014"],
  "createdAt": "2026-02-08T06:56:58.000Z",
  "updatedAt": "2026-02-08T07:00:00.000Z"
}
```

### File Document

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "filename": "document.pdf",
  "filepath": "uploads/1707379018000-document.pdf",
  "mimetype": "application/pdf",
  "size": 102400,
  "uploadedBy": "507f1f77bcf86cd799439011",
  "task": "507f1f77bcf86cd799439012",
  "createdAt": "2026-02-08T07:10:18.000Z",
  "updatedAt": "2026-02-08T07:10:18.000Z"
}
```
