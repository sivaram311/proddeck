export type ApplianceId =
  | "portal"
  | "agentverse"
  | "agentverse-staging"
  | "agentverse-v2"
  | "agentverse-v2-staging"
  | "hdrive"
  | "filebridge"
  | "proddeck"
  | "css"
  | "stack-pilot";

export type ApplianceDef = {
  id: ApplianceId;
  label: string;
  blurb: string;
  openUrl: string;
  probeUrl?: string;
  probePort?: number;
  /** Optional return deep-link back to a ProdDeck Place */
  returnPlace?: string;
};

function envUrl(...keys: string[]): string {
  for (const k of keys) {
    const v = process.env[k]?.trim();
    if (v) return v.replace(/\/$/, "");
  }
  return "http://127.0.0.1:9000";
}

const cssPublic = envUrl("NEXT_PUBLIC_CSS_ISSUER", "CSS_AUTH_URL");
const cssAuth = envUrl("CSS_AUTH_URL", "NEXT_PUBLIC_CSS_ISSUER");

export const APPLIANCES: ApplianceDef[] = [
  {
    id: "proddeck",
    label: "ProdDeck",
    blurb: "This home / Cloud OS",
    openUrl:
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      "https://home.delena.buzz",
    probePort: 5320,
  },
  {
    id: "portal",
    label: "Agent Portal",
    blurb: "Sessions & workspaces",
    openUrl: "https://portal.delena.buzz/",
    probePort: 5080,
  },
  {
    id: "agentverse",
    label: "AgentVerse",
    blurb: "Public short host (upgrade / Dispatch SoT)",
    openUrl: "https://agentverse.delena.buzz/",
    probePort: 5312,
  },
  {
    id: "agentverse-staging",
    label: "AgentVerse staging",
    blurb: "PREPROD 7-story densify (0.3.15-unstable)",
    openUrl: "https://agentverse-staging.delena.buzz/",
    probePort: 4310,
  },
  {
    id: "agentverse-v2",
    label: "AgentVerse v2",
    blurb: "stable-v2 industrial PROD",
    openUrl: "https://agentverse-v2.delena.buzz/",
    probePort: 5311,
  },
  {
    id: "agentverse-v2-staging",
    label: "AgentVerse v2 staging",
    blurb: "PREPROD industrial (blue/white open floor)",
    openUrl: "https://agentverse-v2-staging.delena.buzz/",
    probePort: 4311,
  },
  {
    id: "hdrive",
    label: "H-Drive",
    blurb: "Release / evidence HTTP",
    openUrl: "https://hdrive.delena.buzz/",
    probePort: 5010,
  },
  {
    id: "filebridge",
    label: "FileBridge",
    blurb: "Scoped file manager sample",
    openUrl: "http://127.0.0.1:8082/",
    probePort: 8082,
  },
  {
    id: "css",
    label: "CSS",
    blurb: "Centralized Security System",
    openUrl: cssPublic,
    probeUrl: `${cssAuth}/.well-known/jwks.json`,
  },
  {
    id: "stack-pilot",
    label: "Stack Pilot",
    blurb: "Control / stack surfaces — returns to Control Tower",
    openUrl: "https://control.delena.buzz/",
    probePort: 5000,
    returnPlace: "control-tower",
  },
];
