import json
import os
from typing import List, Dict, Any


class SkillGapMatcher:
    """Matches candidate profile competencies against industry job descriptions and recommends curriculum bridge courses."""

    def __init__(self, taxonomy_path: str = None):
        self.taxonomy = {}
        if taxonomy_path and os.path.exists(taxonomy_path):
            with open(taxonomy_path, "r", encoding="utf-8") as f:
                self.taxonomy = json.load(f)

    def analyze_match(
        self,
        student_skills: List[str],
        required_skills: List[str],
        preferred_skills: List[str] = None
    ) -> Dict[str, Any]:
        """Compute match percentage, missing skills, and recommended bridge courses."""
        preferred_skills = preferred_skills or []

        student_norm = {s.strip().lower() for s in student_skills}
        req_norm = {s.strip().lower(): s for s in required_skills}
        pref_norm = {s.strip().lower(): s for s in preferred_skills}

        matched_req = [req_norm[s] for s in req_norm if s in student_norm]
        missing_req = [req_norm[s] for s in req_norm if s not in student_norm]

        matched_pref = [pref_norm[s] for s in pref_norm if s in student_norm]
        missing_pref = [pref_norm[s] for s in pref_norm if s not in student_norm]

        # Weighted match formula (80% weight on required, 20% on preferred)
        req_score = (len(matched_req) / max(len(required_skills), 1)) * 100
        pref_score = (len(matched_pref) / max(len(preferred_skills), 1)) * 100 if preferred_skills else 100
        overall_score = round(0.8 * req_score + 0.2 * pref_score, 1)

        # Map missing skills to courses from university curriculum
        recommended_courses = []
        course_map = {
            "distributed systems": {"code": "CS301", "name": "Distributed Systems & Cloud Computing"},
            "docker": {"code": "CS304", "name": "Software Engineering & DevOps"},
            "kubernetes": {"code": "CS304", "name": "Software Engineering & DevOps"},
            "pytorch": {"code": "CS302", "name": "Machine Learning & Deep Neural Nets"},
            "sql": {"code": "CS303", "name": "Database System Architecture"},
            "postgresql": {"code": "CS303", "name": "Database System Architecture"},
            "fastapi": {"code": "CS304", "name": "Software Engineering & DevOps"},
        }

        for m in missing_req + missing_pref:
            low = m.lower()
            if low in course_map and course_map[low] not in recommended_courses:
                recommended_courses.append(course_map[low])

        # If no direct map found, recommend default engineering core
        if not recommended_courses and missing_req:
            recommended_courses.append({"code": "CS301", "name": "Distributed Systems & Cloud Computing"})

        return {
            "match_percentage": overall_score,
            "status": "Ready for Interview" if overall_score >= 75.0 else ("Competitive" if overall_score >= 50.0 else "Skill Gap Identified"),
            "matched_required_skills": matched_req,
            "missing_required_skills": missing_req,
            "matched_preferred_skills": matched_pref,
            "missing_preferred_skills": missing_pref,
            "recommended_courses": recommended_courses,
        }
