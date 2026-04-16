# lytcon-bid-analysis
Ingests and structures unstructured RFP documents and matches them against internal capabilities to support faster bid decisions.

## Overview

Lytcon is a workflow-driven system for analyzing tender and bid documents. It is designed to reduce manual effort in processing unstructured requirements and help IT service providers evaluate opportunities more consistently.

## System Architecture

The system is structured as a workflow pipeline:

1. Input Layer  
   - RFP documents (PDF, text) or external tender APIs

2. Processing Layer (n8n workflows)  
   - document parsing and extraction  
   - normalization of requirements  
   - structuring into predefined schema  

3. Storage Layer (Supabase + R2)  
   - structured requirement data  
   - internal capability and pricing profiles  
   - document storage  

4. Matching Layer  
   - comparison between external requirements and internal profiles  
   - rule-based and embedding-supported matching  

5. Output Layer  
   - structured view of requirements  
   - evaluation of fit  
   - support for bid/no-bid decisions  
## What it does

- ingests tender / RFP inputs from documents or external sources
- extracts and structures relevant requirements
- stores normalized data for further analysis
- compares requirements against internal capability and pricing profiles
- supports faster and more consistent bid evaluation

## Stack

- n8n for workflow orchestration
- Supabase for database and backend services
- Cloudflare R2 for document storage
- Next.js for the frontend
- embeddings / vector-based retrieval for selected matching tasks

## My role

I built and iterated on the workflow architecture, data structures, and product logic behind the system. My work focused on turning messy input into structured outputs that support decision-making in bid workflows.

## Current status

This repository is intended to document the system architecture, workflow logic, and core product concept. It does not yet represent a complete production deployment.

## Repository structure

This section will be expanded as the repository is organized.
