# candidate-application

Candidate Application System
A full-stack web application for managing candidate applications with admin panel, resume upload, status updates, and more.

🧾 Project Overview
This project allows candidates to apply for positions by submitting their details and a resume. An admin dashboard is available for viewing, filtering, and updating candidate statuses.

Built using:

Frontend : React + TypeScript
Backend : FastAPI (Python)
Database : PostgreSQL
Containerization : Docker
🚀 Features
Candidate Features
📝
Registration Form
Collects full name, date of birth, experience, department, email, phone (Jordanian format only), and resume (PDF up to 5MB)
🔒
DOB Validation
Must be at least 18 years old
✅
Phone Format
Only accepts numbers starting with
+962
followed by exactly 9 digits
📄
Resume Upload
PDF file upload limited to 5MB

Admin Features
🔐
Login Protected Dashboard
Accessible only with valid credentials
🔍
Search & Filter
Search candidates by name/email; filter by status/department
🔢
Pagination
Shows 10 candidates per page
📂
Status Update Modal
Allows changing status with feedback
📜
Status History
Shows all past status changes inside the modal
⬇️
Secure Resume Download
Requires
X-ADMIN
header for access
🚪
Logout Functionality
Clears session and redirects to login

📁 File Structure

candidate-application/
│
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── main.py             # API routes
│   │   ├── models.py           # Database models
│   │   ├── schemas.py          # Pydantic models
│   │   ├── database.py         # DB connection setup
│   │   └── crud.py             # Database operations
│   └── Dockerfile              # Docker setup for backend
│
├── frontend/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── CandidateForm.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── status.ts
│   │   │   └── department.ts
│   │   └── ...
│   └── Dockerfile              # Docker for frontend
│
├── docker-compose.yml          # Orchestrate both services
├── README.md
└── .gitignore
🧱 Backend (FastAPI)
🔐 Endpoints
POST /api/v1/candidates/
POST
Register new candidate with resume upload
GET /api/v1/candidates/{id}/status
GET
Get status history for a candidate
GET /api/v1/admin/candidates/
GET
List candidates with pagination and filters
POST /api/v1/admin/candidates/{id}/status
POST
Update candidate status with optional feedback
GET /api/v1/admin/candidates/{id}/resume
GET
Secure resume download for admins

🛡️ Security
CORS enabled for http://localhost:3000
Status values restricted to enum: "Submitted", "Interview", "Shortlisted", "Hired"
Department values restricted to enum: "IT", "Operations", "Management", "Support"
💻 Frontend (React + TypeScript)
📄 Pages
Candidate Registration
/
Application Status Viewer
/status/:id
Admin Login
/admin/login
Admin Panel
/admin/dashboard

✅ Input Validations
Phone input only accepts Jordanian format: +962 followed by 9 digits
Date of Birth must be at least 18 years ago
Resume upload limited to 5 MB (PDF only)
Department selected from dropdown (no free text)
📊 Admin Panel Features
Candidates list with search, filters, and pagination
Status update modal with:
Dropdown for new status
Optional feedback field
Status history display
Resume download via secure X-ADMIN header
Logout functionality
🐳 Docker Setup
Services
Frontend
3000
React UI
Backend
8000
FastAPI server
PostgreSQL
5432
Database for storing candidate data

🧰 How to Run
bash


1
2
# Build and run everything
docker-compose up --build
The system will be accessible at: 

Frontend : http://localhost:3000
Backend : http://localhost:8000
Admin Panel : http://localhost:3000/admin/dashboard
🔐 Admin Authentication
Hardcoded token: "X-ADMIN": "1" is used in headers for protected endpoints
Admin login is simulated using localStorage (isAdminLoggedIn)
Real-world implementation should use JWT or OAuth
📦 Technologies Used
Backend
Python
FastAPI
PostgreSQL
SQLAlchemy ORM
Pydantic Models
Docker
Frontend
React
TypeScript
Tailwind CSS
React Router DOM
Chart.js (for future enhancements)
Dockerized for deployment
🧪 Testing & Development Tools
Jest
React Testing Library
Web Vitals
TypeScript linting
NPM scripts for start/build/test
🧩 Future Enhancements
JWT Auth
Replace hardcoded
X-ADMIN
token with real authentication
User Roles
Separate admin/user views
S3 Storage
Store resumes on cloud instead of local filesystem
Email Notifications
Notify candidates on status change
Enhanced Charts
Show stats like department distribution, status trends
Dark Mode
Add theme toggle
Mobile Optimization
Responsive layout improvements

📌 Notes
Ensure CORS is enabled in backend for your frontend origin
Resume files are stored in backend/uploads/
All forms include validation and error handling
Admin panel includes logout functionality and modal-based UX
docker-compose.yml ensures all services run together seamlessly


