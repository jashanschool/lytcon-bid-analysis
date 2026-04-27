"use strict";

const { normalizeAndValidateUrl } = require("./urlSafety");
const { rankDocumentCandidates } = require("./candidateScoring");

function extractDocumentTargets(links = [], options = {}) {
  const candidates = [];

  for (const link of links) {
    const validation = normalizeAndValidateUrl(link.href, options);
    if (!validation.ok) {
      candidates.push({ ...link, usable: false, rejectionReason: validation.reason, score: 0 });
      continue;
    }

    candidates.push({
      ...link,
      href: validation.url,
      usable: true,
    });
  }

  return rankDocumentCandidates(candidates);
}

module.exports = {
  extractDocumentTargets,
};
