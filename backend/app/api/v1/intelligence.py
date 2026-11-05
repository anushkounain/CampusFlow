from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User, UserRole
from app.ml.registry import ModelRegistry
from app.schemas.intelligence import (
    PlacementPredictionRequest,
    PlacementSimulationRequest,
    AcademicRiskAssessmentRequest,
    SkillMatchRequest,
)
from app.services.audit_service import AuditService

router = APIRouter(prefix="/intelligence", tags=["Campus ML & Intelligence"])


@router.get("/models/status")
def get_ml_status(current_user: User = Depends(get_current_user)):
    """Retrieve machine learning model telemetry, training sample counts, and evaluation metrics."""
    registry = ModelRegistry.get_instance()
    return registry.get_telemetry()


@router.post("/models/retrain")
def retrain_models(
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    """Retrain all machine learning pipelines on updated benchmark datasets (Admin only)."""
    registry = ModelRegistry.get_instance()
    res = registry.initialize_pipelines()

    AuditService.log_event(
        db=db,
        action="ML_MODELS_RETRAIN",
        entity_type="ModelRegistry",
        entity_id="ProductionModels",
        user_id=current_user.id,
        details=res,
    )
    return res


@router.post("/placement/predict")
def predict_placement_probability(
    req: PlacementPredictionRequest,
    current_user: User = Depends(get_current_user),
):
    """Predict placement likelihood and projected salary package using Random Forest & Gradient Boosting."""
    registry = ModelRegistry.get_instance()
    return registry.placement_pipeline.predict(req.model_dump())


@router.post("/placement/simulate")
def simulate_career_what_if(
    req: PlacementSimulationRequest,
    current_user: User = Depends(get_current_user),
):
    """Run counterfactual simulation calculating the exact career impact of GPA and internship gains."""
    registry = ModelRegistry.get_instance()
    return registry.placement_pipeline.simulate_what_if(
        base_features=req.base_features.model_dump(),
        deltas=req.deltas,
    )


@router.post("/academic-risk/assess")
def assess_academic_risk(
    req: AcademicRiskAssessmentRequest,
    current_user: User = Depends(get_current_user),
):
    """Classify academic retention risk and compute custom pedagogical intervention strategies."""
    registry = ModelRegistry.get_instance()
    return registry.retention_pipeline.assess_student(req.model_dump())


@router.get("/academic-risk/cohort")
def get_cohort_risk_overview(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.FACULTY)),
    db: Session = Depends(get_db),
):
    """Aggregated academic risk cohort view for academic advisors and deans."""
    registry = ModelRegistry.get_instance()

    # Query students and evaluate each through the trained ML pipeline
    students = db.query(User).filter(User.role == UserRole.STUDENT).all()
    cohort_evaluations = []

    for s in students:
        p = s.student_profile
        cgpa = p.cgpa if p else 8.5
        att = p.attendance_percentage if p else 90.0

        features = {
            "study_hours_weekly": 16.0 if cgpa >= 8.5 else 10.0,
            "attendance_rate": att,
            "midterm_avg": cgpa * 9.5,
            "quiz_avg": cgpa * 9.8,
            "assignment_completion_rate": 95.0 if att >= 80 else 65.0,
            "past_failures": 0 if cgpa >= 7.0 else 1,
            "extracurricular_hours": 6.0,
        }
        assessment = registry.retention_pipeline.assess_student(features)
        cohort_evaluations.append({
            "student_id": s.id,
            "name": s.full_name,
            "roll_number": p.roll_number if p else "N/A",
            "current_cgpa": cgpa,
            "attendance_rate": att,
            "risk_category": assessment["risk_category"],
            "interventions": assessment["actionable_interventions"],
        })

    # Summary counts
    counts = {"DEANS_LIST": 0, "GOOD_STANDING": 0, "MODERATE_RISK": 0, "CRITICAL_RISK": 0}
    for item in cohort_evaluations:
        cat = item["risk_category"]
        counts[cat] = counts.get(cat, 0) + 1

    return {
        "summary": counts,
        "students": cohort_evaluations,
    }


@router.post("/skills/match")
def match_skills(
    req: SkillMatchRequest,
    current_user: User = Depends(get_current_user),
):
    """Analyze skill match against job openings and recommend university courses to bridge gaps."""
    registry = ModelRegistry.get_instance()
    return registry.skill_matcher.analyze_match(
        student_skills=req.student_skills,
        required_skills=req.required_skills,
        preferred_skills=req.preferred_skills,
    )
