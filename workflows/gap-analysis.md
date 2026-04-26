# Retrieval-Assisted Gap Analysis

images/gap-analysis.png

## Purpose

Match open RFP questions against reviewed SOW content, draft cautious gap answers, and generate a reviewable gap-analysis output.

## What it proves

This workflow demonstrates retrieval-assisted matching, embedding-based retrieval, reviewed-vs-draft answer paths, LLM-assisted gap drafting, structured parsing, and generation of a human-review artifact.

## Main steps

1. Receive a gap-analysis request.
2. Fetch open RFP questions.
3. Retrieve related SOW content for each question.
4. Match high-confidence reviewed answers.
5. Draft answers for unmatched questions.
6. Store draft answers for review.
7. Collect gap-report data.
8. Create and send a review output.

## Why this matters

The gap-analysis workflow shows the decision-support layer: reviewed SOW content is preferred when available, while uncertain answers are drafted separately for human review. That distinction is important because it makes the system look operationally mature instead of blindly generative.

## Redactions

This public copy redacts private endpoints, tokens, credential names, customer-specific names, table names, and internal infrastructure details.

## Current status

This workflow copy is intended for documentation and portfolio review. It preserves the main system logic but may require environment-specific credentials and endpoints to run.
