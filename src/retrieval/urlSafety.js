"use strict";

const net = require("node:net");

function isPrivateIpAddress(value) {
  if (!net.isIP(value)) return false;

  if (value === "127.0.0.1" || value === "::1") return true;
  if (value.startsWith("10.")) return true;
  if (value.startsWith("192.168.")) return true;

  const parts = value.split(".").map(Number);
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts.length === 4 && parts[0] === 169 && parts[1] === 254) return true;

  return false;
}

function normalizeAndValidateUrl(rawUrl, options = {}) {
  const allowedHosts = options.allowedHosts || [];
  let parsed;

  try {
    parsed = new URL(String(rawUrl || "").trim());
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, reason: "unsupported_protocol" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // I keep this check explicit because the scraper should never fetch local/internal targets.
  if (hostname === "localhost" || hostname === "0.0.0.0" || isPrivateIpAddress(hostname)) {
    return { ok: false, reason: "private_or_local_target" };
  }

  if (allowedHosts.length) {
    let allowed = false;
    for (const host of allowedHosts) {
      if (hostname === host || hostname.endsWith(`.${host}`)) {
        allowed = true;
        break;
      }
    }
    if (!allowed) return { ok: false, reason: "host_not_allowed" };
  }

  // Fragments are not useful for downloads and make deduping harder.
  parsed.hash = "";
  return { ok: true, url: parsed.toString(), hostname };
}

module.exports = {
  isPrivateIpAddress,
  normalizeAndValidateUrl,
};
