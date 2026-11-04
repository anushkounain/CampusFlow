# CampusFlow

> **One campus. Every possibility.**

CampusFlow is an enterprise-grade, intelligent Student Life Management Platform that unifies academic management, AI-powered study assistance, career development, peer collaboration, campus commerce, and institutional governance into a single cohesive SaaS application.

---

## 🏛️ System Architecture

CampusFlow is architected around modular micro-services principles within a high-performance Python/FastAPI backend and a React/TypeScript single-page application.

```
                              ┌──────────────────────────────────────────────┐
                              │          CampusFlow Frontend Client          │
                              │       React 19 • TypeScript • Vite 8         │
                              │   Tailwind CSS v4 • Lucide • TanStack Query  │
                              └──────────────────────┬───────────────────────┘
                                                     │  RESTful JSON API (JWT Bearer)
                                                     ▼
                              ┌──────────────────────────────────────────────┐
                              │          FastAPI High-Throughput Core        │
                              │    Pydantic V2 Validation • Role Middleware   │
                              │      Zero-Trust RBAC Security Dependencies   │
                              └───────┬──────────────────────┬───────────────┘
                                      │                      │
                      ┌───────────────▼───────┐      ┌───────▼──────────────────────┐
                      │   Relational Storage  │      │       AI & RAG Engine        │
                      │  SQLAlchemy 2.0 Engine│      │  Semantic Sliding Window Chunks│
                      │ (PostgreSQL / SQLite) │      │  Cosine Retrieval & Citations │
                      └───────────────────────┘      └──────────────────────────────┘
```

---

## 🚀 Technology Stack

### Frontend Architecture
- **Framework**: React 19 + TypeScript (Strict typing, zero lint bypasses)
- **Tooling**: Vite 8 with HMR
- **Styling**: Tailwind CSS v4 (Minimalist university SaaS theme, Slate & Royal Blue palette)
- **Icons**: Lucide React
- **Routing**: React Router v7 with route-level authentication guards
- **Data Fetching & State**: TanStack Query v5 + Context API

### Backend Architecture
- **API Engine**: Python 3.13 + FastAPI
- **ORM & Database**: SQLAlchemy 2.0 (PostgreSQL enterprise-ready with instant SQLite development engine)
- **Validation**: Pydantic V2 (`BaseModel`, `ConfigDict`, `EmailStr`)
- **Authentication**: Cryptographic JWT access tokens (`HS256`, 24-hr expiry) & salted `bcrypt` hashing
- **Authorization**: Endpoint-level Role-Based Access Control (`require_roles` dependencies)
- **RAG Engine**: Vector cosine similarity over sliding-window document chunks with source citation
- **Auditing**: Immutable security audit ledger (`AuditLog`)

### Quality Assurance & Automated Testing
- **Backend Tests**: Pytest + FastAPI TestClient (13 comprehensive automated test suites)
- **Frontend Verification**: TypeScript typecheck (`tsc -b`) & Vite production bundling (zero errors)

---

## 👥 Role-Based Access Control (RBAC)

The system enforces permissions at the backend layer with tailored experiences for four primary campus personas:

| Role | Permissions & Functional Access | Default Demo Credentials |
| :--- | :--- | :--- |
| **Student** | Timetable, grades, course documents, assignment submissions, RAG search, flashcards, job applications, discussions, marketplace trades | `student@campusflow.edu` / `Student@123` |
| **Faculty** | Curriculum authoring, lecture schedules, grading, document indexing, discussion moderation, announcements | `faculty@campusflow.edu` / `Faculty@123` |
| **Placement Coordinator** | Manage recruitment drives, review candidate profiles, track applications, analyze CTC metrics | `placement@campusflow.edu` / `Placement@123` |
| **College Administrator** | System governance, department allocation, institutional analytics, audit log inspection, user verification | `admin@campusflow.edu` / `Admin@123` |

---

## 📦 Application Modules

- **A. Academic Management**: Course catalog (`CS301` to `CS304`), weekly lecture timetable matrix, attendance verification, assignments, and solution submissions.
- **B. AI Study Assistant & RAG Engine**: Semantic document chunking, vector retrieval, source citations, diagnostic quizzes with instant feedback, interactive flashcard decks, and 4-week study roadmaps.
- **C. Career & Placement Hub**: Verified job & internship listings (Google, Microsoft, NVIDIA), 1-click candidate applications, and real-time candidate pipeline tracking.
- **D. Campus Discussions & Study Groups**: Peer Q&A forum with tags, upvotes, faculty-verified solutions, and collaborative study group scheduling.
- **E. Campus Marketplace**: Student peer-to-peer textbook exchanges, dorm equipment, bicycles, and lost & found claim registry.
- **F. Institutional Analytics & Governance**: Semester transcript gradebook (SGPA & CGPA calculation), attendance compliance risk radar (<75%), and placement package distributions.
- **G. Security & Audit Trails**: Tamper-evident operational ledger recording authentication, role assignments, document indexing, and system modifications.

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
*The database automatically initializes and seeds all 14 domain entities on first boot.*

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
*(All 13 test suites covering health, auth, academics, RAG search, discussions, marketplace, and audit logging).*

### Build Frontend
```bash
cd frontend
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
