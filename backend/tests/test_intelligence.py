from app.ml.registry import ModelRegistry


def test_ml_training_and_telemetry():
    registry = ModelRegistry.get_instance()
    assert registry.is_initialized is True

    telemetry = registry.get_telemetry()
    assert telemetry["status"] == "operational"
    assert "placement_model" in telemetry
    assert "retention_model" in telemetry

    # Placement model accuracy and ROC-AUC
    p_metrics = telemetry["placement_model"]["metrics"]
    assert p_metrics["accuracy"] >= 0.70
    assert p_metrics["roc_auc"] >= 0.70
    assert "degree_p" in p_metrics["feature_importances"]

    # Retention model
    r_metrics = telemetry["retention_model"]["metrics"]
    assert r_metrics["accuracy"] >= 0.65


def test_placement_inference_and_simulation():
    registry = ModelRegistry.get_instance()

    features = {
        "ssc_p": 78.0,
        "hsc_p": 74.0,
        "degree_p": 82.0,
        "workex": 1,
        "etest_p": 85.0,
        "dsa_solved": 200,
        "github_commits": 140,
    }
    pred = registry.placement_pipeline.predict(features)
    assert 0.0 <= pred["placement_probability"] <= 1.0
    assert pred["projected_salary_lpa"] >= 3.5
    assert len(pred["top_factors"]) > 0

    # Test what-if counterfactual simulation
    sim = registry.placement_pipeline.simulate_what_if(
        features,
        deltas={"degree_p": 5.0, "dsa_solved": 60}
    )
    assert "baseline" in sim
    assert "simulated" in sim
    assert "deltas" in sim


def test_academic_retention_assessment():
    registry = ModelRegistry.get_instance()

    # High-risk profile (low attendance, past failures)
    at_risk_student = {
        "study_hours_weekly": 4.0,
        "attendance_rate": 62.0,
        "midterm_avg": 45.0,
        "quiz_avg": 50.0,
        "assignment_completion_rate": 55.0,
        "past_failures": 2,
        "extracurricular_hours": 10.0,
    }
    assessment = registry.retention_pipeline.assess_student(at_risk_student)
    assert assessment["risk_category"] in ["CRITICAL_RISK", "MODERATE_RISK"]
    assert len(assessment["actionable_interventions"]) > 0

    # High-performing profile
    top_student = {
        "study_hours_weekly": 22.0,
        "attendance_rate": 96.0,
        "midterm_avg": 92.0,
        "quiz_avg": 94.0,
        "assignment_completion_rate": 98.0,
        "past_failures": 0,
        "extracurricular_hours": 4.0,
    }
    top_assessment = registry.retention_pipeline.assess_student(top_student)
    assert top_assessment["risk_category"] in ["DEANS_LIST", "GOOD_STANDING"]


def test_skill_gap_matching():
    registry = ModelRegistry.get_instance()

    student_skills = ["Python", "FastAPI", "React", "Git"]
    required_skills = ["Python", "Docker", "Kubernetes", "Distributed Systems"]
    preferred_skills = ["React", "TypeScript"]

    match_report = registry.skill_matcher.analyze_match(student_skills, required_skills, preferred_skills)
    assert 0 <= match_report["match_percentage"] <= 100
    assert "Python" in match_report["matched_required_skills"]
    assert "Docker" in match_report["missing_required_skills"]
    assert len(match_report["recommended_courses"]) > 0


def test_intelligence_api_endpoints(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@campusflow.edu", "password": "Student@123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Model status
    status_resp = client.get("/api/v1/intelligence/models/status", headers=headers)
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "operational"

    # Placement prediction
    predict_resp = client.post(
        "/api/v1/intelligence/placement/predict",
        headers=headers,
        json={
            "ssc_p": 72.0,
            "hsc_p": 70.0,
            "degree_p": 76.0,
            "workex": 1,
            "etest_p": 78.0,
            "dsa_solved": 150,
            "github_commits": 90,
        },
    )
    assert predict_resp.status_code == 200
    pred_data = predict_resp.json()
    assert "placement_percentage" in pred_data
    assert "projected_salary_lpa" in pred_data

    # Skills matching
    skill_resp = client.post(
        "/api/v1/intelligence/skills/match",
        headers=headers,
        json={
            "student_skills": ["Python", "SQL"],
            "required_skills": ["Python", "PostgreSQL", "Docker"],
            "preferred_skills": ["React"],
        },
    )
    assert skill_resp.status_code == 200
    assert "match_percentage" in skill_resp.json()
