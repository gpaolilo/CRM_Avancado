-- ==========================================================
-- RevenueOps Platform - Initial Supabase SQL Schema
-- ==========================================================

-- ENUMS
CREATE TYPE user_role AS ENUM ('SALES', 'DELIVERY', 'FINANCE', 'EXECUTIVE', 'ADMIN');
CREATE TYPE opportunity_stage AS ENUM ('PROSPECTING', 'QUALIFICATION', 'PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');
CREATE TYPE opportunity_status AS ENUM ('OPEN', 'WON', 'LOST');
CREATE TYPE activity_type AS ENUM ('CALL', 'MEETING', 'EMAIL', 'NOTE');
CREATE TYPE proposal_status AS ENUM ('DRAFT', 'SENT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE project_status AS ENUM ('PLANNING', 'EXECUTION', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
CREATE TYPE health_score AS ENUM ('HEALTHY', 'AT_RISK', 'CRITICAL');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE quarter_status AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE snapshot_module AS ENUM ('CRM', 'PROPOSALS', 'PROJECTS', 'FINANCE');

-- =====================
-- SHARED / USERS
-- =====================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role user_role DEFAULT 'SALES',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CRM MODULE
-- =====================
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  stage opportunity_stage DEFAULT 'PROSPECTING',
  value NUMERIC(12, 2) DEFAULT 0.00,
  probability INT DEFAULT 0,
  expected_close_date TIMESTAMPTZ,
  status opportunity_status DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type activity_type NOT NULL,
  notes TEXT,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PROPOSAL MODULE
-- =====================
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  status proposal_status DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.proposal_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  document_url TEXT,
  total_value NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PROJECT MANAGEMENT MODULE
-- =====================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE RESTRICT,
  client_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  status project_status DEFAULT 'PLANNING',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  sale_value NUMERIC(12, 2) DEFAULT 0.00,
  health_score health_score DEFAULT 'HEALTHY',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'TODO'
);

CREATE TABLE public.project_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN'
);

-- =====================
-- FINANCIAL MODULE
-- =====================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  issue_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  status invoice_status DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.revenue_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  expected_amount NUMERIC(12, 2) NOT NULL,
  target_month DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- QBR / REPORTING MODULE
-- =====================
CREATE TABLE public.quarters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL,
  quarter_number INT NOT NULL,
  status quarter_status DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  UNIQUE(year, quarter_number)
);

CREATE TABLE public.snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter_id UUID NOT NULL REFERENCES public.quarters(id) ON DELETE CASCADE,
  module snapshot_module NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.executive_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter_id UUID NOT NULL REFERENCES public.quarters(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
