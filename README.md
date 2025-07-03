
# Candidate Application 

A full-stack web application for managing candidate applications with admin panel, resume upload, status updates, and more.

# 🧾 Project Overview

This project allows candidates to apply for positions by submitting their details and a resume. An admin dashboard is available for viewing, filtering, and updating candidate statuses.


Built using:


Frontend : React + TypeScript 

Backend : FastAPI (Python)

Database : PostgreSQL

Containerization : Docker

# 🚀 Features

Candidate Features

📝Registration Form Collects full name, date of birth, experience, department, email, phone (Jordanian format only), and resume (PDF up to 5MB)

🔒DOB Validation Must be at least 18 years old

✅Phone Format Only accepts numbers starting with +962 followed by exactly 9 digits

📄Resume Upload PDF file upload limited to 5MB


Admin Features

🔐Login Protected Dashboard Accessible only with valid credentials

🔍Search & FilterSearch candidates by name/email; filter by status/department

🔢Pagination Shows 10 candidates per page

📂Status Update Modal Allows changing status with feedback

📜Status History Shows all past status changes inside the modal

⬇️Secure Resume Download Requires X-ADMIN header for access

🚪Logout Functionality Clears session and redirects to login


# 🧱 Backend (FastAPI)
🔐 Endpoints

POST /api/v1/candidates/                    Register new candidate with resume upload

GET /api/v1/candidates/{id}/status          Get status history for a candidate

GET /api/v1/admin/candidates/               List candidates with pagination and filters

POST /api/v1/admin/candidates/{id}/status   Update candidate status with optional feedback

GET /api/v1/admin/candidates/{id}/resume    Secure resume download for admins


# 🛡️ Security

CORS enabled for http://localhost:3000

Status values restricted to enum: "Submitted", "Interview", "Shortlisted", "Hired"

Department values restricted to enum: "IT", "Operations", "Management", "Support"

# 💻 Frontend (React + TypeScript)

📄 Pages

Candidate Registration   /

![image](https://github.com/user-attachments/assets/208df3d9-e62b-4ff0-a781-05fa3cd4a0ef)


Application Status Viewer   /status/:id

![image](https://github.com/user-attachments/assets/bb1fffac-68f2-410b-9eb0-9e49a87c034c)


Admin Login  /admin/login

user name: admin
password: admin

![image](https://github.com/user-attachments/assets/ff76c525-23dc-451b-b1ef-63c0aab89163)


Admin Panel /admin

![image](https://github.com/user-attachments/assets/4d7bfe0c-4138-4f6d-9dff-0b5325ac435d)

![image](https://github.com/user-attachments/assets/a09084c3-a663-4456-b5d0-d2b35b571f89)


# 🧰 How to Run

# Build and run everything
docker-compose up --build


Frontend : http://localhost:3000

Backend : http://localhost:8000

Admin Panel : http://localhost:3000/admin
