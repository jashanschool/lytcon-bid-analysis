ist das gut? # Tender Document Finder Architecture

## Purpose

The scraper layer in Lytcon is a Tender Document Finder and document retrieval layer. Its role is to discover relevant public-sector IT tender opportunities, resolve procurement document targets, and hand usable document references into the downstream RFP analysis workflow.

This layer is not intended to fully automate bid submission. It prepares the document inputs needed for later classification, extraction, review, and bid-support outputs.

## Why this layer exists

Public procurement sources are inconsistent. Some sources expose structured metadata through feeds, XML, or APIs. Others publish a notice that links to a separate procurement portal. In many cases, the useful tender documents are not available as a single obvious PDF link on the first page.

Common retrieval problems include:

- notices with useful metadata but no direct document package link
- procurement portals with separate document pages
- indirect links that first open an overview page before downloads are visible
- multiple download candidates with different relevance
- document links that need validation before they can be trusted
- source-specific page structure, labels, and navigation behavior

The finder exists to make this messy input layer explicit and controlled before documents enter the RFP analysis pipeline.

## Responsibilities

The document retrieval layer is responsible for:

- searching or receiving tender source records
- resolving notice metadata such as title, buyer, deadline, source, and document references
- finding procurement document pages linked from public notices
- identifying likely downloadable documents or document packages
- validating candidate links before treating them as usable
- handling source-specific retrieval paths for supported portals
- uploading, storing, or passing validated document targets to the next system stage
- triggering or handing off to downstream n8n workflows for ingestion and analysis

The layer should return evidence about what it found and what it could not resolve. If no reliable document target is found, the preferred outcome is a clear manual-review status rather than a guessed download.

## Source-specific retrieval

Different public procurement sources require different retrieval paths.

### TED-style notices

TED-style sources and similar notice feeds often provide structured metadata. These sources are suitable for a metadata-first path:

- read notice fields from a structured source
- normalize title, buyer, deadline, procedure, CPV, and source URL
- inspect document references where available
- score candidate links and pass strong candidates forward

This path is usually less dependent on browser behavior, but document links may still point to external portals.

### Portal-specific sources

Portal-specific sources, such as DTVP-like procurement portals, often require source-aware handling. The retriever may need to:

- open the public notice page
- detect whether the current page is a notice, project page, login page, or document page
- find labels such as procurement documents, tender documents, attachments, files, or downloads
- follow legitimate public navigation paths to a documents section
- distinguish announcement PDFs from full document packages
- classify the result as completed, partial, blocked, or manual-review required

This does not imply bypassing authentication or access controls. If a portal requires credentials or a user action that is not available to the retriever, the layer should stop and return a blocked or manual-review status.

### Browser/session-based retrieval

Some sources require a browser runtime because links, buttons, redirects, or downloads are produced by page interaction rather than static HTML alone. In those cases, the retriever can use a browser session to inspect the page, collect document candidates, and capture legitimate download events.

Browser-based retrieval is used as a controlled source-specific mechanism, not as a way to evade access restrictions.

## Shared handoff format

The downstream workflow should receive a normalized representation of the tender and its document targets. A public-safe example is shown below.

```json
{
  "source": "public_notice_feed",
  "tender_title": "Managed Workplace Services for Municipal Administration",
  "buyer": "Stadt Nordheim",
  "company": "Muster MSP GmbH",
  "deadline": "2026-04-28",
  "source_url": "<PUBLIC_NOTICE_URL>",
  "document_targets": [
    {
      "label": "Full procurement documents",
      "url": "<DOCUMENT_URL>",
      "kind": "document_package",
      "content_type": "application/zip",
      "validation_status": "validated",
      "candidate_score": 92
    },
    {
      "label": "Announcement PDF",
      "url": "<DOCUMENT_URL>",
      "kind": "announcement_pdf",
      "content_type": "application/pdf",
      "validation_status": "validated",
      "candidate_score": 81
    }
  ],
  "storage_status": "ready_for_ingestion",
  "analysis_status": "pending_document_ingestion"
}
```

The exact internal payload can differ by workflow, but the boundary should stay stable: normalized tender metadata plus validated document targets and status fields.

## Validation and safety

The finder should not blindly trust arbitrary links. Candidate document targets should be validated before they are treated as usable inputs.

Validation should include:

- URL parsing and normalization
- supported protocol checks, typically HTTPS or HTTP where explicitly allowed
- rejection of private, loopback, link-local, or internal network targets
- hostname allow-listing or source policy checks where appropriate
- content type checks where possible
- file extension and binary signature checks where possible
- file size limits before storage or ingestion
- candidate scoring based on link text, surrounding row text, file type, and source context
- negative scoring for unrelated links such as login, help, privacy, contact, or generic navigation pages
- clear separation between public-safe examples and private production configuration

When validation fails, the layer should return a non-usable status and enough diagnostic context for a human reviewer to understand the failure without exposing secrets.

## Relationship to n8n workflows

n8n orchestrates the broader Lytcon pipeline. The document finder sits near the start of that pipeline:

1. Tender discovery
2. Document target validation
3. Document ingestion
4. RFP document classification and extraction
5. Requirement and question review
6. Reviewable summary, gap-analysis, and proposal-support outputs

The finder does not replace downstream document analysis. It supplies controlled inputs so the analysis workflows can operate on the right tender documents instead of unverified URLs or manually copied files.

## Current status

This document describes the intended architecture and observed boundaries of the scraper/document retrieval layer in the public repository. The codebase contains prototype retrieval services and workflow documentation that demonstrate candidate discovery, portal-specific resolution, browser-based retrieval, validation, and handoff behavior.

This should be treated as an active prototype and documentation representation, not a claim of complete portal coverage or production readiness.

## Public-safe note

Private endpoints, credentials, tokens, production webhook URLs, customer-specific configuration, internal infrastructure details, raw environment variables, and raw portal session details are intentionally excluded from this document.

The public repository should show the system boundary and engineering approach without exposing operational access details.
