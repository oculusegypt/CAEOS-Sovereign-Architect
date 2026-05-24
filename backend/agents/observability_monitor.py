"""
CAEOS Agent: Observability Monitor (L10)
مراقب الرصد — الطبقة العاشرة

Logs, traces, health metrics, violation detection.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from enum import Enum


class LogSeverity(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class AuditLog(BaseModel):
    """A single audit log entry."""
    
    log_id: str = Field(..., description="Unique log identifier")
    timestamp: str = Field(..., description="ISO timestamp")
    agent_name: str = Field(..., description="Agent that generated the log")
    layer: str = Field(..., description="Sovereign layer")
    phase: str = Field(..., description="Pipeline phase")
    action: str = Field(..., description="What happened")
    severity: LogSeverity = Field(..., description="Log severity")
    details: Dict = Field(default={}, description="Additional context")
    constitution_law_cited: Optional[int] = Field(None, description="Law cited if applicable")


class ObservabilityMonitorAgent:
    """
    L10 — Observability Layer
    
    Watchman: Logs, traces, health metrics, violation detection.
    """
    
    LAYER = "L10"
    NAME = "observability_monitor"
    NAME_AR = "مراقب الرصد"
    ROLE = "Watchman"
    ROLE_AR = "حارس"
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.trust_score = 0.89
        self.logs: List[AuditLog] = []
        self.violations: List[Dict] = []
        
    def log(self, agent_name: str, layer: str, phase: str, action: str, 
            severity: LogSeverity, details: Dict = None, law_cited: int = None) -> AuditLog:
        """
        Record an audit log entry.
        
        Args:
            agent_name: Agent that performed the action
            layer: Sovereign layer (e.g., L1, S1)
            phase: Pipeline phase (e.g., P2, P6)
            action: Description of what happened
            severity: Log severity
            details: Additional structured data
            law_cited: Constitutional law referenced
            
        Returns:
            AuditLog: The recorded log entry
        """
        log_entry = AuditLog(
            log_id=f"log-{len(self.logs)}",
            timestamp="2026-05-25T00:00:00Z",  # Placeholder
            agent_name=agent_name,
            layer=layer,
            phase=phase,
            action=action,
            severity=severity,
            details=details or {},
            constitution_law_cited=law_cited
        )
        
        self.logs.append(log_entry)
        
        # Auto-detect violations
        if severity in [LogSeverity.ERROR, LogSeverity.CRITICAL]:
            self.violations.append({
                "log_id": log_entry.log_id,
                "type": "AGENT_ERROR",
                "description": action,
                "severity": severity.value
            })
        
        return log_entry
    
    def detect_violations(self, check_window: int = 100) -> List[Dict]:
        """
        Scan recent logs for constitutional violations.
        
        Args:
            check_window: Number of recent logs to check
            
        Returns:
            List[Dict]: Detected violations
        """
        recent = self.logs[-check_window:]
        violations = []
        
        # Check for Law 1 violations (code before reasoning)
        code_actions = [l for l in recent if "WRITE_CODE" in l.action and l.phase in ["P1", "P2"]]
        if code_actions:
            violations.append({
                "type": "LAW_1_VIOLATION",
                "description": "Code written before ratification",
                "count": len(code_actions),
                "severity": "CRITICAL"
            })
        
        # Check for Law 10 violations (AI override)
        override_actions = [l for l in recent if "OVERRIDE" in l.action and "HUMAN" not in l.agent_name]
        if override_actions:
            violations.append({
                "type": "LAW_10_VIOLATION",
                "description": "AI agent attempted to override human decision",
                "count": len(override_actions),
                "severity": "CRITICAL"
            })
        
        return violations
    
    def get_health_metrics(self) -> Dict:
        """Get system health metrics."""
        total_logs = len(self.logs)
        errors = len([l for l in self.logs if l.severity in [LogSeverity.ERROR, LogSeverity.CRITICAL]])
        violations = len(self.violations)
        
        return {
            "total_logs": total_logs,
            "error_rate": errors / total_logs if total_logs > 0 else 0,
            "violation_count": violations,
            "health_score": max(0, 100 - (errors * 5) - (violations * 10)),
            "status": "HEALTHY" if violations == 0 else "DEGRADED" if violations < 5 else "CRITICAL"
        }
