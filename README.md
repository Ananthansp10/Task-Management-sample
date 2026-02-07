# Task Management System

A full-stack task management application built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register, login, and JWT-based authentication with HTTP-only cookies
- **Task Management**: Create, read, update, and delete tasks with status tracking
- **File Attachments**: Upload and attach files to tasks (images, PDFs, Word documents)
- **Priority & Status**: Organize tasks by priority (low, medium, high) and status (pending, in-progress, completed)
- **User Roles**: Admin and regular user roles with role-based access control
- **Analytics Dashboard**: View task statistics and insights
- **Search & Filter**: Search tasks and filter by status/priority

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for API requests
- Custom CSS (no frameworks)

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer for file uploads
- Cookie-based session management

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "sample task management project"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
sample task management project/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── constants/       # Constants and messages
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Auth, upload, error handling
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── uploads/             # Uploaded files storage
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/             # Axios configuration
    │   ├── components/      # Reusable components
    │   ├── context/         # React context (Auth)
    │   ├── pages/           # Page components
    │   ├── styles/          # CSS files
    │   ├── App.tsx          # Main app component
    │   └── main.tsx         # Entry point
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### File Upload
- `POST /api/upload` - Upload file (returns file ID)

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Analytics
- `GET /api/analytics` - Get task analytics

## File Upload Configuration

**Limits:**
- Maximum file size: 5MB per file
- Allowed types: Images, PDF, Word documents (.doc, .docx)
- Files are stored in `backend/uploads/`

To modify limits, edit `backend/src/middlewares/upload.ts`

## Default Admin Account

After starting the application, you can create an admin user by:
1. Registering a new user
2. Manually updating the user's role in MongoDB to `admin`

Or create via MongoDB shell:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Development

### Backend
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend
```bash
cd frontend
npm run dev  # Runs Vite dev server with HMR
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist/ folder with a static server
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### Frontend
The frontend uses `http://localhost:5000` as the API base URL by default. Update `frontend/src/api/axios.ts` for production deployment.

## License

MIT

## Author

Your Name
