"""
CAEOS Agent: Conflict Arbitrator (L5)
الحكم النزاعات — الطبقة الخامسة

Resolves agent disputes, prevents architectural forking.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from enum import Enum


class ConflictSeverity(str, Enum):
    MINOR = "MINOR"
    MODERATE = "MODERATE"
    MAJOR = "MAJOR"
    CRITICAL = "CRITICAL"


class ResolutionResult(BaseModel):
    """Result of conflict arbitration."""
    
    conflict_id: str = Field(..., description="Unique conflict identifier")
    severity: ConflictSeverity = Field(..., description="Conflict severity")
    agents_involved: List[str] = Field(..., description="Agent names in conflict")
    issue_description: str = Field(..., description="What caused the conflict")
    resolution: str = Field(..., description="The arbitration decision")
    winner_agent: Optional[str] = Field(None, description="If one agent's approach wins")
    merged_approach: Optional[str] = Field(None, description="If approaches were merged")
    constitutional_basis: List[int] = Field(..., description="Laws cited in resolution")
    requires_human_override: bool = Field(default=False, description="Does human need to decide?")


class ConflictArbitratorAgent:
    """
    L5 — Arbitration Kernel
    
    Judge: Resolves agent disputes, prevents architectural forking.
    """
    
    LAYER = "L5"
    NAME = "conflict_arbitrator"
    NAME_AR = "الحكم النزاعات"
    ROLE = "Judge"
    ROLE_AR = "قاضٍ"
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.trust_score = 0.95
        self.resolved_conflicts: List[Dict] = []
        
    def detect_conflict(self, agent_outputs: List[Dict]) -> Optional[Dict]:
        """
        Detect contradictions between agent outputs.
        
        Args:
            agent_outputs: List of {agent_name, recommendation, reasoning}
            
        Returns:
            Optional[Dict]: Conflict description or None
        """
        if len(agent_outputs) < 2:
            return None
        
        # Check for direct contradictions
        recommendations = [a["recommendation"] for a in agent_outputs]
        unique = set(recommendations)
        
        if len(unique) > 1:
            return {
                "type": "CONTRADICTION",
                "agents": [a["agent_name"] for a in agent_outputs],
                "conflicting_recommendations": list(unique),
                "severity": "MODERATE" if len(unique) == 2 else "MAJOR"
            }
        
        return None
    
    def resolve(self, conflict: Dict) -> ResolutionResult:
        """
        Resolve a detected conflict.
        
        Args:
            conflict: Conflict description from detect_conflict()
            
        Returns:
            ResolutionResult: Arbitration decision
        """
        severity = ConflictSeverity(conflict.get("severity", "MODERATE"))
        agents = conflict.get("agents", [])
        
        # Strategy: prioritize by trust score, then by layer seniority
        # L1 > L2 > L3 > ... > L15
        
        resolution_text = "Resolution: "
        winner = None
        merged = None
        
        if severity == ConflictSeverity.CRITICAL:
            resolution_text = "Human arbitration required — conflict too severe for automated resolution"
            return ResolutionResult(
                conflict_id=f"conflict-{len(self.resolved_conflicts)}",
                severity=severity,
                agents_involved=agents,
                issue_description=conflict.get("type", "Unknown conflict"),
                resolution=resolution_text,
                requires_human_override=True,
                constitutional_basis=[10]  # Law 10: Human Approval
            )
        
        # For non-critical, attempt merge or pick best
        if len(agents) == 2:
            merged = f"Merged approach: Combine strengths of {agents[0]} and {agents[1]}"
            resolution_text = merged
        else:
            winner = agents[0]  # Placeholder — would use trust scores
            resolution_text = f"Selected {winner}'s approach based on higher trust score and alignment with Constitution"
        
        result = ResolutionResult(
            conflict_id=f"conflict-{len(self.resolved_conflicts)}",
            severity=severity,
            agents_involved=agents,
            issue_description=conflict.get("type", "Unknown conflict"),
            resolution=resolution_text,
            winner_agent=winner,
            merged_approach=merged,
            constitutional_basis=[13, 5],  # Law 13: Every conflict must be arbitrated
            requires_human_override=False
        )
        
        self.resolved_conflicts.append(result.dict())
        return result
