-- example_queries.sql
-- Public-safe example queries for reviewing extracted RFP requirement match rows.

-- 1. Find high-priority risks or unclear items that need attention.
select
  row_type,
  polarity,
  importance,
  service_name,
  comparison_text,
  raw_value,
  normalized_value,
  notes,
  review_status
from organization_requirement_match_rows
where importance = 'high'
  and row_type in ('limitation', 'ambiguity', 'missing_information')
order by created_at desc;


-- 2. Show covered capabilities that can support a bid response.
select
  service_name,
  comparison_text,
  normalized_value,
  source_scope,
  review_status
from organization_requirement_match_rows
where row_type = 'capability'
  and polarity = 'positive'
order by service_name;


-- 3. Find all items that still require human review.
select
  row_type,
  importance,
  service_name,
  comparison_text,
  notes
from organization_requirement_match_rows
where review_status = 'needs_review'
order by
  case importance
    when 'high' then 1
    when 'medium' then 2
    when 'low' then 3
    else 4
  end,
  created_at desc;


-- 4. Find commercial or contract-related findings.
select
  row_type,
  polarity,
  importance,
  comparison_text,
  raw_value,
  normalized_value,
  unit,
  review_status
from organization_requirement_match_rows
where row_type in ('pricing', 'contract_term')
order by created_at desc;


-- 5. Summarize review workload by row type and status.
select
  row_type,
  review_status,
  count(*) as item_count
from organization_requirement_match_rows
group by row_type, review_status
order by row_type, review_status;


-- 6. Find negative or risky findings by service area.
select
  service_name,
  row_type,
  importance,
  comparison_text,
  notes
from organization_requirement_match_rows
where polarity = 'negative'
order by service_name, importance, created_at desc;
