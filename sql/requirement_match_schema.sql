-- requirement_match_schema.sql
-- Public-safe example schema for storing extracted RFP requirement match rows.
-- This is a simplified documentation schema, not a production database dump.

create table if not exists organization_requirement_match_rows (
  id uuid primary key default gen_random_uuid(),

  -- What kind of extracted/matched item this row represents.
  row_type text not null check (
    row_type in (
      'capability',
      'limitation',
      'pricing',
      'contract_term',
      'ambiguity',
      'missing_information'
    )
  ),

  -- Whether the row is positive, negative, or neutral for bid evaluation.
  polarity text not null check (
    polarity in ('positive', 'negative', 'neutral')
  ),

  -- Review priority.
  importance text not null check (
    importance in ('high', 'medium', 'low')
  ),

  -- Where the row came from or which analysis scope produced it.
  source_scope text check (
    source_scope in (
      'rfp',
      'sow',
      'sla',
      'pricing',
      'merged',
      'gap_analysis'
    )
  ),

  -- Optional business/service context.
  service_name text,

  -- Human-readable comparison or extracted finding.
  comparison_text text not null,

  -- Original extracted value or evidence snippet.
  raw_value text,

  -- Cleaned or normalized value for filtering/comparison.
  normalized_value text,

  -- Optional unit, e.g. minutes, hours, percent, EUR.
  unit text,

  -- Review status keeps AI-assisted output from being treated as final truth.
  review_status text not null default 'needs_review' check (
    review_status in (
      'needs_review',
      'reviewed',
      'approved',
      'rejected'
    )
  ),

  -- Optional explanation for why the row needs review or how it was matched.
  notes text,

  -- Public-safe placeholder for organization/workspace relationship.
  organization_id uuid,

  created_at timestamptz not null default now()
);

-- Helpful indexes for review workflows.
create index if not exists idx_requirement_match_rows_importance
  on organization_requirement_match_rows (importance);

create index if not exists idx_requirement_match_rows_row_type
  on organization_requirement_match_rows (row_type);

create index if not exists idx_requirement_match_rows_review_status
  on organization_requirement_match_rows (review_status);

create index if not exists idx_requirement_match_rows_created_at
  on organization_requirement_match_rows (created_at);
