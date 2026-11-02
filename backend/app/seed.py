from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.core.security import hash_password
from app.models.user import User, UserRole, StudentProfile, FacultyProfile
from app.models.academic import Course, TimetableSlot, Attendance, Assignment
from app.models.career import JobPosting
from app.models.community import Announcement, CampusEvent


def seed_database(db: Session = None):
    """Seed sample data for immediate development and demonstration."""
    close_db = False
    if db is None:
        init_db()
        db = SessionLocal()
        close_db = True

    try:
        # Check if users already seeded
        if db.query(User).count() > 0:
            return

        # 1. Create Default Users for all 4 roles
        admin = User(
            email="admin@campusflow.edu",
            hashed_password=hash_password("Admin@123"),
            full_name="Dr. Sarah Jenkins",
            role=UserRole.ADMIN,
            department="Dean of Academic Affairs",
            is_active=True,
            is_verified=True,
        )
        db.add(admin)

        faculty = User(
            email="faculty@campusflow.edu",
            hashed_password=hash_password("Faculty@123"),
            full_name="Prof. David Chen",
            role=UserRole.FACULTY,
            department="Computer Science & Engineering",
            is_active=True,
            is_verified=True,
        )
        db.add(faculty)

        placement = User(
            email="placement@campusflow.edu",
            hashed_password=hash_password("Placement@123"),
            full_name="Priya Sharma",
            role=UserRole.PLACEMENT_COORDINATOR,
            department="Career & Placement Cell",
            is_active=True,
            is_verified=True,
        )
        db.add(placement)

        student = User(
            email="student@campusflow.edu",
            hashed_password=hash_password("Student@123"),
            full_name="Alex Morgan",
            role=UserRole.STUDENT,
            department="Computer Science & Engineering",
            is_active=True,
            is_verified=True,
        )
        db.add(student)
        db.flush()

        # Profiles
        admin_prof = FacultyProfile(
            user_id=admin.id,
            employee_id="ADM001",
            designation="Dean of Academics",
            office_room="Admin Block Suite 101",
        )
        faculty_prof = FacultyProfile(
            user_id=faculty.id,
            employee_id="FAC204",
            designation="Professor & HOD",
            specialization="Cloud Computing & Distributed Systems",
            office_room="Block A Room 302",
        )
        placement_prof = FacultyProfile(
            user_id=placement.id,
            employee_id="TPO105",
            designation="Lead Placement Officer",
            specialization="Corporate Industry Relations",
            office_room="Placement Block Room 12",
        )
        student_prof = StudentProfile(
            user_id=student.id,
            roll_number="CS2023048",
            semester=6,
            program="B.Tech Computer Science & Engineering",
            cgpa=8.84,
            attendance_percentage=94.2,
            credits_completed=118,
            total_credits=160,
        )
        db.add_all([admin_prof, faculty_prof, placement_prof, student_prof])

        # 2. Courses
        c1 = Course(
            code="CS301",
            name="Distributed Systems & Cloud Computing",
            description="Fundamental architectural patterns for scalable distributed nodes, consensus protocols, and virtualization.",
            credits=4,
            department="Computer Science",
            semester=6,
            faculty_name="Prof. David Chen",
        )
        c2 = Course(
            code="CS302",
            name="Machine Learning & Deep Neural Nets",
            description="Statistical learning theory, backpropagation, CNNs, transformers, and deployment paradigms.",
            credits=4,
            department="Computer Science",
            semester=6,
            faculty_name="Dr. Sarah Jenkins",
        )
        c3 = Course(
            code="CS303",
            name="Database System Architecture",
            description="Storage engines, indexing, ACID transactions, query planning, and NoSQL engines.",
            credits=3,
            department="Computer Science",
            semester=6,
            faculty_name="Prof. Rajesh Gupta",
        )
        c4 = Course(
            code="CS304",
            name="Software Engineering & DevOps",
            description="CI/CD pipelines, containerization, microservices, testing methodologies and agile lifecycle.",
            credits=3,
            department="Computer Science",
            semester=6,
            faculty_name="Dr. Karen Vance",
        )
        db.add_all([c1, c2, c3, c4])
        db.flush()

        # 3. Timetable Slots
        slots = [
            TimetableSlot(course_id=c1.id, day_of_week="Monday", start_time="09:00", end_time="10:30", room="Lab 301"),
            TimetableSlot(course_id=c2.id, day_of_week="Monday", start_time="11:00", end_time="12:30", room="Hall B"),
            TimetableSlot(course_id=c3.id, day_of_week="Tuesday", start_time="09:30", end_time="11:00", room="Hall C"),
            TimetableSlot(course_id=c4.id, day_of_week="Wednesday", start_time="10:00", end_time="11:30", room="Lab 204"),
            TimetableSlot(course_id=c1.id, day_of_week="Thursday", start_time="14:00", end_time="15:30", room="Lab 301"),
            TimetableSlot(course_id=c2.id, day_of_week="Friday", start_time="10:00", end_time="11:30", room="Hall B"),
        ]
        db.add_all(slots)

        # 4. Assignments
        now = datetime.now(timezone.utc)
        a1 = Assignment(
            course_id=c1.id,
            title="Raft Consensus Algorithm Simulation",
            description="Implement leader election and log replication logic using async message queues in Python.",
            due_date=now + timedelta(days=5),
            max_marks=100,
        )
        a2 = Assignment(
            course_id=c2.id,
            title="Transformer Attention Mechanism from Scratch",
            description="Build multi-head self-attention module using PyTorch or pure NumPy and test on sequence dataset.",
            due_date=now + timedelta(days=9),
            max_marks=100,
        )
        db.add_all([a1, a2])

        # 5. Career & Job Postings
        j1 = JobPosting(
            company_name="Google",
            role_title="Software Engineering Intern - Cloud Systems",
            job_type="Internship",
            location="Bangalore / Hybrid",
            stipend_or_salary="₹1,25,000 / month",
            deadline="15 Nov 2026",
            requirements="Proficiency in Python/Go, Data Structures, Algorithms, Distributed Systems basics.",
        )
        j2 = JobPosting(
            company_name="Microsoft",
            role_title="Full-Stack Engineer - Azure Core",
            job_type="Full-time",
            location="Hyderabad",
            stipend_or_salary="₹24,00,000 / year",
            deadline="30 Nov 2026",
            requirements="React, TypeScript, C#/.NET or Python, REST/gRPC API architecture.",
        )
        j3 = JobPosting(
            company_name="NVIDIA",
            role_title="AI Research Intern - Generative Systems",
            job_type="Internship",
            location="Pune / Remote",
            stipend_or_salary="₹1,10,000 / month",
            deadline="20 Nov 2026",
            requirements="PyTorch, CUDA foundations, Transformer model fine-tuning and inference optimizations.",
        )
        db.add_all([j1, j2, j3])

        # 6. Community Announcements & Events
        an1 = Announcement(
            title="Mid-Semester Examination Schedule Published",
            content="The Mid-Semester timetable for all undergraduate engineering semesters is officially uploaded to the Academic Portal.",
            category="Academic",
            author_id=admin.id,
        )
        an2 = Announcement(
            title="Campus Placement Drive: Top Tier Tech Companies",
            content="Pre-placement talks by Google, Microsoft, and NVIDIA will commence next Monday in the University Auditorium.",
            category="Placement",
            author_id=placement.id,
        )
        db.add_all([an1, an2])

        ev1 = CampusEvent(
            title="HackCampus 2026: 36-Hour National Hackathon",
            description="Flagship annual hackathon across AI, Web3, FinTech, and Sustainable Smart Cities.",
            event_date="Nov 14 - 15, 2026",
            location="University Tech Complex",
            organizer_club="Google Developer Student Club (GDSC)",
            registration_link="https://hackcampus2026.dev",
        )
        ev2 = CampusEvent(
            title="Campus Cultural Festival: Kalotsav 2026",
            description="Inter-college music, theater, design, and literary championships.",
            event_date="Dec 04 - 06, 2026",
            location="Open Air Amphitheatre",
            organizer_club="University Cultural Union",
            registration_link="https://kalotsav.campusflow.edu",
        )
        db.add_all([ev1, ev2])

        # 7. Attendance records
        att1 = Attendance(student_id=student.id, course_id=c1.id, date="2026-10-28", status="present")
        att2 = Attendance(student_id=student.id, course_id=c2.id, date="2026-10-29", status="present")
        att3 = Attendance(student_id=student.id, course_id=c3.id, date="2026-10-30", status="present")
        att4 = Attendance(student_id=student.id, course_id=c4.id, date="2026-10-31", status="present")
        db.add_all([att1, att2, att3, att4])

        db.commit()
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully with initial users, courses, jobs, and events.")
