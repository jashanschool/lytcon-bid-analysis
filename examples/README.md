# Examples

This folder contains simplified, public-safe example data for the Lytcon RFP analysis flow.

The examples are not production exports and do not contain customer data. They are intended to show the shape of the system:

1. raw RFP input
2. extracted review items
3. retrieval/embedding-assisted matching
4. human-review-oriented output

The examples should be read together with the workflow documentation in `../workflows/`.

The retrieval example is intentionally cautious: embedding similarity is used to find relevant source material, not to make final bid decisions automatically.
