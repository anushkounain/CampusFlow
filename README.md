# CampusFlow

> **One campus. Every possibility.**

CampusFlow is an intelligent, modular Student Life Management Platform that unifies academic management, student productivity, career development, campus communities, and institutional administration into a single cohesive SaaS application.

---

## 🏛️ Architecture Overview

CampusFlow is engineered with strict separation of concerns, robust type safety, zero-trust backend authorization, and responsive university-grade user experiences.

```
                              ┌──────────────────────────────────┐
                              │     CampusFlow Frontend (React)   │
                              │  TypeScript • Vite • Tailwind    │
                              │  React Router • TanStack Query   │
                              └────────────────┬─────────────────┘
                                               │  HTTP / REST (JWT)
                                               ▼
                              ┌──────────────────────────────────┐
                              │     CampusFlow Backend (FastAPI) │
                              │   Pydantic V2 • SQLAlchemy 2.0   │
                              │      RBAC Security Dependency    │
                              └────────┬───────────────┬─────────┘
                                       │               │
                        ┌──────────────▼──────┐   ┌────▼─────────────────┐
                        │ Database (Postgres/ │   │  AI Study Engine     │
                        │      SQLite)        │   │ (Google Gemini 2.5)  │
                        └─────────────────────┘   └──────────────────────┘
```

---

## 🚀 Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Tooling**: Vite 8
- **Styling**: Tailwind CSS v4 (Modern University SaaS theme, Minimalist Light Palette)
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Data Fetching & State**: TanStack Query v5 + Context API

### Backend
- **Framework**: Python 3.13 + FastAPI
- **ORM & Database**: SQLAlchemy 2.0 (PostgreSQL production-ready with instant SQLite development engine)
- **Validation**: Pydantic V2 (`BaseModel`, `ConfigDict`, `EmailStr`)
- **Authentication**: Cryptographic JWT access tokens (HS256) & bcrypt password hashing
- **Authorization**: Endpoint-level Role-Based Access Control (RBAC) dependencies
- **AI Core**: Google Gemini API integration with fallback deterministic study generator

### Quality Assurance & Testing
- **Backend Tests**: Pytest + FastAPI TestClient (In-memory transactional SQLite runner)
- **Frontend Verification**: TypeScript typecheck (`tsc -b`) & Vite production bundling

---

## 👥 Role-Based Access Control (RBAC)

The system enforces permissions at the backend layer with tailored experiences for four primary campus personas:

| Role | Permissions & Functional Access | Default Demo Credentials |
| :--- | :--- | :--- |
| **Student** | View timetable, grades, courses, submit assignments, take AI quizzes & flashcards, apply for internships, post marketplace items | `student@campusflow.edu` / `Student@123` |
| **Faculty** | Curriculum management, syllabus authoring, assignment publishing, student grading, broadcast notices | `faculty@campusflow.edu` / `Faculty@123` |
| **Placement Coordinator** | Post corporate drives, review candidate profiles, track applications, placement analytics | `placement@campusflow.edu` / `Placement@123` |
| **College Administrator** | System governance, department allocation, institutional analytics, user management, audit verification | `admin@campusflow.edu` / `Admin@123` |

---

## 📦 Application Modules

- **A. Academic Management**: Course catalog, weekly timetable matrix, lecture attendance logs, assignments and solution submission pipeline.
- **B. AI Study Assistant**: Interactive diagnostic quizzes with immediate explanation grading, dual-sided flip flashcards, and personalized 4-week milestone study roadmaps powered by Gemini.
- **C. Career & Placement Hub**: Verified job & internship listings from corporate partners (Google, Microsoft, NVIDIA), 1-click candidate applications, and real-time status trackers.
- **D. Campus Community**: University circulars, official announcements board, upcoming campus hackathons and cultural festivals.
- **E. Campus Marketplace**: Student peer-to-peer textbook exchanges, dorm equipment, bicycles, and lost & found registry.
- **F. Institutional Governance**: Role quotas, department distributions, system health telemetry.

---

## ⚡ Local Setup & Execution Guide

### Prerequisites
- **Node.js** (v20+ recommended)
- **Python** (v3.11+ / v3.13)
- **Git**

### 1. Clone & Navigate to Workspace
```bash
git clone https://github.com/anushkounain/CampusFlow.git
cd CampusFlow
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment (optional)
python -m venv .venv
# On Windows: .venv\Scripts\activate
# On Linux/macOS: source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The database automatically initializes and seeds default courses, accounts, timetables, and jobs on first boot.*

- **Backend API**: `http://127.0.0.1:8000`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/api/v1/health`

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```

- **Frontend Application**: `http://localhost:5173`

---

## 🧪 Running Automated Tests

### Run Backend Pytest Suite
```bash
cd backend
python -m pytest -v
```
*(Tests cover health endpoints, user registration, JWT authentication, invalid credentials, duplicate prevention, and academic course/timetable retrieval).*

### Build Frontend
```bash
cd frontend
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
