"use strict";

const { parseJsonObject } = require("./documentClassifier");

function parseStructuredOutput(rawValue) {
  return parseJsonObject(rawValue, {
    parse_error: true,
    requirements: [],
    questions: [],
    deadlines: [],
    pricing_terms: [],
    template_fields: [],
  });
}

function prepareItemsForDb({ extracted = {}, rfp_id, file_name, section_index }) {
  const rows = [];

  for (const [item_type, values] of Object.entries(extracted)) {
    if (!Array.isArray(values)) continue;

    for (const value of values) {
      rows.push({
        rfp_id,
        file_name,
        section_index,
        item_type,
        text: value?.text || value,
        status: "extracted",
      });
    }
  }

  return rows.length
    ? rows
    : [{ rfp_id, file_name, item_type: "none", text: null, status: "no_items" }];
}

module.exports = {
  parseStructuredOutput,
  prepareItemsForDb,
};
