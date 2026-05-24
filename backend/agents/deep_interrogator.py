"""
CAEOS Agent: Deep Interrogator (L2)
المُستجوب العميق — الطبقة الثانية

Builds decision trees with trade-off analysis.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class DecisionNode(BaseModel):
    """A single node in the decision tree."""
    
    id: str = Field(..., description="Unique node identifier")
    question: str = Field(..., description="The question to ask")
    question_ar: Optional[str] = Field(None, description="Arabic version")
    category: str = Field(..., description="Business, Technical, Scale, or Team")
    options: List[Dict] = Field(..., description="Available options with consequences")
    required: bool = Field(default=True, description="Must answer before proceeding")
    branch_condition: Optional[str] = Field(None, description="Unlocks sub-branch if chosen")


class DecisionTree(BaseModel):
    """Complete decision tree for a project phase."""
    
    phase: str = Field(..., description="Phase identifier (e.g., P2)")
    layer: str = Field(..., description="Layer identifier (e.g., L2)")
    nodes: List[DecisionNode] = Field(..., description="Ordered decision nodes")
    estimated_time_minutes: int = Field(default=15, description="Estimated completion time")
    max_decisions_per_hour: int = Field(default=5, description="Cognitive load protection")


class DeepInterrogatorAgent:
    """
    L2 — Deep Interrogator Agent
    
    Inquisitor: Builds decision trees with trade-off analysis.
    Not just questions — structured engineering interrogation.
    """
    
    LAYER = "L2"
    NAME = "deep_interrogator"
    NAME_AR = "المُستجوب العميق"
    ROLE = "Inquisitor"
    ROLE_AR = "مُستجوب"
    
    def __init__(self, intent_extraction: Optional[Dict] = None):
        self.intent = intent_extraction or {}
        self.trust_score = 0.88
        
    def build_decision_tree(self, phase: str = "P2") -> DecisionTree:
        """
        Build a structured decision tree for the given phase.
        
        Args:
            phase: Phase identifier (P1-P8)
            
        Returns:
            DecisionTree: Ordered nodes with trade-off analysis
        """
        if phase == "P2":
            return self._build_p2_tree()
        elif phase == "P3":
            return self._build_p3_tree()
        else:
            return DecisionTree(
                phase=phase,
                layer="L2",
                nodes=[],
                estimated_time_minutes=10
            )
    
    def _build_p2_tree(self) -> DecisionTree:
        """Build Phase 2 (Deep Interrogation) decision tree."""
        nodes = [
            DecisionNode(
                id="L2-Q1",
                question="Delivery Mode — How should CAEOS be delivered?",
                question_ar="نمط التسليم — كيف يجب تسليم CAEOS؟",
                category="Business",
                options=[
                    {"value": "A", "label": "Agent only", "consequence": "Fastest activation, less UI"},
                    {"value": "B", "label": "Web App", "consequence": "Highest UI flexibility"},
                    {"value": "C", "label": "Hybrid", "consequence": "Balance AI + familiar UI", "recommended": True},
                    {"value": "D", "label": "Docs only", "consequence": "Fastest start, no execution"},
                ],
                required=True
            ),
            DecisionNode(
                id="L2-Q2",
                question="Pilot Project — What project should CAEOS govern first?",
                question_ar="المشروع الأول — أي مشروع يحكم CAEOS أولاً؟",
                category="Business",
                options=[
                    {"value": "A", "label": "Template", "consequence": "Flexible, no real test"},
                    {"value": "B", "label": "Meta-Build", "consequence": "Strongest test + GitHub repo", "recommended": True},
                    {"value": "C", "label": "Small test", "consequence": "Quick test before large"},
                    {"value": "D", "label": "Real project", "consequence": "Direct value + complexity"},
                ],
                required=True
            ),
            DecisionNode(
                id="L2-Q3",
                question="Team Size & Resources",
                question_ar="حجم الفريق والموارد",
                category="Team",
                options=[
                    {"value": "A", "label": "Solo", "consequence": "Fastest, lowest tokens", "recommended": True},
                    {"value": "B", "label": "Small (2-5)", "consequence": "Needs conventions"},
                    {"value": "C", "label": "Medium (6-15)", "consequence": "Needs CI/CD + linting"},
                    {"value": "D", "label": "Enterprise (15+)", "consequence": "Microservices + compliance"},
                ],
                required=True
            ),
            DecisionNode(
                id="L2-Q4",
                question="Tech Stack Preference",
                question_ar="المكدس التقني المفضل",
                category="Technical",
                options=[
                    {"value": "A", "label": "Next.js + Node.js + PostgreSQL", "consequence": "Full JS stack"},
                    {"value": "B", "label": "Next.js + Python + PostgreSQL", "consequence": "Python-native for AI", "recommended": True},
                    {"value": "C", "label": "React + NestJS + MongoDB", "consequence": "Flexible, harder scale"},
                    {"value": "D", "label": "API/CLI only", "consequence": "Fastest backend, no UI"},
                ],
                required=True
            ),
            DecisionNode(
                id="L2-Q5",
                question="Language & Localization",
                question_ar="اللغة والتدويل",
                category="Business",
                options=[
                    {"value": "A", "label": "Arabic only", "consequence": "RTL UI, harder international"},
                    {"value": "B", "label": "Bilingual", "consequence": "Arabic UX + global reach", "recommended": True},
                    {"value": "C", "label": "English only", "consequence": "Easier GitHub, loses Arabic identity"},
                    {"value": "D", "label": "Mixed separation", "consequence": "Clear separation user/dev"},
                ],
                required=True
            ),
        ]
        
        return DecisionTree(
            phase="P2",
            layer="L2",
            nodes=nodes,
            estimated_time_minutes=20,
            max_decisions_per_hour=5
        )
    
    def _build_p3_tree(self) -> DecisionTree:
        """Build Phase 3 (Technical Blueprint) decision tree."""
        # Placeholder — would expand based on P2 answers
        return DecisionTree(
            phase="P3",
            layer="L3",
            nodes=[],
            estimated_time_minutes=30,
            max_decisions_per_hour=5
        )
    
    def analyze_tradeoffs(self, answers: List[Dict]) -> Dict:
        """
        Analyze trade-offs from given answers.
        
        Args:
            answers: List of {question_id, choice, reasoning}
            
        Returns:
            Dict with: recommendations, warnings, contradictions
        """
        analysis = {
            "recommendations": [],
            "warnings": [],
            "contradictions": [],
            "next_phase_ready": True
        }
        
        # Example analysis logic
        delivery = next((a for a in answers if a.get("question_id") == "L2-Q1"), None)
        team_size = next((a for a in answers if a.get("question_id") == "L2-Q3"), None)
        
        if delivery and team_size:
            if delivery["choice"] == "B" and team_size["choice"] == "A":
                analysis["warnings"].append(
                    "Web App + Solo may be heavy. Consider Hybrid for faster delivery."
                )
        
        return analysis
