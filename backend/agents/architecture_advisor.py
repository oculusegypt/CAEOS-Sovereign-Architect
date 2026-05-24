"""
CAEOS Agent: Architecture Advisor (L3)
مستشار المعمارية — الطبقة الثالثة

Recommends methodology, stack, and governance model.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from enum import Enum


class ArchitectureStyle(str, Enum):
    MONOLITH = "MONOLITH"
    MICROSERVICES = "MICROSERVICES"
    MODULAR_MONOLITH = "MODULAR_MONOLITH"
    SERVERLESS = "SERVERLESS"
    EVENT_DRIVEN = "EVENT_DRIVEN"


class DatabaseChoice(str, Enum):
    POSTGRESQL = "PostgreSQL"
    MONGODB = "MongoDB"
    MYSQL = "MySQL"
    REDIS_SQL = "Redis + SQL Hybrid"


class DeploymentTarget(str, Enum):
    VERCEL = "Vercel/Netlify"
    KUBERNETES = "Kubernetes"
    VPS = "Traditional VPS"
    PAAS = "PaaS (Heroku/Render)"
    ON_PREMISE = "On-premise"


class TechRecommendation(BaseModel):
    """A single technology recommendation with full reasoning."""
    
    category: str = Field(..., description="e.g., Frontend, Backend, Database, AI")
    recommendation: str = Field(..., description="Recommended technology")
    alternatives: List[str] = Field(..., description="Other valid options")
    reasoning: str = Field(..., description="WHY this choice")
    risks: List[str] = Field(default=[], description="What could go wrong")
    scalability_impact: str = Field(..., description="How this scales")
    maintenance_impact: str = Field(..., description="How this affects maintenance")
    cost_estimate: Optional[str] = Field(None, description="Rough cost estimate")
    
    class Config:
        json_schema_extra = {
            "example": {
                "category": "Backend",
                "recommendation": "Python + FastAPI",
                "alternatives": ["Node.js + Express", "Go + Gin", "Java + Spring"],
                "reasoning": "Python-native for AI/ML integration, async support via FastAPI, auto-generated OpenAPI docs",
                "risks": ["Smaller ecosystem than Node.js", "Python GIL limitations for CPU-bound tasks"],
                "scalability_impact": "Excellent horizontal scaling with async workers. Can handle 10K+ concurrent connections.",
                "maintenance_impact": "Low — Pydantic validation catches bugs early. Type hints improve IDE support.",
                "cost_estimate": "Low — open source, runs on commodity hardware"
            }
        }


class ArchitectureBlueprint(BaseModel):
    """Complete architecture blueprint for a project."""
    
    project_id: str = Field(..., description="Project identifier")
    style: ArchitectureStyle = Field(..., description="Overall architecture style")
    frontend: TechRecommendation = Field(..., description="Frontend stack")
    backend: TechRecommendation = Field(..., description="Backend stack")
    database: TechRecommendation = Field(..., description="Database choice")
    deployment: TechRecommendation = Field(..., description="Deployment strategy")
    ai_integration: Optional[TechRecommendation] = Field(None, description="AI/ML stack if applicable")
    security_measures: List[str] = Field(..., description="Required security controls")
    estimated_cost_monthly: Optional[str] = Field(None, description="Estimated monthly cost")
    

class ArchitectureAdvisorAgent:
    """
    L3 — Decision Engine Agent
    
    Strategist: Recommends methodology, stack, and governance model.
    Every recommendation includes: reasoning, alternatives, risks, scalability, maintenance, cost.
    """
    
    LAYER = "L3"
    NAME = "architecture_advisor"
    NAME_AR = "مستشار المعمارية"
    ROLE = "Strategist"
    ROLE_AR = "استراتيجي"
    
    def __init__(self, decisions: Optional[Dict] = None):
        self.decisions = decisions or {}
        self.trust_score = 0.90
        
    def generate_blueprint(self, project_requirements: Dict) -> ArchitectureBlueprint:
        """
        Generate a complete architecture blueprint.
        
        Args:
            project_requirements: Requirements from L1/L2 phases
            
        Returns:
            ArchitectureBlueprint: Full stack recommendation with reasoning
        """
        # Determine architecture style based on team size
        team_size = self.decisions.get("team_size", "A")
        
        if team_size == "A":  # Solo
            style = ArchitectureStyle.MODULAR_MONOLITH
        elif team_size == "D":  # Enterprise
            style = ArchitectureStyle.MICROSERVICES
        else:
            style = ArchitectureStyle.MODULAR_MONOLITH
        
        # Build recommendations
        blueprint = ArchitectureBlueprint(
            project_id=project_requirements.get("project_id", "unknown"),
            style=style,
            frontend=TechRecommendation(
                category="Frontend",
                recommendation="Next.js 15 (App Router) + TypeScript + Tailwind CSS",
                alternatives=["React + Vite", "Vue + Nuxt", "Svelte + SvelteKit"],
                reasoning="Next.js 15 provides SSR, ISR, and RSC out of the box. App Router simplifies API integration. Tailwind enables rapid UI development.",
                risks=["Learning curve for App Router", "Vercel lock-in for some features"],
                scalability_impact="Excellent — edge deployment, automatic optimization",
                maintenance_impact="Medium — frequent Next.js updates require migration",
                cost_estimate="Free (Vercel hobby) to $20/mo (pro)"
            ),
            backend=TechRecommendation(
                category="Backend",
                recommendation="Python 3.12 + FastAPI + Pydantic v2",
                alternatives=["Node.js + NestJS", "Go + Gin", "Java + Spring Boot"],
                reasoning="Python-native for AI/ML (LangChain, CrewAI). FastAPI provides async auto-docs. Pydantic v2 validation is production-ready.",
                risks=["Smaller ecosystem than Node.js", "GIL limits CPU-bound concurrency"],
                scalability_impact="Excellent — async, can handle 10K+ concurrent connections",
                maintenance_impact="Low — Pydantic catches bugs, type hints improve DX",
                cost_estimate="Free (Render) to $25/mo (basic)"
            ),
            database=TechRecommendation(
                category="Database",
                recommendation="PostgreSQL 16 + SQLAlchemy 2.0 + Alembic",
                alternatives=["MongoDB + Mongoose", "MySQL + Sequelize", "SQLite (dev only)"],
                reasoning="PostgreSQL is battle-tested, supports JSONB for flexibility, ACID compliant. SQLAlchemy 2.0 is modern async ORM. Alembic handles migrations.",
                risks=["Operational complexity vs. managed services", "Schema migrations require care"],
                scalability_impact="Excellent — supports read replicas, partitioning, connection pooling",
                maintenance_impact="Low — well-documented, large community, managed options (Supabase, RDS)",
                cost_estimate="Free (Supabase) to $15/mo (basic)"
            ),
            deployment=TechRecommendation(
                category="Deployment",
                recommendation="Vercel (Frontend) + Render/Fly.io (Backend) + Supabase (DB)",
                alternatives=["AWS (ECS + RDS)", "DigitalOcean (App Platform)", "Google Cloud Run"],
                reasoning="Vercel = zero-config Next.js hosting. Render = simple Docker deployment. Supabase = managed PostgreSQL with Auth/Storage. All have generous free tiers.",
                risks=["Vendor lock-in concerns", "Limited customization on free tiers"],
                scalability_impact="Good for MVP → Production. Easy to migrate to AWS/GCP later.",
                maintenance_impact="Very low — managed services handle infrastructure",
                cost_estimate="$0-50/mo for MVP, $100-500/mo for growth"
            ),
            ai_integration=TechRecommendation(
                category="AI Integration",
                recommendation="LangChain + CrewAI + LangSmith",
                alternatives=["OpenAI SDK directly", "HuggingFace Transformers", "LlamaIndex"],
                reasoning="LangChain = agent orchestration. CrewAI = multi-agent coordination. LangSmith = observability. All Python-native = perfect fit.",
                risks=["Rapid API changes in LangChain", "Token costs can escalate quickly"],
                scalability_impact="Scales with API rate limits. Can add caching (Redis) to reduce costs.",
                maintenance_impact="Medium — monitor LangChain versions, track token usage",
                cost_estimate="API usage: $0.01-0.10 per 1K tokens. Monitor closely."
            ),
            security_measures=[
                "Mandatory Input Validation (Pydantic)",
                "Rate Limiting (SlowAPI or middleware)",
                "JWT Authentication (python-jose)",
                "CORS configured per environment",
                "Audit logging for all decisions",
                "Secrets isolation via environment variables"
            ],
            estimated_cost_monthly="$0-100 for MVP, $100-1000 for production"
        )
        
        return blueprint
    
    def compare_alternatives(self, category: str) -> List[Dict]:
        """
        Generate a comparison table for a technology category.
        
        Args:
            category: e.g., "database", "frontend", "backend"
            
        Returns:
            List[Dict]: Comparison with pros/cons/score
        """
        comparisons = {
            "database": [
                {"name": "PostgreSQL", "pros": ["ACID", "JSONB", "Mature"], "cons": ["Complex ops"], "score": 95},
                {"name": "MongoDB", "pros": ["Flexible schema", "Fast start"], "cons": ["Data consistency", "Query complexity"], "score": 80},
                {"name": "Supabase", "pros": ["Managed", "Realtime"], "cons": ["Vendor lock-in"], "score": 85},
            ],
            "backend": [
                {"name": "Python + FastAPI", "pros": ["AI-native", "Async", "Auto-docs"], "cons": ["Smaller ecosystem"], "score": 92},
                {"name": "Node.js + Express", "pros": ["Large ecosystem", "Full-stack JS"], "cons": ["Callback hell without async/await"], "score": 85},
                {"name": "Go + Gin", "pros": ["Performance", "Compiled"], "cons": ["Verbose", "Less libraries"], "score": 88},
            ]
        }
        
        return comparisons.get(category, [])
