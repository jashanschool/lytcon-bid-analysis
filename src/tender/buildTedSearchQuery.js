"use strict";

const DEFAULT_FIELDS = [
  "publication-number",
  "notice-title",
  "classification-cpv",
  "buyer-country",
  "buyer-name",
  "deadline-date-lot",
  "deadline-time-lot",
  "publication-date",
  "links",
];

function buildTedSearchQuery(options = {}) {
  const terms = options.terms || [
    "Microsoft 365",
    "M365",
    "Office 365",
    "SharePoint",
    "Microsoft Teams",
    "Managed Workplace",
    "Cloud-Arbeitsplatz",
  ];

  const fullText = terms.map((term) => `"${term}"`).join(" OR ");
  const query = `buyer-country = DEU AND notice-type = CN-STANDARD AND FT=(${fullText}) SORT BY publication-date DESC`;

  return {
    queryProfile: options.queryProfile || "m365_managed_workplace",
    body: {
      query,
      fields: options.fields || DEFAULT_FIELDS,
      limit: options.limit || 200,
      scope: "ACTIVE",
      checkQuerySyntax: false,
      paginationMode: "ITERATION",
    },
  };
}

module.exports = {
  buildTedSearchQuery,
};
