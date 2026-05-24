"""
CAEOS Agent: Business Reality Guardian (S6)
حامي الواقع التجاري — المتخصص السادس

Market timing, budget, team capacity, maintenance reality.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class BusinessRealityCheck(BaseModel):
    """Business reality assessment."""
    
    market_timing: str = Field(..., description="Is now the right time?")
    budget_feasible: bool = Field(..., description="Can this be done within budget?")
    team_capacity: str = Field(..., description="Does the team have capacity?")
    maintenance_burden: str = Field(..., description="Expected maintenance load")
    growth_alignment: str = Field(..., description="Does this align with business growth?")
    recommendation: str = Field(..., description="GO, NO-GO, or CONDITIONAL")
    risks: List[str] = Field(default=[], description="Business risks identified")


class BusinessRealityGuardianAgent:
    """
    S6 — Business Pragmatist
    
    Pragmatist: Market timing, budget reality, team capacity, maintenance burden.
    """
    
    LAYER = "S6"
    NAME = "business_reality_guardian"
    NAME_AR = "حامي الواقع التجاري"
    ROLE = "Pragmatist"
    ROLE_AR = "عملي"
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.trust_score = 0.86
        
    def assess(self, project_requirements: Dict, budget: Optional[float] = None,
               team_size: Optional[int] = None) -> BusinessRealityCheck:
        """
        Assess business reality of a project.
        
        Args:
            project_requirements: Project scope and requirements
            budget: Available budget in USD (optional)
            team_size: Team headcount (optional)
            
        Returns:
            BusinessRealityCheck: Assessment with recommendation
        """
        risks = []
        
        # Market timing check
        market_timing = "GOOD"
        if project_requirements.get("is_experimental", False):
            market_timing = "MEDIUM — experimental projects have higher risk"
            risks.append("Experimental nature may not have immediate market demand")
        
        # Budget check
        budget_feasible = True
        estimated_cost = self._estimate_cost(project_requirements)
        if budget and estimated_cost > budget:
            budget_feasible = False
            risks.append(f"Estimated cost (${estimated_cost}) exceeds budget (${budget})")
        
        # Team capacity
        team_capacity = "ADEQUATE"
        required_team = self._estimate_team_size(project_requirements)
        if team_size and team_size < required_team:
            team_capacity = f"INSUFFICIENT — need {required_team}, have {team_size}"
            risks.append(f"Team undersized by {required_team - team_size} people")
        elif team_size and team_size > required_team * 2:
            team_capacity = "OVERSTAFFED — risk of coordination overhead"
            risks.append("Team may be too large for project scope")
        
        # Maintenance burden
        complexity = project_requirements.get("complexity", "MEDIUM")
        if complexity == "HIGH":
            maintenance_burden = "HEAVY — requires dedicated maintenance team"
            risks.append("High complexity = high maintenance burden")
        else:
            maintenance_burden = "MANAGEABLE — standard maintenance schedule"
        
        # Growth alignment
        growth_alignment = "ALIGNED"
        if project_requirements.get("strategic_priority") == "LOW":
            growth_alignment = "MISALIGNED — low strategic priority"
            risks.append("Project does not align with current strategic priorities")
        
        # Final recommendation
        if not budget_feasible or len(risks) > 3:
            recommendation = "NO-GO"
        elif len(risks) > 1:
            recommendation = "CONDITIONAL — mitigate risks first"
        else:
            recommendation = "GO"
        
        return BusinessRealityCheck(
            market_timing=market_timing,
            budget_feasible=budget_feasible,
            team_capacity=team_capacity,
            maintenance_burden=maintenance_burden,
            growth_alignment=growth_alignment,
            recommendation=recommendation,
            risks=risks
        )
    
    def _estimate_cost(self, requirements: Dict) -> float:
        """Estimate project cost based on requirements."""
        base_cost = 5000  # Base
        
        if requirements.get("complexity") == "HIGH":
            base_cost *= 3
        elif requirements.get("complexity") == "MEDIUM":
            base_cost *= 1.5
        
        if requirements.get("multi_tenant", False):
            base_cost *= 1.3
        
        return base_cost
    
    def _estimate_team_size(self, requirements: Dict) -> int:
        """Estimate required team size."""
        base_team = 2  # Minimum: 1 dev + 1 PM
        
        if requirements.get("complexity") == "HIGH":
            base_team += 2
        
        if requirements.get("needs_devops", False):
            base_team += 1
        
        return base_team
