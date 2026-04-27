"use strict";

const DOCUMENT_HINT = /procurement|documents|vergabeunterlagen|ausschreibungsunterlagen|dtvp|evergabe|subreport/i;

function stripHtml(value = "") {
  return String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function resolveDocumentLinks(html = "", baseTender = {}) {
  const urls = [];
  const anchorRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = anchorRegex.exec(String(html || ""))) !== null) {
    const href = match[1];
    const label = stripHtml(match[2]);
    const score = DOCUMENT_HINT.test(`${href} ${label}`) ? 100 : 10;
    urls.push({ url: href, label, score });
  }

  urls.sort((a, b) => b.score - a.score);

  return {
    ...baseTender,
    procurementPageUrl: urls[0]?.url || null,
    procurementMatches: urls.slice(0, 10),
  };
}

module.exports = {
  resolveDocumentLinks,
  stripHtml,
};
