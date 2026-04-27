"use strict";

function resolveLocalizedTitle(value, fallback = "") {
  if (Array.isArray(value?.deu)) return value.deu.join(" ");
  if (typeof value?.deu === "string") return value.deu;
  if (typeof value === "string") return value;
  return fallback;
}

function normalizeTenderMetadata(row = {}) {
  const title = resolveLocalizedTitle(row["notice-title"], row.title || "");
  const date = row["deadline-date-lot"]?.[0] || null;
  const time = row["deadline-time-lot"]?.[0] || "23:59:59";
  const deadlineDateTime = date ? `${String(date).replace(/([+-]\d{2}:\d{2})$/, "")}T${time}` : null;

  return {
    ...row,
    publicationNumber: row["publication-number"] || row.publicationNumber || null,
    title,
    deadlineDateTime,
    pdfLink: row.links?.pdf?.DEU || null,
    xmlLink: row.links?.xml?.MUL || null,
  };
}

module.exports = {
  normalizeTenderMetadata,
  resolveLocalizedTitle,
};
