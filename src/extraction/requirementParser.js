"use strict";

const HIGH_IMPORTANCE = /\b(must|required|shall|deadline|response time|sla|security|24\/7)\b/i;
const REQUIREMENT_SIGNAL = /\b(must|required|shall|should|provider|bidder|angebot|bieter|muss|soll)\b/i;

function splitSentences(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function inferCategory(sentence) {
  if (/sla|support|incident|response/i.test(sentence)) return "SLA & Support";
  if (/report|reporting/i.test(sentence)) return "Reporting";
  if (/manager|service management/i.test(sentence)) return "Service Management";
  if (/security|privacy|data/i.test(sentence)) return "Security";
  return "General";
}

function parseRequirements(text) {
  return splitSentences(text)
    .filter((sentence) => REQUIREMENT_SIGNAL.test(sentence))
    .map((sentence, index) => ({
      id: `REQ-${String(index + 1).padStart(3, "0")}`,
      type: sentence.endsWith("?") ? "question" : "requirement",
      category: inferCategory(sentence),
      text: sentence,
      importance: HIGH_IMPORTANCE.test(sentence) ? "high" : "medium",
      review_required: true,
    }));
}

module.exports = {
  parseRequirements,
};
