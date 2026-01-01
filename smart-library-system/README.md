Smart Library Management System

This is a web application to manage books. You can add books, edit them, delete them, and see all your books in one place.

What it does

The app helps you keep track of your personal library. Each user has their own account and can only see their own books. Nobody else can see or change your books.

You can add new books with title, author, year, and genre. You can edit any book later if you made a mistake. You can delete books you dont need anymore.

There is a history page that shows everything you did like when you added a book or deleted something.

Technologies used

Frontend is React with Vite. Backend is Node.js with Express. Database is MongoDB Atlas.

For styling we used CSS with glassmorphic design. The app has dark mode and light mode that you can switch.

We used JWT for login and bcrypt to keep passwords safe.

How to run it

First you need to install things.

Go to backend folder and run npm install
Go to client folder and run npm install

Then you need to make a file called .env in the backend folder. Put this inside:

MONGO_URI=your mongodb connection string here
JWT_SECRET=your secret key here
PORT=5000

After that you can start the backend. Go to backend folder and run npm run dev

Then start the frontend. Go to client folder and run npm run dev

The frontend will open at http://localhost:3000
The backend runs at http://localhost:5000

Features

User can register and login
Each user has separate library
Add books with details
Edit existing books
Delete books
Search and filter books
Dark and light theme
Activity history of all actions
Smooth animations
Works on mobile and desktop

Project structure

The backend folder has all server code. Inside there is models folder for database schemas, routes folder for API endpoints, and middleware for authentication.

The client folder has all frontend code. Inside src there is components for UI parts, pages for different screens, contexts for state management, and styles for CSS files.

Database

We use MongoDB Atlas cloud database. The connection string goes in .env file. There are three collections: users for accounts, books for library items, and histories for activity logs.

Security

Passwords are hashed with bcrypt before saving. We use JWT tokens for authentication. Each user can only access their own data. The token expires after some time for safety.



Setup Instructions

Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher) - [Download](https://nodejs.org/)
- MongoDB (Local or Atlas) - [Download](https://www.mongodb.com/try/download/community)
Git - [Download](https://git-scm.com/)

Step 1: Clone the Repository

bash
git clone https://github.com/YOUR_USERNAME/smart-library-system.git
cd smart-library-system


Step 2: Setup Backend

bash
# Navigate to server directory
cd server

# Install dependencies
npm install

 Create/edit .env file (already provided with defaults)
 MONGODB_URI=mongodb://localhost:27017/smart-library
 PORT=5000


Step 3: Setup Frontend

bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install
```

Step 4: Start MongoDB

Make sure MongoDB is running on your local machine:

Windows:
```bash
# MongoDB should start automatically as a service
# Or start manually:
mongod


macOS/Linux:
bash
# Start MongoDB service
sudo systemctl start mongod
# or
mongod --dbpath /usr/local/var/mongodb


 How to Run the Application

Development Mode

You'll need two terminals - one for the backend and one for the frontend.

Terminal 1 - Start Backend Server
bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

The backend will start at: http://localhost:5000

Terminal 2 - Start Frontend:
bash
cd client
npm run dev


The frontend will start at: http://localhost:3000

Production Build

bash
Build the frontend
cd client
npm run build

The built files will be in client/dist


 API Endpoints

Base URL: `http://localhost:5000/api

Method  Endpoint  Description 

GET     /books    Retrieve all books 
GET  /books/:id  Retrieve a single book by ID 
POST  /books  Add a new book 
DELETE  /books/:id  Remove a book by ID 

Request/Response Examples

Add a New Book (POST /api/books)

Request Body:
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "year": 1925
}
```

Success Response:
```json
{
  "success": true,
  "message": "Book added successfully to the library",
  "data": {
    "_id": "6579abc123def456",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "year": 1925,
    "createdAt": "2026-01-01T12:00:00.000Z",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  }
}
```

Get All Books (GET /api/books)

Success Response:
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "6579abc123def456",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5",
      "year": 1925
    },
    {
      "_id": "6579abc789def012",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "isbn": "978-0-06-112008-4",
      "year": 1960
    }
  ]
}

