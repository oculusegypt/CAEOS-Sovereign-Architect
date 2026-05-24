"""
CAEOS Agent: State Machine Controller (L8)
متحكم آلة الحالة — الطبقة الثامنة

Enforces ESM lifecycle on every task.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from enum import Enum


class TaskState(str, Enum):
    DRAFT = "DRAFT"
    REVIEW = "REVIEW"
    VALIDATED = "VALIDATED"
    APPROVED = "APPROVED"
    EXECUTING = "EXECUTING"
    VERIFIED = "VERIFIED"
    SEALED = "SEALED"
    ARCHIVED = "ARCHIVED"


class StateTransition(BaseModel):
    """A single state transition."""
    
    task_id: str = Field(..., description="Task identifier")
    from_state: TaskState = Field(..., description="Previous state")
    to_state: TaskState = Field(..., description="New state")
    triggered_by: str = Field(..., description="Agent or human who triggered")
    constitutional_check: bool = Field(..., description="Did constitution check pass?")
    timestamp: str = Field(..., description="ISO timestamp")


class StateMachineControllerAgent:
    """
    L8 — Governance Engine
    
    Traffic Controller: Enforces DRAFT→REVIEW→VALIDATED→APPROVED→EXECUTING→VERIFIED→SEALED→ARCHIVED.
    """
    
    LAYER = "L8"
    NAME = "state_machine_controller"
    NAME_AR = "متحكم آلة الحالة"
    ROLE = "Traffic Controller"
    ROLE_AR = "مُنظّم مرور"
    
    ALLOWED_TRANSITIONS = {
        TaskState.DRAFT: [TaskState.REVIEW],
        TaskState.REVIEW: [TaskState.VALIDATED, TaskState.DRAFT],
        TaskState.VALIDATED: [TaskState.APPROVED, TaskState.REVIEW],
        TaskState.APPROVED: [TaskState.EXECUTING, TaskState.REVIEW],
        TaskState.EXECUTING: [TaskState.VERIFIED, TaskState.REVIEW],
        TaskState.VERIFIED: [TaskState.SEALED, TaskState.EXECUTING],
        TaskState.SEALED: [TaskState.ARCHIVED],
        TaskState.ARCHIVED: []  # Terminal state
    }
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.trust_score = 0.94
        self.state_history: List[StateTransition] = []
        self.current_states: Dict[str, TaskState] = {}
        
    def get_current_state(self, task_id: str) -> TaskState:
        """Get current state of a task."""
        return self.current_states.get(task_id, TaskState.DRAFT)
    
    def transition(self, task_id: str, to_state: TaskState, triggered_by: str) -> Dict:
        """
        Attempt to transition a task to a new state.
        
        Args:
            task_id: Task identifier
            to_state: Desired new state
            triggered_by: Who is requesting the transition
            
        Returns:
            Dict: Success/failure with reason
        """
        current = self.get_current_state(task_id)
        
        # Check if transition is allowed
        allowed = self.ALLOWED_TRANSITIONS.get(current, [])
        if to_state not in allowed:
            return {
                "success": False,
                "error": f"Invalid transition: {current.value} → {to_state.value}",
                "allowed_from_current": [s.value for s in allowed],
                "constitutional_violation": True,
                "law_cited": 14  # Law 14: Every task must follow state machine
            }
        
        # Record transition
        transition = StateTransition(
            task_id=task_id,
            from_state=current,
            to_state=to_state,
            triggered_by=triggered_by,
            constitutional_check=True,
            timestamp="2026-05-25T00:00:00Z"  # Placeholder
        )
        
        self.state_history.append(transition)
        self.current_states[task_id] = to_state
        
        return {
            "success": True,
            "transition": transition.dict(),
            "message": f"Task {task_id} moved from {current.value} to {to_state.value}"
        }
    
    def can_execute(self, task_id: str) -> bool:
        """Check if a task is in EXECUTING or beyond (eligible for work)."""
        state = self.get_current_state(task_id)
        return state in [TaskState.EXECUTING, TaskState.VERIFIED, TaskState.SEALED, TaskState.ARCHIVED]
    
    def get_audit_trail(self, task_id: str) -> List[Dict]:
        """Get full state history for a task."""
        return [t.dict() for t in self.state_history if t.task_id == task_id]
