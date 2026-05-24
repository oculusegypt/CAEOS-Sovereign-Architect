"""
CAEOS Agent: Intent Extractor (L1)
مستخرج النوايا — الطبقة الأولى

Extracts and formalizes raw human intent into structured requirements.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class IntentExtraction(BaseModel):
    """Structured output from L1 — Intent Kernel."""
    
    system_type: str = Field(..., description="Type of system (e.g., Marketplace, SaaS, Internal Tool)")
    stakeholders: List[str] = Field(..., description="Primary stakeholders (e.g., User, Admin, API Consumer)")
    critical_operations: List[str] = Field(..., description="Core operations (e.g., Booking, Payment, Authentication)")
    sensitivity_level: str = Field(..., description="Data sensitivity (LOW, MEDIUM, HIGH, CRITICAL)")
    scalability_needs: str = Field(..., description="Scale expectations (e.g., <100 users, 1K-10K, 100K+)")
    deployment_targets: List[str] = Field(..., description="Target platforms (Web, Mobile, API, CLI)")
    key_risks: List[str] = Field(default=[], description="Identified risks (e.g., Fraud, Data Breach)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "system_type": "AI Engineering Governance OS",
                "stakeholders": ["Human (Sovereign)", "AI Agents", "Auditor Agents"],
                "critical_operations": [
                    "Intent Extraction",
                    "Decision Intelligence",
                    "Constitution Building",
                    "Ratification",
                    "Controlled Execution",
                    "Continuous Audit"
                ],
                "sensitivity_level": "HIGH",
                "scalability_needs": "Multi-Agent System with constitutional coordination",
                "deployment_targets": ["Web", "API", "Agent Framework"],
                "key_risks": [
                    "Hallucination",
                    "Agent Conflict",
                    "Dependency Explosion",
                    "Token Debt",
                    "Architecture Drift"
                ]
            }
        }


class IntentExtractorAgent:
    """
    L1 — Intent Kernel Agent
    
    Transforms natural language into structured requirements.
    No assumptions. Everything unconfirmed → becomes a formal question.
    """
    
    LAYER = "L1"
    NAME = "intent_extractor"
    NAME_AR = "مستخرج النوايا"
    ROLE = "Investigator"
    ROLE_AR = "مُحَقّق"
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.trust_score = 0.85
        
    async def extract(self, raw_input: str) -> IntentExtraction:
        """
        Extract structured intent from natural language input.
        
        Args:
            raw_input: Free-form text describing the project/system
            
        Returns:
            IntentExtraction: Structured requirements with no assumptions
        """
        # Placeholder — full implementation would use LangChain/LLM
        # to parse and structure the input
        
        extraction = IntentExtraction(
            system_type="AI Engineering Governance OS",
            stakeholders=["Human (Sovereign)", "AI Agents", "Auditor Agents"],
            critical_operations=[
                "Intent Extraction",
                "Decision Intelligence", 
                "Constitution Building",
                "Ratification",
                "Controlled Execution",
                "Continuous Audit"
            ],
            sensitivity_level="HIGH",
            scalability_needs="Multi-Agent System with constitutional coordination",
            deployment_targets=["Web", "API", "Agent Framework"],
            key_risks=[
                "Hallucination",
                "Agent Conflict",
                "Dependency Explosion",
                "Token Debt",
                "Architecture Drift"
            ]
        )
        
        return extraction
    
    def validate(self, extraction: IntentExtraction) -> List[str]:
        """
        Validate extraction for completeness.
        Returns list of gaps that must be filled before proceeding.
        """
        gaps = []
        
        if not extraction.system_type or extraction.system_type == "Unknown":
            gaps.append("System type not identified — requires clarification")
            
        if len(extraction.stakeholders) < 2:
            gaps.append("At least 2 stakeholders required for governance")
            
        if not extraction.critical_operations:
            gaps.append("No critical operations identified — what does this system DO?")
            
        return gaps
