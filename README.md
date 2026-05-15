# 📚 Grantha — Library Management System

A full-stack Library Management System built with:
- **Frontend**: React + Vite + CSS + Axios
- **Backend**: Node.js + Express.js + Nodemon

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Run the Backend (Terminal 1)

```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

### 3. Run the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

---

## 📁 Project Structure

```
library-management/
├── backend/
│   ├── src/
│   │   └── index.js          # Express server + all API routes
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx   # Navigation sidebar
│   │   │   ├── Sidebar.css
│   │   │   └── Toast.jsx     # Notification system
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx # Stats + recent activity
│   │   │   ├── Dashboard.css
│   │   │   ├── Books.jsx     # Books CRUD
│   │   │   ├── Books.css
│   │   │   ├── Members.jsx   # Members CRUD
│   │   │   └── Transactions.jsx  # Issue + Return books
│   │   ├── services/
│   │   │   └── api.js        # Axios API calls
│   │   ├── styles/
│   │   │   └── globals.css   # Global design system
│   │   ├── App.jsx           # Routes
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔗 API Endpoints

### Dashboard
| Method | Endpoint        | Description        |
|--------|-----------------|--------------------|
| GET    | /api/dashboard  | Stats + recent txns|

### Books
| Method | Endpoint        | Description        |
|--------|-----------------|--------------------|
| GET    | /api/books      | List (search/genre)|
| GET    | /api/books/:id  | Get book by ID     |
| POST   | /api/books      | Add new book       |
| PUT    | /api/books/:id  | Update book        |
| DELETE | /api/books/:id  | Delete book        |

### Members
| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| GET    | /api/members      | List (search)    |
| GET    | /api/members/:id  | Get with history |
| POST   | /api/members      | Add member       |
| PUT    | /api/members/:id  | Update member    |
| DELETE | /api/members/:id  | Remove member    |

### Transactions
| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| GET    | /api/transactions           | List (status filter)  |
| POST   | /api/transactions/issue     | Issue a book          |
| POST   | /api/transactions/return/:id| Return a book         |

---

## ✨ Features

### Dashboard
- Live stats: Total books, Available, Issued, Overdue, Members, Fines
- Recent transaction activity table
- Books by genre bar chart

### Books Management
- Grid view with colored book covers
- Add / Edit / Delete books
- Search by title, author, ISBN
- Filter by genre
- Real-time availability tracking

### Members Management
- Table view with avatar initials
- Add / Edit / Remove members
- Search by name, email, phone
- Standard & Premium membership types
- Track books issued per member

### Transactions
- Issue books to members with custom loan period
- Automatic due date calculation
- Return books with fine calculation (₹5/day overdue)
- Filter by status: All / Issued / Returned / Overdue
- Visual overdue highlighting

---

## 💾 Data Storage

The backend uses **in-memory storage** (no database needed). Data resets on server restart. To add persistence, replace the arrays in `backend/src/index.js` with MongoDB, SQLite, or any database of your choice.

---

## 🎨 Design

- Dark luxury editorial theme ("Grantha" = Sanskrit for book/manuscript)
- Playfair Display (serif) + DM Sans (sans-serif) fonts
- Gold accent color system
- Smooth animations and micro-interactions
- Responsive layout

---

## 📦 Tech Stack Details

| Layer     | Technology                     |
|-----------|--------------------------------|
| UI        | React 18                       |
| Build     | Vite 5                         |
| Routing   | React Router v6                |
| HTTP      | Axios                          |
| Styling   | Pure CSS with CSS Variables    |
| Runtime   | Node.js                        |
| Framework | Express.js                     |
| Dev server| Nodemon (auto-restart)         |
| ID gen    | UUID v4                        |
| CORS      | cors middleware                |
