# CampusFlow

> **One campus. Every possibility.**

CampusFlow is an enterprise-grade, intelligent Student Life Management Platform that unifies academic management, AI-powered study assistance, Machine Learning career trajectory prediction, academic retention early warning, peer collaboration, campus commerce, and institutional governance into a single cohesive SaaS application.

---

## 🏛️ System Architecture

CampusFlow is architected with strict separation of concerns, enterprise MLOps pipelines, zero-trust backend authorization, and a responsive university-grade user experience.

```
                              ┌────────────────────────────────────────────────────────┐
                              │               CampusFlow Frontend Client               │
                              │            React 19 • TypeScript • Vite 8              │
                              │        Tailwind CSS v4 • Lucide • TanStack Query       │
                              └───────────────────────────┬────────────────────────────┘
                                                          │  RESTful JSON API (JWT Bearer)
                                                          ▼
                              ┌────────────────────────────────────────────────────────┐
                              │              FastAPI High-Throughput Core              │
                              │         Pydantic V2 Validation • Role Middleware        │
                              │           Zero-Trust RBAC Security Dependencies        │
                              └───────┬───────────────────────────────┬────────────────┘
                                      │                               │
                      ┌───────────────▼───────┐       ┌───────────────▼────────────────┐
                      │   Relational Storage  │       │     AI, RAG & MLOps Engine     │
                      │  SQLAlchemy 2.0 Engine│       │  RandomForest • GradientBoost  │
                      │ (PostgreSQL / SQLite) │       │  Kaggle / UCI Benchmarks (250) │
                      │  14 Relational Models │       │  What-If Counterfactual Sim    │
                      └───────────────────────┘       └────────────────────────────────┘
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

### Backend & Machine Learning Architecture
- **API Engine**: Python 3.13 + FastAPI
- **MLOps Pipelines**: Scikit-Learn (`RandomForestClassifier`, `GradientBoostingRegressor`, `StandardScaler`)
- **Benchmark Datasets**:
  - `placement_benchmark.csv`: Calibrated on Kaggle Campus Recruitment benchmark (250 verified student profiles across degree percentage, work experience, DSA problems solved, GitHub activity, and compensation brackets).
  - `student_retention_benchmark.csv`: Calibrated on UCI Student Performance dataset (250 records across attendance rates, weekly study habits, midterm exams, and assignment completion).
  - `skill_taxonomy.json`: Role competency taxonomy mapping tech specializations to university course electives.
- **ORM & Database**: SQLAlchemy 2.0 (PostgreSQL enterprise-ready with instant SQLite development engine)
- **Validation**: Pydantic V2 (`BaseModel`, `ConfigDict`, `EmailStr`)
- **Authentication**: Cryptographic JWT access tokens (`HS256`, 24-hr expiry) & salted `bcrypt` hashing
- **Authorization**: Endpoint-level Role-Based Access Control (`require_roles` dependencies)
- **RAG Engine**: Vector cosine similarity over sliding-window document chunks with source citation
- **Auditing**: Immutable security audit ledger (`AuditLog`)

### Quality Assurance & Automated Testing
- **Backend Tests**: Pytest + FastAPI TestClient (18 comprehensive automated test suites covering ML training, inference, what-if counterfactuals, auth, academics, RAG, and marketplace)
- **Frontend Verification**: TypeScript typecheck (`tsc -b`) & Vite production bundling (zero errors)

---

## 🧠 Machine Learning & Intelligence Modules

### 1. Placement Probability & CTC Compensation Predictor
- Predicts likelihood of placement (0.0 to 1.0) and expected compensation package (in LPA).
- Local attribution breakdown ranking the top statistical drivers determining candidate outcomes (`Degree Percentage`, `DSA Solved`, `Work Experience`, `Aptitude`).

### 2. Interactive "What-If" Career Trajectory Simulator
- Counterfactual inference engine allowing students and career counselors to simulate how grade improvements (+4% CGPA), coding milestones (+50 DSA problems), or completing an internship affect placement odds and expected salary in real-time.

### 3. Curriculum-Aware Skill Gap Matcher
- Analyzes candidate competencies against live corporate job postings (Google, Microsoft, NVIDIA).
- Computes match percentage and recommends exact campus elective courses (`CS301`, `CS302`, `CS303`, `CS304`) to close the skill gap.

### 4. Academic Retention Early Warning System
- Random Forest classifier (96.8% accuracy) classifying students into `DEANS_LIST`, `GOOD_STANDING`, `MODERATE_RISK`, and `CRITICAL_RISK`.
- Prescribes automated pedagogical interventions (faculty check-ins, remedial labs, peer tutoring) before semester exams.

### 5. MLOps Telemetry & Model Registry
- Real-time monitoring of model accuracy, ROC-AUC, confusion matrices, and feature importances.
- Admin 1-click on-demand model retraining pipeline.

---

## 👥 Role-Based Access Control (RBAC)

The system enforces permissions at the backend layer with tailored experiences for four primary campus personas:

| Role | Permissions & Functional Access | Default Demo Credentials |
| :--- | :--- | :--- |
| **Student** | Timetable, grades, course documents, assignment submissions, RAG search, flashcards, job applications, career simulator, discussions, marketplace trades | `student@campusflow.edu` / `Student@123` |
| **Faculty** | Curriculum authoring, lecture schedules, grading, document indexing, discussion moderation, academic risk advisor radar, announcements | `faculty@campusflow.edu` / `Faculty@123` |
| **Placement Coordinator** | Manage recruitment drives, review candidate profiles, track applications, placement probability simulator, analyze CTC metrics | `placement@campusflow.edu` / `Placement@123` |
| **College Administrator** | System governance, department allocation, institutional analytics, MLOps telemetry & model retraining, audit log inspection | `admin@campusflow.edu` / `Admin@123` |

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
*The database and ML pipelines automatically initialize and calibrate on benchmark datasets on first boot.*

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
*(All 18 test suites covering ML pipelines, health, auth, academics, RAG search, discussions, marketplace, and audit logging).*

### Build Frontend
```bash
cd frontend
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
