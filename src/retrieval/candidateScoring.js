"use strict";

function scoreDocumentCandidate(candidate = {}) {
  const text = [candidate.text, candidate.title, candidate.href, candidate.context]
    .filter(Boolean)
    .join(" ");

  let score = 0;
  const reasons = [];

  // These weights started as n8n code-node rules. They are simple on purpose:
  // the system should explain why it picked a document link.
  if (/vergabeunterlagen|ausschreibungsunterlagen/i.test(text)) {
    score += 35;
    reasons.push("strong_document_label");
  }
  if (/documents?|downloads?|herunterladen/i.test(text)) {
    score += 20;
    reasons.push("download_wording");
  }
  if (/\.zip($|[?#])/i.test(text)) {
    score += 20;
    reasons.push("zip_file");
  }
  if (/\.pdf($|[?#])/i.test(text)) {
    score += 10;
    reasons.push("pdf_file");
  }

  if (/login|anmelden/i.test(text)) {
    score -= 40;
    reasons.push("login_or_auth_page");
  }
  if (/impressum|datenschutz|privacy|kontakt|hilfe|agb/i.test(text)) {
    score -= 30;
    reasons.push("boilerplate_page");
  }

  if (candidate.contentType === "application/zip") score += 20;
  if (candidate.contentType === "application/pdf") score += 10;
  if (!candidate.href) score -= 40;

  return {
    ...candidate,
    score: Math.max(0, Math.min(100, score)),
    reasons,
  };
}

function rankDocumentCandidates(candidates = []) {
  return candidates
    .map(scoreDocumentCandidate)
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  rankDocumentCandidates,
  scoreDocumentCandidate,
};
