-- ECOS Security Agreement Modernization
-- Migration 002: Workflow tables, audit log, form versions, PostgREST grants
-- Creates signatures, audit_log, form_versions; grants API access

BEGIN;

SET search_path TO ecos, public;

-- =============================================================
-- Signatures
-- =============================================================
CREATE TABLE IF NOT EXISTS ecos.signatures (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id uuid NOT NULL REFERENCES ecos.agreements(id) ON DELETE CASCADE,
    signer_id uuid NOT NULL REFERENCES ecos.employees(id),
    signer_role text NOT NULL CHECK (signer_role IN ('employee', 'manager', 'admin')),
    typed_name text NOT NULL,
    certified boolean NOT NULL DEFAULT false,
    ip_address inet,
    user_agent text,
    session_hash text,
    form_version_hash text,
    signed_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (agreement_id, signer_role)
);

CREATE INDEX IF NOT EXISTS idx_signatures_agreement_id ON ecos.signatures(agreement_id);
CREATE INDEX IF NOT EXISTS idx_signatures_signer_id ON ecos.signatures(signer_id);

-- =============================================================
-- Audit Log
-- =============================================================
CREATE TABLE IF NOT EXISTS ecos.audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id uuid REFERENCES ecos.agreements(id) ON DELETE SET NULL,
    actor_id uuid REFERENCES ecos.employees(id) ON DELETE SET NULL,
    action text NOT NULL,
    details jsonb,
    ip_address inet,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_agreement_id ON ecos.audit_log(agreement_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id ON ecos.audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON ecos.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON ecos.audit_log(created_at DESC);

-- =============================================================
-- Form Versions
-- =============================================================
CREATE TABLE IF NOT EXISTS ecos.form_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    version_hash text NOT NULL UNIQUE,
    version_label text NOT NULL,
    content_snapshot jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_versions_hash ON ecos.form_versions(version_hash);

-- =============================================================
-- PostgREST grants: expose ecos schema to anon and authenticated
-- =============================================================
GRANT USAGE ON SCHEMA ecos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA ecos TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ecos TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ecos GRANT SELECT, INSERT, UPDATE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ecos GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

COMMIT;
