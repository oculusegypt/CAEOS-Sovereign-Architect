-- CAEOS Sovereign Architect — PostgreSQL Schema
-- نظام CAEOS — مخطط قاعدة البيانات

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLE: projects
-- المشاريع
-- =====================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'VALIDATED', 'APPROVED', 'EXECUTING', 'VERIFIED', 'SEALED', 'ARCHIVED')),
    delivery_mode VARCHAR(50) CHECK (delivery_mode IN ('AGENT_ONLY', 'WEB_APP', 'HYBRID', 'DOCS_ONLY')),
    team_size VARCHAR(50),
    preferred_stack JSONB,
    language_mode VARCHAR(50) DEFAULT 'BILINGUAL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    ratified_at TIMESTAMPTZ,
    ratified_by VARCHAR(255),
    health_score INTEGER CHECK (health_score BETWEEN 0 AND 100)
);

-- =====================================================
-- TABLE: decisions
-- القرارات
-- =====================================================
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    phase VARCHAR(50) NOT NULL,
    layer VARCHAR(50) NOT NULL,
    question_id VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    question_text_ar TEXT,
    choice_made VARCHAR(10) NOT NULL,
    choice_label VARCHAR(255) NOT NULL,
    choice_label_ar VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    is_custom BOOLEAN DEFAULT FALSE,
    alternatives_rejected TEXT[] DEFAULT '{}',
    alternatives_rejected_ar TEXT[] DEFAULT '{}',
    reasoning_provided TEXT,
    reasoning_provided_ar TEXT,
    contradictions TEXT[] DEFAULT '{}',
    branches_unlocked TEXT[] DEFAULT '{}',
    engagement_mode VARCHAR(50) DEFAULT 'FULL_WIZARD',
    checkpoint_passed BOOLEAN DEFAULT FALSE,
    human_confirmed_summary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: wizard_states
-- حالات المعالج التفاعلي
-- =====================================================
CREATE TABLE wizard_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    phase VARCHAR(50) NOT NULL,
    current_question_id VARCHAR(100),
    mode VARCHAR(50) DEFAULT 'FULL_WIZARD' CHECK (mode IN ('FULL_WIZARD', 'GUIDED', 'BATCH', 'REVIEW', 'PAUSED')),
    answers JSONB DEFAULT '{}',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    session_started_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    is_paused BOOLEAN DEFAULT FALSE,
    resume_token VARCHAR(255)
);

-- =====================================================
-- TABLE: audit_logs
-- سجلات التدقيق
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    action_ar VARCHAR(100),
    actor VARCHAR(255) NOT NULL,
    actor_type VARCHAR(50) DEFAULT 'HUMAN' CHECK (actor_type IN ('HUMAN', 'AGENT', 'SYSTEM')),
    details JSONB DEFAULT '{}',
    details_ar JSONB DEFAULT '{}',
    constitution_law_cited VARCHAR(50),
    phase VARCHAR(50),
    layer VARCHAR(50),
    severity VARCHAR(20) DEFAULT 'INFO' CHECK (severity IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: knowledge_graph
-- الرسم البياني للمعرفة
-- =====================================================
CREATE TABLE knowledge_graph (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    node_type VARCHAR(50) NOT NULL CHECK (node_type IN ('DECISION', 'ENTITY', 'TECHNOLOGY', 'CONSTRAINT', 'RISK', 'ASSUMPTION')),
    node_key VARCHAR(255) NOT NULL,
    node_value JSONB NOT NULL,
    node_value_ar JSONB,
    relationships JSONB DEFAULT '[]',
    provenance TEXT,
    provenance_ar TEXT,
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0.00 AND 1.00),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: agents
-- الـAgents
-- =====================================================
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    name_ar VARCHAR(100),
    layer VARCHAR(50) NOT NULL,
    role VARCHAR(255) NOT NULL,
    role_ar VARCHAR(255),
    description TEXT,
    description_ar TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    trust_score DECIMAL(3,2) DEFAULT 0.80 CHECK (trust_score BETWEEN 0.00 AND 1.00),
    accuracy_rate DECIMAL(3,2) DEFAULT 0.85,
    hallucination_rate DECIMAL(3,2) DEFAULT 0.05,
    stability_score DECIMAL(3,2) DEFAULT 0.90,
    last_execution_at TIMESTAMPTZ,
    total_executions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: agent_executions
-- تنفيذات الـAgents
-- =====================================================
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    phase VARCHAR(50) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    output_data_ar JSONB,
    execution_time_ms INTEGER,
    token_cost INTEGER,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'ABORTED')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_decisions_project ON decisions(project_id);
