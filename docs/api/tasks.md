# Tasks API

All task endpoints require authentication and are under `/api/tasks`.

## Create Task

**POST** `/api/tasks`

Create a new task.

### Request Body

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-02-15T00:00:00.000Z",
  "assignedTo": "507f1f77bcf86cd799439011",
  "attachments": ["file_id_1", "file_id_2"]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Task title |
| description | string | No | Detailed description |
| status | string | No | `pending`, `in-progress`, or `completed` (default: `pending`) |
| priority | string | No | `low`, `medium`, or `high` (default: `medium`) |
| dueDate | Date | No | ISO 8601 date string |
| assignedTo | ObjectId | No | User ID to assign the task to |
| attachments | ObjectId[] | No | Array of File IDs |

### Response: `201 Created`

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-02-15T00:00:00.000Z",
    "assignedTo": "507f1f77bcf86cd799439011",
    "createdBy": "507f1f77bcf86cd799439011",
    "attachments": ["file_id_1", "file_id_2"],
    "comments": [],
    "createdAt": "2026-02-08T06:56:58.000Z",
    "updatedAt": "2026-02-08T06:56:58.000Z"
  }
}
```

---

## Get All Tasks

**GET** `/api/tasks`

Retrieve a paginated list of tasks with optional filtering and sorting.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | - | Filter by status (`pending`, `in-progress`, `completed`) |
| priority | string | - | Filter by priority (`low`, `medium`, `high`) |
| search | string | - | Search in title and description |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| sort_by | string | createdAt | Field to sort by |
| order | string | desc | Sort order (`asc` or `desc`) |

### Example Request

```
GET /api/tasks?status=pending&priority=high&page=1&limit=10&sort_by=dueDate&order=asc
```

### Response: `200 OK`

```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "tasks": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation",
        "status": "pending",
        "priority": "high",
        "dueDate": "2026-02-15T00:00:00.000Z",
        "assignedTo": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "john_doe",
          "email": "john@example.com"
        },
        "createdBy": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "john_doe",
          "email": "john@example.com"
        },
        "comments": [],
        "attachments": [],
        "createdAt": "2026-02-08T06:56:58.000Z",
        "updatedAt": "2026-02-08T06:56:58.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

---

## Get Task by ID

**GET** `/api/tasks/:id`

Retrieve a specific task by its ID with populated relationships.

### URL Parameters

- `id`: Task ID

### Response: `200 OK`

```json
{
  "success": true,
  "message": "Task details",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-02-15T00:00:00.000Z",
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "comments": [
      {
        "user": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "john_doe"
        },
        "content": "Started working on this",
        "createdAt": "2026-02-08T07:00:00.000Z"
      }
    ],
    "attachments": [
      {
        "_id": "file_id_1",
        "filename": "document.pdf",
        "filepath": "uploads/document.pdf",
        "mimetype": "application/pdf",
        "size": 102400
      }
    ],
    "createdAt": "2026-02-08T06:56:58.000Z",
    "updatedAt": "2026-02-08T06:56:58.000Z"
  }
}
```

### Error Response: `404 Not Found`

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Update Task

**PUT** `/api/tasks/:id`

Update an existing task.

### URL Parameters

- `id`: Task ID

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2026-02-20T00:00:00.000Z",
  "assignedTo": "507f1f77bcf86cd799439013",
  "attachments": ["file_id_3"]
}
```

### Response: `200 OK`

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated task title",
    "status": "in-progress",
    "priority": "medium"
    // ... other fields
  }
}
```

---

## Delete Task

**DELETE** `/api/tasks/:id`

Delete a task by its ID.

### URL Parameters

- `id`: Task ID

### Response: `200 OK`

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Error Response: `404 Not Found`

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Bulk Create Tasks

**POST** `/api/tasks/bulk`

Create multiple tasks at once.

### Request Body

```json
[
  {
    "title": "Task 1",
    "description": "First task",
    "status": "pending",
    "priority": "low"
  },
  {
    "title": "Task 2",
    "description": "Second task",
    "status": "pending",
    "priority": "high"
  }
]
```

### Response: `201 Created`

```json
{
  "success": true,
  "message": "Tasks bulk created successfully"
}
```

---

## Usage Examples

### Create a task with cURL

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "priority": "high"
  }'
```

### Get tasks with filtering

```bash
curl -X GET "http://localhost:3000/api/tasks?status=pending&priority=high" \
  -b cookies.txt
```

### Search tasks

```bash
curl -X GET "http://localhost:3000/api/tasks?search=documentation" \
  -b cookies.txt
```
