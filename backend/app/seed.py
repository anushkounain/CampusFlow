from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.core.security import hash_password
from app.models.user import User, UserRole, StudentProfile, FacultyProfile
from app.models.academic import Course, TimetableSlot, Attendance, Assignment, GradeRecord
from app.models.career import JobPosting, StudentSkill, InterviewPrepQuestion
from app.models.community import Announcement, CampusEvent
from app.models.document import Document, DocumentChunk, FlashcardDeck, FlashcardCard
from app.models.discussion import DiscussionThread, DiscussionComment, StudyGroup, StudyGroupMember
from app.models.marketplace import MarketplaceListing
from app.models.audit import AuditLog
from app.services.rag_service import RAGProcessor


def seed_database(db: Session = None):
    """Seed comprehensive sample data across all university lifecycle modules."""
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
        faculty = User(
            email="faculty@campusflow.edu",
            hashed_password=hash_password("Faculty@123"),
            full_name="Prof. David Chen",
            role=UserRole.FACULTY,
            department="Computer Science & Engineering",
            is_active=True,
            is_verified=True,
        )
        placement = User(
            email="placement@campusflow.edu",
            hashed_password=hash_password("Placement@123"),
            full_name="Priya Sharma",
            role=UserRole.PLACEMENT_COORDINATOR,
            department="Career & Placement Cell",
            is_active=True,
            is_verified=True,
        )
        student = User(
            email="student@campusflow.edu",
            hashed_password=hash_password("Student@123"),
            full_name="Alex Morgan",
            role=UserRole.STUDENT,
            department="Computer Science & Engineering",
            is_active=True,
            is_verified=True,
        )
        db.add_all([admin, faculty, placement, student])
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

        # 6. Student Skills & Interview Prep
        s1 = StudentSkill(student_id=student.id, skill_name="Distributed Systems", proficiency="Advanced", years_experience=2, is_verified=True)
        s2 = StudentSkill(student_id=student.id, skill_name="Python / FastAPI", proficiency="Expert", years_experience=3, is_verified=True)
        s3 = StudentSkill(student_id=student.id, skill_name="React & TypeScript", proficiency="Advanced", years_experience=2, is_verified=True)
        db.add_all([s1, s2, s3])

        q1 = InterviewPrepQuestion(
            company_name="Google",
            role_category="Distributed Systems",
            question_text="How do you detect split-brain situations in quorum-based consensus systems like Paxos or Raft?",
            difficulty="Hard",
            recommended_approach="Explain strict majority quorum intersection (N/2 + 1) invariant guarantees.",
        )
        q2 = InterviewPrepQuestion(
            company_name="Microsoft",
            role_category="Full-Stack",
            question_text="Describe how you prevent optimistic concurrency conflicts in relational distributed databases.",
            difficulty="Medium",
            recommended_approach="Use version numbering or timestamp fields with conditional UPDATE statements.",
        )
        db.add_all([q1, q2])

        # 7. Community Announcements & Events
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

        # 8. Attendance Records
        att1 = Attendance(student_id=student.id, course_id=c1.id, date="2026-10-28", status="present")
        att2 = Attendance(student_id=student.id, course_id=c2.id, date="2026-10-29", status="present")
        att3 = Attendance(student_id=student.id, course_id=c3.id, date="2026-10-30", status="present")
        att4 = Attendance(student_id=student.id, course_id=c4.id, date="2026-10-31", status="present")
        db.add_all([att1, att2, att3, att4])

        # 9. Academic Grades (Gradebook & SGPA Calculation)
        grades = [
            GradeRecord(student_id=student.id, course_id=c1.id, semester=5, letter_grade="A+", grade_point=10.0, credit_hours=4, remarks="Exceptional"),
            GradeRecord(student_id=student.id, course_id=c2.id, semester=5, letter_grade="A", grade_point=9.0, credit_hours=4, remarks="Excellent"),
            GradeRecord(student_id=student.id, course_id=c3.id, semester=5, letter_grade="A", grade_point=9.0, credit_hours=3, remarks="Excellent"),
            GradeRecord(student_id=student.id, course_id=c4.id, semester=5, letter_grade="B+", grade_point=8.0, credit_hours=3, remarks="Good"),
            GradeRecord(student_id=student.id, course_id=c1.id, semester=4, letter_grade="A+", grade_point=10.0, credit_hours=4, remarks="Outstanding"),
            GradeRecord(student_id=student.id, course_id=c2.id, semester=4, letter_grade="A", grade_point=9.0, credit_hours=4, remarks="Very Good"),
        ]
        db.add_all(grades)

        # 10. Indexed Course Documents & Semantic Chunks for RAG
        sample_syllabus_text = (
            "Distributed Systems course syllabus covers quorum consensus protocols, RPC serialization, "
            "vector clocks, and Paxos and Raft algorithms. In partitioned networks, the CAP theorem states "
            "that a distributed system cannot simultaneously guarantee Consistency, Availability, and Partition Tolerance. "
            "Raft breaks leader election into terms. A leader heartbeats to followers to prevent election timeouts. "
            "Log replication ensures state machine replication consistency across all live cluster nodes."
        )
        doc1 = Document(
            title="CS301 Distributed Systems Lecture Notes & Syllabus",
            filename="CS301_Distributed_Systems_Complete.pdf",
            file_size_bytes=len(sample_syllabus_text.encode('utf-8')),
            course_id=c1.id,
            uploader_id=faculty.id,
            summary="Official lecture notes on consensus protocols, Raft, Paxos, and distributed storage engines.",
            page_count=14,
        )
        db.add(doc1)
        db.flush()

        chunks = RAGProcessor.chunk_text(sample_syllabus_text, chunk_size=30, chunk_overlap=10)
        for ch in chunks:
            chunk_rec = DocumentChunk(
                document_id=doc1.id,
                chunk_index=ch["chunk_index"],
                page_number=1 + ch["chunk_index"],
                content=ch["content"],
                token_count=ch["token_count"],
                keywords=ch["keywords"],
            )
            db.add(chunk_rec)

        # 11. Flashcard Decks
        deck1 = FlashcardDeck(
            user_id=student.id,
            title="Distributed Systems Exam Prep",
            topic="CS301 Distributed Systems",
            description="Core flashcards covering Raft, Vector Clocks, and CAP Theorem.",
        )
        db.add(deck1)
        db.flush()

        fc1 = FlashcardCard(deck_id=deck1.id, front="What is the CAP Theorem?", back="Trade-off between Consistency, Availability, and Partition Tolerance.", difficulty="medium")
        fc2 = FlashcardCard(deck_id=deck1.id, front="How does Raft resolve leader election split votes?", back="Randomized election timeouts ensure one candidate initiates election before others.", difficulty="hard")
        db.add_all([fc1, fc2])

        # 12. Campus Discussions & Study Groups
        thread1 = DiscussionThread(
            course_id=c1.id,
            author_id=student.id,
            title="Difference between Lamport Timestamps and Vector Clocks?",
            content="Can someone explain with an example why Lamport timestamps cannot detect concurrent events whereas Vector Clocks can?",
            tags="Distributed Systems, Clocks, Concurrency",
            upvotes=12,
            views=45,
            is_resolved=True,
        )
        db.add(thread1)
        db.flush()

        comment1 = DiscussionComment(
            thread_id=thread1.id,
            author_id=faculty.id,
            content="Lamport timestamps give a total order consistent with causality, but L(a) < L(b) does not imply a caused b. Vector clocks track per-process causal history, allowing detection of concurrent events if neither vector dominates the other.",
            is_solution=True,
            upvotes=8,
        )
        db.add(comment1)

        group1 = StudyGroup(
            name="Cloud Systems & Distributed Lab Circle",
            course_id=c1.id,
            description="Collaborative group implementing Raft consensus simulation in Python.",
            meeting_schedule="Thursdays 6:00 PM",
            meeting_link="https://meet.campusflow.edu/cs301-lab",
            max_members=6,
            created_by_id=student.id,
        )
        db.add(group1)
        db.flush()
        db.add(StudyGroupMember(group_id=group1.id, user_id=student.id))

        # 13. Marketplace Listings
        m1 = MarketplaceListing(
            title="Operating System Concepts (Silberschatz - 10th Edition)",
            description="Official textbook with clean pages, negligible pencil markings. Covers OS scheduling and virtual memory.",
            category="Textbook",
            price="₹650",
            condition="Like New",
            seller_id=student.id,
            status="available",
            contact_phone_or_email="student@campusflow.edu",
        )
        m2 = MarketplaceListing(
            title="Hero Sprint Pro 21-Speed Geared Mountain Bicycle",
            description="Serviced last month with new dual disc brakes and LED headlights. Perfect for campus commuting.",
            category="Bicycle",
            price="₹3,200",
            condition="Good",
            seller_id=student.id,
            status="available",
            contact_phone_or_email="student@campusflow.edu",
        )
        m3 = MarketplaceListing(
            title="FOUND: Silver Casio Scientific Calculator (FX-991EX)",
            description="Discovered in Central Library 2nd Floor Silent Study Section. Owner can claim by verifying serial number.",
            category="Lost & Found",
            price="Free / Claim",
            condition="Good",
            seller_id=faculty.id,
            status="available",
            contact_phone_or_email="faculty@campusflow.edu",
        )
        db.add_all([m1, m2, m3])

        # 14. Initial Security & Audit Logs
        log1 = AuditLog(
            user_id=admin.id,
            action="SYSTEM_INIT",
            entity_type="System",
            entity_id="1",
            details='{"event": "CampusFlow Initialized with Full RBAC"}',
            ip_address="127.0.0.1",
        )
        log2 = AuditLog(
            user_id=faculty.id,
            action="DOCUMENT_INDEX",
            entity_type="Document",
            entity_id=str(doc1.id),
            details='{"title": "CS301 Lecture Notes", "chunks": 5}',
            ip_address="127.0.0.1",
        )
        db.add_all([log1, log2])

        db.commit()
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully with all extended enterprise modules.")
