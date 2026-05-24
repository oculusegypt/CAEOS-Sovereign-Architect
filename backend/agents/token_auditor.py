"""
CAEOS Agent: Token Auditor (L12)
مدقق التوكنز — الطبقة الثانية عشر

Monitors token consumption, context optimization.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class TokenUsage(BaseModel):
    """Token usage for a single operation."""
    
    operation_id: str = Field(..., description="Operation identifier")
    agent_name: str = Field(..., description="Agent that consumed tokens")
    layer: str = Field(..., description="Sovereign layer")
    phase: str = Field(..., description="Pipeline phase")
    prompt_tokens: int = Field(..., description="Tokens in prompt")
    completion_tokens: int = Field(..., description="Tokens in completion")
    total_tokens: int = Field(..., description="Total tokens consumed")
    cost_usd: float = Field(..., description="Estimated cost in USD")
    timestamp: str = Field(..., description="ISO timestamp")


class TokenBudget(BaseModel):
    """Token budget for a phase or project."""
    
    budget_type: str = Field(..., description="PHASE, PROJECT, or AGENT")
    identifier: str = Field(..., description="What this budget is for")
    allocated: int = Field(..., description="Allocated token budget")
    consumed: int = Field(default=0, description="Tokens consumed so far")
    remaining: int = Field(..., description="Remaining tokens")
    percentage_used: float = Field(..., description="Percentage of budget used")
    status: str = Field(..., description="HEALTHY, WARNING, or EXHAUSTED")


class TokenAuditorAgent:
    """
    L12 — Economic Engine
    
    Economist: Monitors token consumption, context optimization.
    """
    
    LAYER = "L12"
    NAME = "token_auditor"
    NAME_AR = "مدقق التوكنز"
    ROLE = "Economist"
    ROLE_AR = "اقتصادي"
    
    COST_PER_1K_TOKENS = 0.01  # $0.01 per 1K tokens (placeholder)
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.trust_score = 0.88
        self.usage_history: List[TokenUsage] = []
        self.budgets: Dict[str, TokenBudget] = {}
        
    def record_usage(self, agent_name: str, layer: str, phase: str,
                     prompt_tokens: int, completion_tokens: int) -> TokenUsage:
        """
        Record token usage for an operation.
        
        Args:
            agent_name: Agent that performed the operation
            layer: Sovereign layer
            phase: Pipeline phase
            prompt_tokens: Input tokens
            completion_tokens: Output tokens
            
        Returns:
            TokenUsage: Recorded usage
        """
        total = prompt_tokens + completion_tokens
        cost = (total / 1000) * self.COST_PER_1K_TOKENS
        
        usage = TokenUsage(
            operation_id=f"op-{len(self.usage_history)}",
            agent_name=agent_name,
            layer=layer,
            phase=phase,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total,
            cost_usd=cost,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
        
        self.usage_history.append(usage)
        
        # Update phase budget
        budget_key = f"phase-{phase}"
        if budget_key in self.budgets:
            budget = self.budgets[budget_key]
            budget.consumed += total
            budget.remaining = budget.allocated - budget.consumed
            budget.percentage_used = (budget.consumed / budget.allocated) * 100
            
            if budget.percentage_used > 90:
                budget.status = "EXHAUSTED"
            elif budget.percentage_used > 70:
                budget.status = "WARNING"
            else:
                budget.status = "HEALTHY"
        
        return usage
    
    def set_budget(self, budget_type: str, identifier: str, allocated: int) -> TokenBudget:
        """
        Set a token budget.
        
        Args:
            budget_type: PHASE, PROJECT, or AGENT
            identifier: What the budget is for
            allocated: Token allocation
            
        Returns:
            TokenBudget: The created budget
        """
        budget = TokenBudget(
            budget_type=budget_type,
            identifier=identifier,
            allocated=allocated,
            consumed=0,
            remaining=allocated,
            percentage_used=0.0,
            status="HEALTHY"
        )
        
        self.budgets[f"{budget_type}-{identifier}"] = budget
        return budget
    
    def get_usage_report(self, phase: Optional[str] = None) -> Dict:
        """
        Generate token usage report.
        
        Args:
            phase: Optional phase filter
            
        Returns:
            Dict: Usage statistics
        """
        usage = self.usage_history
        if phase:
            usage = [u for u in usage if u.phase == phase]
        
        total_tokens = sum(u.total_tokens for u in usage)
        total_cost = sum(u.cost_usd for u in usage)
        
        by_agent = {}
        for u in usage:
            if u.agent_name not in by_agent:
                by_agent[u.agent_name] = {"tokens": 0, "cost": 0.0}
            by_agent[u.agent_name]["tokens"] += u.total_tokens
            by_agent[u.agent_name]["cost"] += u.cost_usd
        
        return {
            "total_operations": len(usage),
            "total_tokens": total_tokens,
            "total_cost_usd": round(total_cost, 4),
            "by_agent": by_agent,
            "budget_status": {k: v.dict() for k, v in self.budgets.items()}
        }
    
    def optimize_context(self, current_context: str, max_tokens: int) -> str:
        """
        Optimize context to fit within token budget.
        
        Args:
            current_context: Full context string
            max_tokens: Maximum allowed tokens
            
        Returns:
            str: Optimized context
        """
        # Placeholder — would use semantic compression
        # For now, simple truncation with ellipsis
        
        # Rough estimate: 1 token ≈ 4 characters
        max_chars = max_tokens * 4
        
        if len(current_context) > max_chars:
            return current_context[:max_chars - 50] + "\n...[Context truncated for token efficiency]..."
        
        return current_context
