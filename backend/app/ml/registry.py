import os
from typing import Dict, Any, Optional
from app.ml.placement_model import PlacementMLPipeline
from app.ml.retention_model import AcademicRetentionMLPipeline
from app.ml.skill_matcher import SkillGapMatcher


class ModelRegistry:
    """Central singleton managing machine learning pipelines, metrics, and inference."""

    _instance: Optional["ModelRegistry"] = None

    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.datasets_dir = os.path.join(self.base_dir, "datasets")
        
        self.placement_pipeline = PlacementMLPipeline()
        self.retention_pipeline = AcademicRetentionMLPipeline()
        self.skill_matcher = SkillGapMatcher(os.path.join(self.datasets_dir, "skill_taxonomy.json"))
        
        self.is_initialized = False
        self.initialization_error: Optional[str] = None

    @classmethod
    def get_instance(cls) -> "ModelRegistry":
        if cls._instance is None:
            cls._instance = ModelRegistry()
            cls._instance.initialize_pipelines()
        return cls._instance

    def initialize_pipelines(self) -> Dict[str, Any]:
        """Load benchmark data and train ML pipelines."""
        try:
            placement_csv = os.path.join(self.datasets_dir, "placement_benchmark.csv")
            retention_csv = os.path.join(self.datasets_dir, "student_retention_benchmark.csv")
            
            p_metrics = self.placement_pipeline.train_from_csv(placement_csv)
            r_metrics = self.retention_pipeline.train_from_csv(retention_csv)
            
            self.is_initialized = True
            return {
                "status": "ready",
                "placement_metrics": p_metrics,
                "retention_metrics": r_metrics,
            }
        except Exception as e:
            self.initialization_error = str(e)
            return {
                "status": "error",
                "error": str(e)
            }

    def get_telemetry(self) -> Dict[str, Any]:
        """Get model status, training statistics, and accuracy metrics for the dashboard."""
        return {
            "status": "operational" if self.is_initialized else "initializing",
            "placement_model": {
                "name": "Random Forest Placement Classifier & Gradient Boosting Regressor",
                "dataset": "Kaggle Campus Recruitment Benchmark (250 Records)",
                "metrics": self.placement_pipeline.metrics,
            },
            "retention_model": {
                "name": "Random Forest Academic Retention Early Warning Classifier",
                "dataset": "UCI Student Performance Higher-Ed Benchmark (250 Records)",
                "metrics": self.retention_pipeline.metrics,
            },
            "skill_matcher": {
                "name": "Curriculum-Aware Weighted Skill Gap Matcher",
                "taxonomy_roles_count": len(self.skill_matcher.taxonomy.get("roles", {})),
            }
        }
