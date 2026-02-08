# Users API

All user endpoints require authentication and are under `/api/users`.

## Get All Users

**GET** `/api/users`

Retrieve all users (passwords excluded).

### Response: `200 OK`

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-02-01T00:00:00.000Z",
      "updatedAt": "2026-02-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "username": "jane_smith",
      "email": "jane@example.com",
      "role": "admin",
      "createdAt": "2026-02-02T00:00:00.000Z",
      "updatedAt": "2026-02-02T00:00:00.000Z"
    }
  ]
}
```

---

## Get User by ID

**GET** `/api/users/:id`

Retrieve a specific user by ID.

### URL Parameters

- `id`: User ID

### Response: `200 OK`

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-02-01T00:00:00.000Z",
    "updatedAt": "2026-02-01T00:00:00.000Z"
  }
}
```

### Error Response: `404 Not Found`

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Update User

**PUT** `/api/users/:id`

Update user information.

### URL Parameters

- `id`: User ID

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "username": "john_updated",
  "email": "john.updated@example.com",
  "role": "admin"
}
```

### Response: `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_updated",
    "email": "john.updated@example.com",
    "role": "admin",
    "createdAt": "2026-02-01T00:00:00.000Z",
    "updatedAt": "2026-02-08T07:00:00.000Z"
  }
}
```

### Error Response: `404 Not Found`

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Delete User

**DELETE** `/api/users/:id`

Delete a user by ID.

### URL Parameters

- `id`: User ID

### Response: `200 OK`

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Error Response: `404 Not Found`

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Usage Examples

### Get all users

```bash
curl -X GET http://localhost:3000/api/users \
  -b cookies.txt
```

### Get specific user

```bash
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -b cookies.txt
```

### Update user

```bash
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "username": "new_username",
    "role": "admin"
  }'
```

### Delete user

```bash
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -b cookies.txt
```

---

## Notes

- All responses exclude the password field for security
- User updates run validators to ensure data integrity
- Deleting a user does not automatically delete their created tasks
