#!/usr/bin/env node
/**
 * D1 — Dispatch deep-link contract unit checks (no build required).
 * Mirrors src/os/modules/dispatch/build-url.ts behavior.
 */
function normalizeBrief(text) {
  return text.trim();
}

function buildDispatchUrl(input) {
  const brief = normalizeBrief(input.brief);
  if (!brief) return null;
  const base = input.base.replace(/\/$/, "");
  const url = new URL("/desk", `${base}/`);
  url.searchParams.set("src", "proddeck");
  url.searchParams.set("crew", input.crew);
  url.searchParams.set("intent", input.intent);
  url.searchParams.set("brief", brief);
  url.searchParams.set("env", input.env);
  if (input.session) url.searchParams.set("session", input.session);
  if (input.skills) url.searchParams.set("skills", input.skills);
  if (input.returnUrl) url.searchParams.set("return", input.returnUrl.replace(/\/$/, ""));
  return url.toString();
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const empty = buildDispatchUrl({
  base: "https://agentverse.delena.buzz",
  crew: "crew-lead",
  intent: "hire",
  brief: "   ",
  env: "dev",
  returnUrl: "https://home.delena.buzz/?osPlace=watch",
});
assert(empty === null, "empty brief must return null");

const long = "x".repeat(2500);
const url = buildDispatchUrl({
  base: "https://agentverse.delena.buzz",
  crew: "promote-ops",
  intent: "crew-fabric",
  brief: long,
  env: "prod",
  skills: "promote-em,promote-qa",
  session: "sess-1",
  returnUrl: "https://home.delena.buzz/?osPlace=watch",
});
assert(url, "url required");
const u = new URL(url);
assert(u.searchParams.get("src") === "proddeck", "src");
assert(u.searchParams.get("crew") === "promote-ops", "crew");
assert(u.searchParams.get("intent") === "crew-fabric", "intent");
assert(u.searchParams.get("env") === "prod", "env");
assert(u.searchParams.get("skills") === "promote-em,promote-qa", "skills");
assert(u.searchParams.get("session") === "sess-1", "session");
assert(u.searchParams.get("return")?.includes("osPlace=watch"), "return");
assert((u.searchParams.get("brief") || "").length === 2500, "brief length preserved (URI encode separately)");
console.log("OK: dispatch deep-link contract");
