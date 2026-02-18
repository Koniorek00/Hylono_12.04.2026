import { LucideIcon, Brain, TrendingUp, ShieldCheck, DollarSign, Wrench, Siren, FileText, Activity, Code, Server, Users, Search, Lock, Headphones, BookOpen, UserCheck } from 'lucide-react';

export type AgentRole = 'Control' | 'Growth' | 'Finance' | 'Product' | 'Ops';

export interface Agent {
    id: string;
    name: string;
    role: AgentRole;
    mission: string;
    icon?: LucideIcon;
    status: 'active' | 'idle' | 'thinking';
}

export const AGENTS: Agent[] = [
    // 01 Control / Strategy
    { id: 'strategy-executive-orchestrator', name: 'Executive Orchestrator', role: 'Control', mission: 'Strategy & Decisions', icon: Brain, status: 'active' },
    { id: 'ops-daily-pm', name: 'Daily Program Manager', role: 'Control', mission: 'Daily Operations Loop', icon: Activity, status: 'active' },
    { id: 'strategy-org-steward', name: 'Org Evolution Steward', role: 'Control', mission: 'Agent Lifecycle', icon: Wrench, status: 'idle' },
    { id: 'qa-authority', name: 'QA Authority', role: 'Control', mission: 'Verification & DoD', icon: ShieldCheck, status: 'idle' },
    { id: 'compliance-gate', name: 'Compliance Gate', role: 'Control', mission: 'Risk & Claims', icon: ShieldCheck, status: 'active' },
    { id: 'security-risk-steward', name: 'Security Risk Steward', role: 'Control', mission: 'Data Protection & Access', icon: Lock, status: 'idle' },
    { id: 'research-knowledge-curator', name: 'Research Knowledge Curator', role: 'Control', mission: 'Research & SSOT Librarian', icon: BookOpen, status: 'idle' },

    // 02 Growth
    { id: 'growth-head', name: 'Head of Growth', role: 'Growth', mission: 'Performance & Revenue', icon: TrendingUp, status: 'idle' },
    { id: 'growth-analytics-lead', name: 'Analytics & Experimentation', role: 'Growth', mission: 'A/B, Funnels, Data Lifts', icon: TrendingUp, status: 'idle' },
    { id: 'growth-marketing-lead', name: 'Product Marketing (PMM)', role: 'Growth', mission: 'Copy & Positioning', icon: FileText, status: 'idle' },
    { id: 'growth-seo-eoc', name: 'SEO & Content EIC', role: 'Growth', mission: 'Organic Supply Chain', icon: Search, status: 'idle' },
    { id: 'growth-cx-lead', name: 'Customer Support / CX', role: 'Growth', mission: 'Objection Handling & Feedback', icon: Headphones, status: 'idle' },

    // Finance (Mapped to Strategy)
    { id: 'finance-cfo', name: 'CFO Agent', role: 'Finance', mission: 'Unit Economics', icon: DollarSign, status: 'idle' },

    // 03 Product
    { id: 'product-owner-cpo', name: 'Product Owner (CPO)', role: 'Product', mission: 'Roadmap & Specs', icon: Users, status: 'active' },
    { id: 'eng-architecture-lead', name: 'Eng Architecture Lead', role: 'Product', mission: 'Stack & Standards', icon: Code, status: 'idle' },

    // 04 Ops
    { id: 'ops-incident-commander', name: 'Incident Commander', role: 'Ops', mission: 'Recovery & Uptime', icon: Siren, status: 'idle' },
    { id: 'ops-devops-lead', name: 'Ops DevOps Lead', role: 'Ops', mission: 'CI/CD & Release Trains', icon: Server, status: 'idle' },
];
