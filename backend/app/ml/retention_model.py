import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


class AcademicRetentionMLPipeline:
    """Early warning system detecting academic retention risk and advising pedagogical interventions."""

    FEATURE_NAMES = [
        "study_hours_weekly", "attendance_rate", "midterm_avg",
        "quiz_avg", "assignment_completion_rate", "past_failures", "extracurricular_hours"
    ]
    CLASS_LABELS = ["DEANS_LIST", "GOOD_STANDING", "MODERATE_RISK", "CRITICAL_RISK"]

    def __init__(self):
        self.scaler = StandardScaler()
        self.classifier = RandomForestClassifier(
            n_estimators=100, max_depth=5, class_weight="balanced", random_state=42
        )
        self.metrics: Dict[str, Any] = {}
        self.is_fitted = False

    def train_from_csv(self, csv_path: str) -> Dict[str, Any]:
        """Train classifier on academic retention benchmark dataset."""
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"Retention dataset not found at {csv_path}")

        df = pd.read_csv(csv_path)

        X = df[self.FEATURE_NAMES].values
        y = df["risk_category"].values

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.25, random_state=42, stratify=y
        )

        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        self.classifier.fit(X_train_scaled, y_train)
        y_pred = self.classifier.predict(X_test_scaled)

        acc = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred, labels=self.CLASS_LABELS).tolist()

        self.is_fitted = True
        self.metrics = {
            "accuracy": round(float(acc), 4),
            "total_records": len(df),
            "classes": self.CLASS_LABELS,
            "confusion_matrix": cm,
            "feature_importance": {
                name: round(float(imp), 4)
                for name, imp in zip(self.FEATURE_NAMES, self.classifier.feature_importances_)
            }
        }
        return self.metrics

    def assess_student(self, feature_dict: Dict[str, float]) -> Dict[str, Any]:
        """Assess student profile and return risk category with actionable advisory recommendations."""
        if not self.is_fitted:
            raise RuntimeError("Retention model pipeline is not trained.")

        vec = np.array([[feature_dict.get(k, 0.0) for k in self.FEATURE_NAMES]])
        vec_scaled = self.scaler.transform(vec)

        predicted_class = self.classifier.predict(vec_scaled)[0]
        probs = self.classifier.predict_proba(vec_scaled)[0]
        prob_dict = {
            cls_name: round(float(p), 3)
            for cls_name, p in zip(self.classifier.classes_, probs)
        }

        # Determine pedagogical intervention plan
        interventions = []
        att = feature_dict.get("attendance_rate", 100.0)
        assign = feature_dict.get("assignment_completion_rate", 100.0)
        fails = feature_dict.get("past_failures", 0)

        if att < 75.0:
            interventions.append("Attendance below statutory 75% limit. Schedule mandatory faculty-advisor meeting.")
        if assign < 70.0:
            interventions.append("Assignment completion lagging. Assign peer teaching assistant (TA) study mentor.")
        if fails > 0:
            interventions.append("Past backlog identified. Register for weekend remedial problem-solving clinics.")

        if not interventions and predicted_class == "DEANS_LIST":
            interventions.append("Excellent standing. Nominate for Undergraduate Research Fellowship & Honors electives.")
        elif not interventions:
            interventions.append("Steady trajectory. Maintain current study rhythm and monitor semester milestones.")

        return {
            "risk_category": predicted_class,
            "confidence": prob_dict.get(predicted_class, 0.0),
            "class_probabilities": prob_dict,
            "actionable_interventions": interventions,
            "primary_driver": max(
                self.metrics["feature_importance"].items(), key=lambda x: x[1]
            )[0] if self.metrics.get("feature_importance") else "attendance_rate",
        }
