"use strict";

const ALLOWED_ROLES = [
  "SOW",
  "QUESTIONNAIRE",
  "BID_RESPONSE_TEMPLATE",
  "AS_IS_ARCH",
  "CONTRACT",
  "PRICING",
  "PROCESS",
  "OTHER",
];

function parseJsonObject(rawValue, fallback) {
  const raw = String(rawValue || "{}");
  try {
    return JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw);
  } catch {
    return fallback;
  }
}

function parseClassificationOutput(rawValue) {
  const parsed = parseJsonObject(rawValue, {
    role: "OTHER",
    content_flags: {},
    has_template_fields: false,
    confidence: 0,
    reason_short: "Invalid classifier JSON",
  });

  const flags = {
    has_questions: Boolean(parsed.content_flags?.has_questions),
    has_requirements: Boolean(parsed.content_flags?.has_requirements),
    has_services: Boolean(parsed.content_flags?.has_services),
    has_pricing: Boolean(parsed.content_flags?.has_pricing),
    has_contractual_terms: Boolean(parsed.content_flags?.has_contractual_terms),
  };

  const role = ALLOWED_ROLES.includes(parsed.role) ? parsed.role : "OTHER";

  return {
    role,
    confidence: Math.max(0, Math.min(1, Number(parsed.confidence || 0))),
    reason_short: parsed.reason_short || null,
    content_flags: flags,
    has_template_fields: Boolean(parsed.has_template_fields),
    actions: {
      parse_segments: role === "SOW",
      parse_questions: flags.has_questions,
      parse_requirements: flags.has_requirements,
      parse_pricing: role === "PRICING" || flags.has_pricing,
      parse_contract: role === "CONTRACT" || flags.has_contractual_terms,
      assign_rfp_process_service: role === "PROCESS" || role === "BID_RESPONSE_TEMPLATE",
    },
  };
}

module.exports = {
  ALLOWED_ROLES,
  parseClassificationOutput,
  parseJsonObject,
};
