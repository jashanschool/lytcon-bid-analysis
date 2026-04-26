# RFP Document Classification and Extraction

![RFP Document Classification and Extraction](../images/workflow-rfp-document-extraction.png)

## Purpose

Convert raw RFP documents into structured, reviewable requirements, questions, deadlines, pricing signals, and document summaries.

## What it proves

This workflow demonstrates document ingestion, PDF text extraction, document-type classification, routing by content type, section splitting, chunking, AI-assisted fact extraction, structured parsing, and persistence of extracted items.

## Main steps

1. Receive a document from the ingestion pipeline.
2. Download the document from object storage.
3. Extract PDF text and normalize the payload.
4. Classify the document type and content flags.
5. Route the document by type.
6. Split text into sections and chunks.
7. Extract requirements and other structured facts.
8. Parse the model output and store extracted items.

## Why this matters

This is the core transformation layer of the product: unstructured RFP documents become structured data that can be searched, reviewed, compared, and reused. The workflow is strongest when framed as a document-intelligence pipeline, not as a generic AI automation.

## Redactions

This public copy redacts private endpoints, tokens, credential names, customer-specific names, table names, and internal infrastructure details.

## Current status

This workflow copy is intended for documentation and portfolio review. It preserves the main system logic but may require environment-specific credentials and endpoints to run.
