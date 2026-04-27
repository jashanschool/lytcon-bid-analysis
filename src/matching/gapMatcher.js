"use strict";

function tokenize(value) {
  return new Set(
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9äöüß\s/-]/gi, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2)
  );
}

function similarity(a, b) {
  const left = tokenize(a);
  const right = tokenize(b);
  if (!left.size || !right.size) return 0;

  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

function classifyMatch(score) {
  if (score >= 0.55) return "covered";
  if (score >= 0.25) return "related_but_not_confirmed";
  return "needs_review";
}

function matchRequirement(requirement, reviewedSources = []) {
  const ranked = reviewedSources
    .map((source) => ({
      ...source,
      similarity_score: Number(similarity(requirement.text, source.text).toFixed(3)),
    }))
    .sort((a, b) => b.similarity_score - a.similarity_score);

  const best = ranked[0] || null;
  const status = best ? classifyMatch(best.similarity_score) : "needs_review";

  return {
    requirement_id: requirement.id,
    requirement_text: requirement.text,
    status,
    best_match: best,
    review_required: status !== "covered",
  };
}

module.exports = {
  classifyMatch,
  matchRequirement,
  similarity,
};
