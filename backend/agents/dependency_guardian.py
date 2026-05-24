"""
CAEOS Agent: Dependency Guardian (S3)
حامي المكتبات — المتخصص الثالث

Approves dependencies, prevents explosion.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class DependencyApproval(BaseModel):
    """Dependency approval result."""
    
    package_name: str = Field(..., description="Package name")
    version: str = Field(..., description="Requested version")
    approved: bool = Field(..., description="Is this approved?")
    risk_level: RiskLevel = Field(..., description="Risk assessment")
    reason: str = Field(..., description="Approval/denial reason")
    alternatives: List[str] = Field(default=[], description="Suggested alternatives")
    last_updated_days: Optional[int] = Field(None, description="Days since last update")
    stars: Optional[int] = Field(None, description="GitHub stars (proxy for popularity)")


class DependencyGuardianAgent:
    """
    S3 — Dependency Librarian
    
    Librarian: Approves dependencies, prevents explosion.
    """
    
    LAYER = "S3"
    NAME = "dependency_guardian"
    NAME_AR = "حامي المكتبات"
    ROLE = "Librarian"
    ROLE_AR = "أمين مكتبة"
    
    # Known problematic packages
    BLOCKED_PACKAGES = ["eval", "pickle", "pyyaml"]
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.trust_score = 0.91
        self.approved_dependencies: List[str] = []
        
    def evaluate(self, package_name: str, version: str, justification: str) -> DependencyApproval:
        """
        Evaluate a dependency for approval.
        
        Args:
            package_name: Package name
            version: Version string
            justification: Why is this needed?
            
        Returns:
            DependencyApproval: Approval result with risk assessment
        """
        # Check blocked packages
        if package_name.lower() in self.BLOCKED_PACKAGES:
            return DependencyApproval(
                package_name=package_name,
                version=version,
                approved=False,
                risk_level=RiskLevel.CRITICAL,
                reason=f"Package '{package_name}' is blocked for security reasons",
                alternatives=["safe-json", "dill (controlled environment)"]
            )
        
        # Check justification
        if not justification or len(justification) < 20:
            return DependencyApproval(
                package_name=package_name,
                version=version,
                approved=False,
                risk_level=RiskLevel.HIGH,
                reason="Insufficient justification. Law 5 requires detailed reasoning.",
                alternatives=[]
            )
        
        # Simulate risk assessment
        risk = RiskLevel.LOW
        reason = f"Approved: {justification}"
        
        if "beta" in version.lower() or "alpha" in version.lower():
            risk = RiskLevel.MEDIUM
            reason += " (Pre-release version — monitor for stability)"
        
        return DependencyApproval(
            package_name=package_name,
            version=version,
            approved=True,
            risk_level=risk,
            reason=reason,
            alternatives=[],
            stars=1000  # Placeholder
        )
    
    def check_dependency_explosion(self, dependencies: List[str]) -> Dict:
        """
        Check for dependency explosion (too many dependencies).
        
        Args:
            dependencies: List of dependency strings
            
        Returns:
            Dict: Analysis with warnings
        """
        count = len(dependencies)
        
        status = "healthy"
        warning = None
        
        if count > 50:
            status = "critical"
            warning = f"Dependency explosion detected: {count} dependencies. CAEOS recommends <30 for maintainability."
        elif count > 30:
            status = "warning"
            warning = f"High dependency count: {count}. Consider consolidation."
        
        return {
            "dependency_count": count,
            "status": status,
            "warning": warning,
            "recommendation": "Audit dependencies monthly. Remove unused packages."
        }
