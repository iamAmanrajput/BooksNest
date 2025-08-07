# NexLib

NexLib is a full-stack Library Management System designed to streamline book borrowing, user management, and library analytics. It features a robust backend built with Node.js, Express, and MongoDB, and a modern, responsive frontend using React, Redux, and TailwindCSS.

---

## Features

### Backend (Node.js, Express, MongoDB)
- **Authentication & Authorization:** Secure user and admin login, registration, and JWT-based session management.
- **Book Management:** CRUD operations for books, including soft delete and restore, featured books, and book statistics.
- **User Management:** Admin can view all users, change account status, and view user statistics and recent activities.
- **Borrowing System:** Handles book borrowing, returning, and queue management.
- **Review & Rating:** Users can review and rate books.
- **Notifications:** Email notifications for due/overdue reminders, queue updates, and more (using nodemailer and cron jobs).
- **Profile Management:** Users can update their profile, view borrowing history, and manage wishlists.
- **Admin Dashboard:** Analytics and insights for library operations.

### Frontend (React, Redux, TailwindCSS)
- **User Portal:** Sign up, sign in, browse books, borrow/return books, view history, and manage profile.
- **Admin Portal:** Manage books, users, requests, and view analytics via a dedicated dashboard.
- **Responsive UI:** Modern, mobile-friendly design with dark mode support.
- **State Management:** Redux Toolkit for global state, authentication, and user data.
- **Notifications:** Real-time feedback and alerts for user actions.
- **Charts & Analytics:** Visual representation of library data for admins.

---

## Screenshot

<img width="1824" height="879" alt="image" src="https://github.com/user-attachments/assets/8b8ea91c-c026-4997-bf0a-ca258480a775" />


## Project Structure

```
NexLib/
  backend/      # Node.js/Express API
    app.js
    controllers/
    models/
    routes/
    middlewares/
    jobs/
    services/
    templates/
    utils/
    config/
    package.json
  frontend/     # React client
    src/
      pages/
      components/
      layouts/
      redux/
      routes/
      assets/
      constants/
      hooks/
      lib/
    public/
    package.json
  README.md     # (README.md)
```

---

## Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- (Optional) Cloudinary account for image uploads

### Backend

```bash
cd backend
npm install
# Create a .env file with required variables (see below)
npm run dev
```

**Environment Variables (`backend/.env`):**
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**Environment Variables (`frontend/.env`):**
```
VITE_BACKEND_URL=http://localhost:4000/api/v1
```

---

## API Endpoints (Sample)

### Auth
- `POST /api/v1/auth/register` – Register user
- `POST /api/v1/auth/login` – Login user
- `GET /api/v1/auth/logout` – Logout user

### Books
- `POST /api/v1/book/createBook` – Add new book (admin)
- `PATCH /api/v1/book/update` – Update book (admin)
- `PATCH /api/v1/book/softDelete` – Soft delete book (admin)
- `PATCH /api/v1/book/restore` – Restore book (admin)
- `GET /api/v1/book/featuredBook` – Get featured books
- `GET /api/v1/book/books` – List all books
- `GET /api/v1/book/:bookId` – Get book by ID

### Users (Admin)
- `GET /api/v1/user/users` – List all users
- `GET /api/v1/user/recent-activities` – Recent user activities
- `GET /api/v1/user/users/stats` – User statistics
- `PATCH /api/v1/user/changeStatus` – Change user account status

---

## Main Frontend Routes

- `/` – User Home (dashboard, stats, featured books)
- `/books` – Browse all books
- `/book/:bookId` – Book details
- `/history` – User borrowing history
- `/profile` – User profile
- `/signin`, `/signup` – Auth pages
- `/admin/dashboard` – Admin dashboard
- `/admin/books` – Manage books
- `/admin/users` – Manage users
- `/admin/requests` – Manage borrow requests
- `/admin/analytics` – View analytics

---

## Technologies Used

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer, Cloudinary, node-cron
- **Frontend:** React, Redux Toolkit, React Router, TailwindCSS, Radix UI, Axios, Recharts
- **Dev Tools:** Vite, ESLint, Nodemon

---

## Contribution

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Author

- Aman Singh 
