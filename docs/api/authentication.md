# Authentication API

All authentication endpoints are under `/api/auth`.

## Register User

**POST** `/api/auth/register`

Register a new user account.

### Request Body

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Response: `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Notes
- Password is automatically hashed with bcrypt
- JWT token is set as HTTP-only cookie
- Default role is `user`
- Token expires in 30 days

---

## Login User

**POST** `/api/auth/login`

Authenticate a user and receive a JWT token.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Response: `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Error Response: `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Logout User

**POST** `/api/auth/logout`

Logout the current user by clearing the authentication cookie.

### Response: `200 OK`

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Get Current User

**GET** `/api/auth/me`

Get the currently authenticated user's profile.

### Headers
- Cookie: `token=<jwt_token>`

### Response: `200 OK`

```json
{
  "success": true,
  "message": "User profile",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
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

## Authentication Flow

1. **Register** a new account or **Login** with existing credentials
2. Server sets JWT token in HTTP-only cookie
3. Browser automatically sends cookie with subsequent requests
4. Protected routes validate the token via middleware
5. **Logout** clears the authentication cookie

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens stored in HTTP-only cookies (prevents XSS attacks)
- Secure flag enabled in production
- SameSite: strict (prevents CSRF attacks)
- Token expiration: 30 days
