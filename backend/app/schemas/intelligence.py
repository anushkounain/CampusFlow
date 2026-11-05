from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict


class PlacementPredictionRequest(BaseModel):
    ssc_p: float = 75.0
    hsc_p: float = 72.0
    degree_p: float = 78.0
    workex: int = 1
    etest_p: float = 80.0
    dsa_solved: int = 180
    github_commits: int = 120


class PlacementSimulationRequest(BaseModel):
    base_features: PlacementPredictionRequest
    deltas: Dict[str, float] = {"degree_p": 4.0, "workex": 1, "dsa_solved": 50}


class AcademicRiskAssessmentRequest(BaseModel):
    study_hours_weekly: float = 12.0
    attendance_rate: float = 85.0
    midterm_avg: float = 74.0
    quiz_avg: float = 76.0
    assignment_completion_rate: float = 90.0
    past_failures: int = 0
    extracurricular_hours: float = 6.0


class SkillMatchRequest(BaseModel):
    student_skills: List[str]
    required_skills: List[str]
    preferred_skills: Optional[List[str]] = []
