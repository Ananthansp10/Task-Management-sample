# Error Handling

This document describes error handling in the Task Management API.

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Authentication required or failed |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |

---

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## Common Errors

### Authentication Errors

#### Missing Token

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

**Cause:** No authentication token provided in the request.

**Solution:** Login first to obtain a token.

---

#### Invalid Token

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

**Cause:** Token is invalid, expired, or malformed.

**Solution:** Login again to get a new token.

---

#### Invalid Credentials

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Cause:** Incorrect email or password during login.

**Solution:** Verify credentials and try again.

---

### Resource Not Found Errors

#### User Not Found

**Status:** `404 Not Found`

```json
{
  "success": false,
  "message": "User not found"
}
```

**Cause:** Requested user ID does not exist.

---

#### Task Not Found

**Status:** `404 Not Found`

```json
{
  "success": false,
  "message": "Task not found"
}
```

**Cause:** Requested task ID does not exist.

---

### Validation Errors

#### User Already Exists

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "User already exists"
}
```

**Cause:** Email is already registered.

**Solution:** Use a different email or login with existing account.

---

#### Invalid User Data

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid user data"
}
```

**Cause:** Required fields are missing or data format is incorrect.

**Solution:** Verify request body matches the required schema.

---

#### No File Uploaded

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "No file uploaded"
}
```

**Cause:** File upload request without a file.

**Solution:** Include a file in the request with field name `file`.

---

### Server Errors

#### Internal Server Error

**Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Server error message"
}
```

**Cause:** Unexpected server error (database connection, etc.).

**Solution:** Check server logs and contact support if persistent.

---

## Error Handling Best Practices

### Client-Side

1. **Always check the `success` field** in responses
2. **Display user-friendly error messages** based on the `message` field
3. **Handle 401 errors** by redirecting to login
4. **Implement retry logic** for 500 errors
5. **Validate input** before sending requests

### Example Error Handling

```javascript
try {
  const response = await fetch('http://localhost:3000/api/tasks', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  const data = await response.json();

  if (!data.success) {
    // Handle error
    if (response.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (response.status === 400) {
      // Show validation error
      alert(data.message);
    } else {
      // Show generic error
      alert('An error occurred. Please try again.');
    }
    return;
  }

  // Success - use data.data
  console.log('Task created:', data.data);

} catch (error) {
  // Network error
  console.error('Network error:', error);
  alert('Unable to connect to server');
}
```

---

## Debugging Tips

1. **Check the response status code** to identify the error type
2. **Read the error message** for specific details
3. **Verify authentication** if getting 401 errors
4. **Check request format** if getting 400 errors
5. **Inspect server logs** for 500 errors
6. **Use browser DevTools** to inspect network requests
7. **Test with cURL** to isolate client-side issues

---

## Error Middleware

The API uses a centralized error handling middleware that:

- Catches all errors thrown in route handlers
- Formats errors consistently
- Logs errors for debugging
- Returns appropriate HTTP status codes

This ensures all errors follow the same response format across the entire API.
