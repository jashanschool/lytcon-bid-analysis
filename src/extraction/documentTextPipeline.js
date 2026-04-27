"use strict";

function normalizeFileBase(name) {
  // Avoid treating the same document as new just because the upload has _v2 or version 3.
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/([_\-\s]*(v|ver|version)\s*\d+)\s*$/, "")
    .trim();
}

function removeIndexAndFigureSections(text) {
  // German RFP PDFs often contain long index sections that pollute extraction.
  return String(text || "")
    .replace(/\n\s*(Inhaltsverzeichnis|Bilderverzeichnis|Abbildungsverzeichnis)\b[\s\S]*?(?=\n\d+\s)/gi, "\n")
    .replace(/\r/g, "")
    .trim();
}

function splitIntoSections(text) {
  return String(text || "")
    .split(/\n(?=\d+(?:\.\d+)*\s+)/)
    .filter(Boolean)
    .map((section, index) => ({
      section_index: index + 1,
      section_text: section.trim(),
    }));
}

function splitIntoChunks(sections, maxChars = 4500) {
  const chunks = [];

  for (const section of sections) {
    const text = String(section.section_text || "");
    for (let offset = 0; offset < text.length; offset += maxChars) {
      chunks.push(Object.assign({}, section, {
        chunk_index: Math.floor(offset / maxChars) + 1,
        chunk_text: text.slice(offset, offset + maxChars),
      }));
    }
  }

  return chunks;
}

module.exports = {
  normalizeFileBase,
  removeIndexAndFigureSections,
  splitIntoChunks,
  splitIntoSections,
};
