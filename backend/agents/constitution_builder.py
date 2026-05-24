"""
CAEOS Agent: Constitution Builder (L4)
باني الدستور — الطبقة الرابعة

Drafts Architecture, Security, AI Governance, and Code Quality Laws.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from enum import Enum


class LawCategory(str, Enum):
    ARCHITECTURE = "ARCHITECTURE"
    SECURITY = "SECURITY"
    AI_GOVERNANCE = "AI_GOVERNANCE"
    CODE_QUALITY = "CODE_QUALITY"


class ConstitutionalLaw(BaseModel):
    """A single constitutional law binding on ALL agents."""
    
    number: int = Field(..., description="Law number (1-21)")
    category: LawCategory = Field(..., description="Law category")
    title: str = Field(..., description="Law title in English")
    title_ar: Optional[str] = Field(None, description="Law title in Arabic")
    description: str = Field(..., description="Full law description")
    description_ar: Optional[str] = Field(None, description="Arabic description")
    is_mutable: bool = Field(default=False, description="Can this law be changed? (Constitution: NO)")
    enforcement_level: str = Field(default="MANDATORY", description="MANDATORY or RECOMMENDED")
    
    class Config:
        json_schema_extra = {
            "example": {
                "number": 1,
                "category": "ARCHITECTURE",
                "title": "No Code Before Reasoning",
                "title_ar": "ممنوع كتابة كود قبل التفكير",
                "description": "No code may be written before: Intent Analysis, Decision Tree, Constitution, Human Ratification",
                "description_ar": "ممنوع كتابة أي سطر كود قبل تحليل النوايا وبناء شجرة القرار وصياغة الدستور والتصديق البشري",
                "is_mutable": False,
                "enforcement_level": "MANDATORY"
            }
        }


class ConstitutionBuilderAgent:
    """
    L4 — Constitution Core Agent
    
    Legislator: Drafts and enforces project-specific constitutional laws.
    All laws are IMMUTABLE (is_mutable=False).
    """
    
    LAYER = "L4"
    NAME = "constitution_builder"
    NAME_AR = "باني الدستور"
    ROLE = "Legislator"
    ROLE_AR = "مُشرّع"
    
    DEFAULT_LAWS = [
        ConstitutionalLaw(
            number=1,
            category=LawCategory.ARCHITECTURE,
            title="No Code Before Reasoning",
            title_ar="ممنوع كتابة كود قبل التفكير",
            description="No code may be written before: Intent Analysis (L1), Decision Tree (L2), Constitution (L4), Human Ratification (P5)",
            description_ar="ممنوع كتابة أي سطر كود قبل تحليل النوايا وبناء شجرة القرار وصياغة الدستور والتصديق البشري",
            is_mutable=False,
            enforcement_level="MANDATORY"
        ),
        ConstitutionalLaw(
            number=2,
            category=LawCategory.ARCHITECTURE,
            title="No Assumptions Without Confirmation",
            title_ar="ممنوع الافتراضات غير المؤكدة",
            description="No assumptions allowed. Anything unconfirmed → becomes a formal question.",
            description_ar="ممنوع افتراض أي شيء غير مؤكد. أي شيء غير مؤكد يتحول لسؤال رسمي",
            is_mutable=False,
            enforcement_level="MANDATORY"
        ),
        ConstitutionalLaw(
            number=10,
            category=LawCategory.AI_GOVERNANCE,
            title="Human Approval Overrides All AI Decisions",
            title_ar="السيادة البشرية فوق كل شيء",
            description="Human sovereignty is absolute. Any agent that overrides human decisions is isolated.",
            description_ar="السيادة البشرية فوق كل شيء. أي Agent يتجاوز قرار إنساني يُعزل",
            is_mutable=False,
            enforcement_level="MANDATORY"
        ),
        ConstitutionalLaw(
            number=11,
            category=LawCategory.AI_GOVERNANCE,
            title="Every Decision Must Enter the Knowledge Graph",
            title_ar="كل قرار في Knowledge Graph",
            description="Any decision not stored in the Knowledge Graph = decision that never happened",
            description_ar="أي قرار لا يُخزن في Knowledge Graph = قرار لم يحدث",
            is_mutable=False,
            enforcement_level="MANDATORY"
        ),
    ]
    
    def __init__(self, project_context: Optional[Dict] = None):
        self.project_context = project_context or {}
        self.laws: List[ConstitutionalLaw] = []
        self.trust_score = 0.92
        
    def draft_constitution(self) -> List[ConstitutionalLaw]:
        """
        Draft constitutional laws for the project.
        
        Returns:
            List[ConstitutionalLaw]: Immutable laws binding on all agents
        """
        # Start with default CAEOS laws
        self.laws = self.DEFAULT_LAWS.copy()
        
        # Add project-specific laws based on context
        if self.project_context.get("sensitivity") == "HIGH":
            self.laws.append(ConstitutionalLaw(
                number=22,  # Project-specific
                category=LawCategory.SECURITY,
                title="Mandatory Security Audit Before Every Commit",
                title_ar="تدقيق أمان إلزامي قبل كل Commit",
                description="Every code change must pass security audit before merging",
                description_ar="كل تغيير كود يجب أن يمر بتدقيق أمان قبل الدمج",
                is_mutable=False,
                enforcement_level="MANDATORY"
            ))
        
        return self.laws
    
    def enforce(self, action: str, details: Dict) -> Dict:
        """
        Check if an action violates any constitutional law.
        
        Args:
            action: The action being performed (e.g., "WRITE_CODE", "INTRODUCE_DEPENDENCY")
            details: Action details for context
            
        Returns:
            Dict with: allowed (bool), violated_laws (List), required_approval (str or None)
        """
        result = {
            "allowed": True,
            "violated_laws": [],
            "required_approval": None,
            "warnings": []
        }
        
        # Law 1: No Code Before Reasoning
        if action == "WRITE_CODE" and not details.get("has_ratification"):
            result["allowed"] = False
            result["violated_laws"].append(1)
            result["required_approval"] = "P5_HUMAN_RATIFICATION"
        
        # Law 5: No Dependencies Without Justification
        if action == "INTRODUCE_DEPENDENCY" and not details.get("justification"):
            result["allowed"] = False
            result["violated_laws"].append(5)
            result["required_approval"] = "DEPENDENCY_LIBRARIAN_APPROVAL"
        
        return result
    
    def get_law(self, number: int) -> Optional[ConstitutionalLaw]:
        """Retrieve a specific constitutional law by number."""
        for law in self.laws:
            if law.number == number:
                return law
        return None
