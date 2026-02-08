# File Upload API

All upload endpoints require authentication and are under `/api/upload`.

## Upload File

**POST** `/api/upload`

Upload a file to the server.

### Request

- **Content-Type:** `multipart/form-data`
- **Field name:** `file`

### Response: `201 Created`

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "filename": "document.pdf",
    "filepath": "uploads/1707379018000-document.pdf",
    "mimetype": "application/pdf",
    "size": 102400,
    "uploadedBy": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-08T07:10:18.000Z",
    "updatedAt": "2026-02-08T07:10:18.000Z"
  }
}
```

### Error Response: `400 Bad Request`

```json
{
  "success": false,
  "message": "No file uploaded"
}
```

---

## Usage Examples

### Using cURL

```bash
curl -X POST http://localhost:3000/api/upload \
  -b cookies.txt \
  -F "file=@/path/to/document.pdf"
```

### Using JavaScript/FormData

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('File uploaded:', data.data);
  const fileId = data.data._id;
  // Use fileId in task attachments
});
```

### Using Axios

```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('file', file);

const response = await axios.post('http://localhost:3000/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true
});

console.log('File ID:', response.data.data._id);
```

---

## File Upload Workflow

1. **Upload the file** using the upload endpoint
2. **Receive the file ID** from the response
3. **Use the file ID** in the `attachments` array when creating or updating a task

### Example: Create Task with Attachment

```javascript
// Step 1: Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
});

const uploadData = await uploadResponse.json();
const fileId = uploadData.data._id;

// Step 2: Create task with attachment
const taskResponse = await fetch('http://localhost:3000/api/tasks', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Task with attachment',
    description: 'This task has a file attached',
    attachments: [fileId]
  })
});
```

---

## File Storage

- **Upload Directory:** `backend/uploads/`
- **Access URL:** `http://localhost:3000/uploads/<filename>`
- **Filename Format:** `<timestamp>-<original-filename>`
- **Storage:** Disk storage using Multer

### Accessing Uploaded Files

Files can be accessed directly via URL:

```
http://localhost:3000/uploads/1707379018000-document.pdf
```

---

## Notes

- Files are stored with timestamp prefix to avoid name conflicts
- The `_id` from the upload response is used to link files to tasks
- Files are automatically associated with tasks when included in `attachments`
- Uploaded files persist in the `uploads/` directory
- File metadata is stored in MongoDB
