📚 Library Management System

MERN Stack Industrial Training Project

Training Organization: Digontom Private Limited
Developed By: Arkadip Das
University: Brainware University
Course: Diploma in Computer Science and Engineering
Technology: MERN Stack

---

📖 Project Overview

The Library Management System is a full-stack web application developed using the MERN Stack (MongoDB, Express.js, React.js and Node.js) as part of Industrial Training at Digontom Private Limited.

The system is designed to manage library books, members, borrowing transactions, book returns, overdue records and fines through a user-friendly web interface.

It provides separate dashboards for administrators and library members.

🎯 Project Objectives

- Develop a full-stack web application using the MERN Stack.
- Implement frontend and backend integration.
- Manage library books and member information.
- Track book issuing and returning activities.
- Maintain borrowing history.
- Calculate overdue fines.
- Implement JWT-based authentication.
- Gain practical experience in MongoDB, Express.js, React.js and Node.js.

🛠️ Technologies Used

Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

Development Tools

- Visual Studio Code
- MongoDB Compass
- Git
- GitHub
- npm

✨ Project Features

1. Authentication and Authorization

- User registration
- Admin and member login
- JWT-based authentication
- Password hashing
- Protected API routes
- Role-based dashboard redirection
- Logout

2. Admin Dashboard

The Admin Dashboard displays important library statistics:

- Total Books
- Total Book Copies
- Available Copies
- Total Members
- Active Members
- Issued Books
- Overdue Books
- Total Fines
- Recent Library Activities

3. Book Management

- Add new books
- View all books
- View individual book details
- Search books
- Filter books by category
- Track available copies
- Track total copies
- Manage book availability

Book information includes ISBN, title, author, category, publisher, publication year, description, location and copy counts.

4. Member Management

- Register library members
- View member information
- Search members
- View member details
- Track member borrowing records
- View member profiles

5. Book Issue Management

- Issue books to registered members
- Generate unique transaction IDs
- Record issue dates
- Record due dates
- Check book availability
- Prevent duplicate active borrowing of the same book
- Automatically decrease available copies when issuing a book

6. Book Return Management

- Search borrowing transactions
- Return issued books
- Record return dates
- Update borrowing status
- Automatically increase available copies
- Calculate overdue fines

7. Overdue and Fine Management

- Identify overdue books
- Track overdue transactions
- Calculate late return fines
- Display fine amounts

Fine Rate: ₹5 per overdue day

8. Borrowing History

- View borrowing transactions
- View transaction IDs
- View member information
- View borrowed book details
- Track issue and due dates
- Track return dates
- View borrowing status
- View fine amounts

9. Category Management

- Add book categories
- View categories
- Organize books by category

10. Member Dashboard

- View member information
- Browse available books
- View book details
- View currently borrowed books
- View borrowing history
- Track overdue books
- View outstanding borrowing information

📁 Project Folder Structure

Library-Management-System/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore

🗄️ Database

The project uses MongoDB to store and manage library data.

Main Collections

Collection| Purpose
users| Login credentials and user roles
books| Library book information
members| Registered library members
borrowings| Book issue and return transactions
categories| Book categories

🔗 API Endpoints

Authentication APIs

Method| Endpoint| Description
POST| "/api/auth/register"| Register user
POST| "/api/auth/login"| User login
GET| "/api/auth/me"| Current user information

Book APIs

Method| Endpoint| Description
GET| "/api/books"| View all books
GET| "/api/books/:id"| View book details
POST| "/api/books"| Add new book

Member APIs

Method| Endpoint| Description
GET| "/api/members"| View members
GET| "/api/members/:id"| View member details
POST| "/api/members"| Add member

Borrowing APIs

Method| Endpoint| Description
GET| "/api/borrowings"| View transactions
GET| "/api/borrowings/:id"| View transaction details
GET| "/api/borrowings/member/:memberId"| Member borrowing history
POST| "/api/borrowings/issue"| Issue book
POST| "/api/borrowings/:id/return"| Return book
PUT| "/api/borrowings/check-overdue"| Update overdue status

Dashboard APIs

Method| Endpoint| Description
GET| "/api/dashboard/statistics"| Library statistics
GET| "/api/dashboard/recent-activity"| Recent library activities

⚙️ Installation and Setup

Prerequisites

Install the following:

- Node.js
- MongoDB Community Server
- Git
- Visual Studio Code (recommended)

Step 1: Clone the Repository

git clone https://github.com/dasarkadip038-ship-it/Library-Management-System.git

cd Library-Management-System

Step 2: Backend Setup

Open a terminal:

cd backend
npm install

Create a ".env" file inside the "backend" folder:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library_management
JWT_SECRET=replace_with_your_own_secure_secret

Start the local MongoDB server.

Run the backend:

node server.js

Backend URL:

http://localhost:5000

Step 3: Frontend Setup

Open a second terminal from the project's root folder:

cd frontend
npm install
npm run dev

Frontend URL:

http://localhost:5173

The frontend and backend must run simultaneously.

🔄 Book Borrowing Workflow

Admin Login
     |
     v
Select Member
     |
     v
Select Available Book
     |
     v
Issue Book
     |
     v
Generate Transaction ID
     |
     v
Available Copies - 1
     |
     v
Borrowed
     |
     v
Return Book
     |
     v
Calculate Fine (if overdue)
     |
     v
Available Copies + 1
     |
     v
Returned

🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Protected backend API routes
- Environment variables for sensitive configuration

Security Note: Do not commit actual ".env" files, passwords, database credentials or JWT secrets to GitHub.

📚 Industrial Training Details

Training Program: MERN Stack Development
Training Organization: Digontom Private Limited
Project Title: Library Management System
Project Type: Industrial Training Project
Technology Stack: MongoDB, Express.js, React.js and Node.js

Learning Outcomes

This project provided practical experience in:

- React component development
- REST API development
- Frontend and backend integration
- MongoDB database operations
- User authentication
- CRUD operations
- Git and GitHub version control
- Full-stack application development

👨‍💻 Developer

Arkadip Das

Diploma in Computer Science and Engineering
Brainware University

Industrial Training: MERN Stack
Training Organization: Digontom Private Limited

GitHub: https://github.com/dasarkadip038-ship-it

📌 Project Information

Field| Details
Project Name| Library Management System
Project Type| Industrial Training
Training| MERN Stack Development
Organization| Digontom Private Limited
University| Brainware University
Developer| Arkadip Das
Version| 1.0

📄 Project Purpose

This project was developed for educational and industrial training purposes as part of MERN Stack Industrial Training at Digontom Private Limited.
