# Getting Started

## Base URL

```
http://localhost:3000/api
```

## Environment Setup

Ensure the following environment variables are configured:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/task-management

# JWT
JWT_SECRET=your_jwt_secret_key

# CORS
FRONTEND_URL=http://localhost:5173
```

## Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

## Authentication

Most endpoints require authentication using JWT tokens stored in HTTP-only cookies.

### Quick Start

1. **Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Make authenticated requests:**
```bash
curl -X GET http://localhost:3000/api/tasks \
  -b cookies.txt
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | OK - Request successful |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid request data |
| 401  | Unauthorized - Authentication required or failed |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error - Server error |

## Testing Tools

### Using Postman

1. Set base URL: `http://localhost:3000/api`
2. Enable cookies in Postman settings
3. Login first to get the authentication cookie
4. Subsequent requests will automatically include the cookie

### Using cURL

Use `-c cookies.txt` to save cookies and `-b cookies.txt` to send them with requests.

## Next Steps

- [Authentication API](api/authentication.md)
- [Tasks API](api/tasks.md)
- [Data Models](models.md)