CREATE INDEX idx_decisions_phase ON decisions(phase);
CREATE INDEX idx_wizard_states_project ON wizard_states(project_id);
CREATE INDEX idx_audit_logs_project ON audit_logs(project_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_knowledge_graph_project ON knowledge_graph(project_id);
CREATE INDEX idx_knowledge_graph_type ON knowledge_graph(node_type);
CREATE INDEX idx_agent_executions_agent ON agent_executions(agent_id);

-- =====================================================
-- TRIGGERS: Auto-update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_decisions_updated_at BEFORE UPDATE ON decisions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_graph_updated_at BEFORE UPDATE ON knowledge_graph
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: CAEOS Agents
-- =====================================================
INSERT INTO agents (name, name_ar, layer, role, role_ar, description, description_ar) VALUES
('intent_extractor', 'مستخرج النوايا', 'L1', 'Investigator', 'مُحَقّق', 'Extracts and formalizes raw human intent into structured requirements', 'يستخرج النية البشرية الخام ويحولها إلى متطلبات مُهيكلة'),
('deep_interrogator', 'المُستجوب العميق', 'L2', 'Inquisitor', 'مُستجوب', 'Builds decision trees with trade-off analysis', 'يبني أشجار قرار مع تحليل المقايضات'),
('architecture_advisor', 'مستشار المعمارية', 'L3', 'Strategist', 'استراتيجي', 'Recommends methodology, stack, and governance model', 'يُوصي بالمنهجية والمكدس ونموذج الحوكمة'),
('constitution_builder', 'باني الدستور', 'L4', 'Legislator', 'مُشرّع', 'Drafts Architecture, Security, AI Quality Laws', 'يصيّغ قوانين المعمارية والأمان وجودة AI'),
('conflict_arbitrator', 'الحكم النزاعات', 'L5', 'Judge', 'قاضٍ', 'Resolves agent disputes and prevents architectural forking', 'يحسم النزاعات بين Agents ويمنع التشعب المعماري'),
('security_auditor', 'مدقق الأمان', 'S1', 'Guardian', 'حارس', 'Audits vulnerabilities, auth flows, data exposure', 'يدقق الثغرات ومسارات المصادقة وتسريب البيانات'),
('performance_optimizer', 'محسّن الأداء', 'S2', 'Analyst', 'محلل', 'Detects bottlenecks, forecasts scalability', 'يكتشف الاختناقات ويتوقع قابلية التوسع'),
('dependency_guardian', 'حامي المكتبات', 'S3', 'Librarian', 'أمين مكتبة', 'Approves dependencies, prevents explosion', 'يوافق على المكتبات ويمنع الانفجار'),
('quality_guardian', 'حامي الجودة', 'S4', 'Inspector', 'مفتش', 'Ensures quality metrics, maintainability, regression detection', 'يضمن مقاييس الجودة وقابلية الصيانة واكتشاف التراجع'),
('risk_analyzer', 'محلل المخاطر', 'S5', 'Pessimist', 'متشائم', 'Surfaces hidden risks and tests buried assumptions', 'يُبرز المخاطر الخفية ويختبر الافتراضات المدفونة'),
('observability_monitor', 'مراقب الرصد', 'L10', 'Watchman', 'حارس', 'Logs, traces, health metrics, violation detection', 'سجلات، traces، مقاييس الصحة، اكتشاف التجاوزات'),
('token_auditor', 'مدقق التوكنز', 'L12', 'Economist', 'اقتصادي', 'Monitors token consumption, context optimization', 'يراقب استهلاك التوكنز ويحسّن السياق'),
('state_machine_controller', 'متحكم آلة الحالة', 'L8', 'Traffic Controller', 'مُنظّم مرور', 'Enforces ESM lifecycle on every task', 'يفرض دورة حياة ESM على كل مهمة'),
('recovery_engineer', 'مهندس الاسترداد', 'L9', 'Emergency Responder', 'مستجيب طوارئ', 'Snapshots, rollbacks, decision rewinds, corruption recovery', 'لقطات، تراجع، استرداد قرارات، استرداد تلف'),
('business_reality_guardian', 'حامي الواقع التجاري', 'S6', 'Pragmatist', 'عملي', 'Market timing, budget, team capacity, maintenance reality', 'توقيت السوق، الميزانية، طاقة الفريق، واقع الصيانة');

-- =====================================================
-- SEED DATA: First Project (CAEOS Meta-Build)
-- =====================================================
INSERT INTO projects (name, description, status, delivery_mode, team_size, preferred_stack, language_mode, ratified_by, health_score) VALUES
(
    'CAEOS v2.0 Meta-Build',
    'CAEOS governing its own construction — the ultimate real-world test of Constitutional AI Engineering',
    'EXECUTING',
    'HYBRID',
    'Solo Developer',
    '{"frontend": "Next.js 15 + TypeScript + Tailwind + next-intl", "backend": "Python 3.12 + FastAPI + Pydantic", "database": "PostgreSQL 16 + SQLAlchemy + Alembic", "ai": "LangChain + CrewAI + LangSmith", "deployment": "Vercel + Render + Supabase"}',
    'BILINGUAL',
    'salon Adel',
    95
);

-- Log the ratification
INSERT INTO audit_logs (project_id, action, action_ar, actor, actor_type, details, details_ar, phase, layer, severity) VALUES
(
    (SELECT id FROM projects WHERE name = 'CAEOS v2.0 Meta-Build'),
    'HUMAN_RATIFICATION',
    'تصديق بشري',
    'salon Adel',
    'HUMAN',
    '{"decisions_count": 5, "mode": "FULL_WIZARD", "engagement": "multiple_choice_with_recommendations"}',
    '{"عدد_القرارات": 5, "النمط": "معالج_كامل", "التفاعل": "متعدد_الخيارات_مع_توصيات"}',
    'P5',
    'L15',
    'INFO'
);
