export type ApplianceId =
  | "portal"
  | "agentverse"
  | "agentverse-v2"
  | "hdrive"
  | "filebridge"
  | "proddeck"
  | "css";

export type ApplianceDef = {
  id: ApplianceId;
  label: string;
  blurb: string;
  openUrl: string;
  probeUrl?: string;
  probePort?: number;
};

export const APPLIANCES: ApplianceDef[] = [
  {
    id: "proddeck",
    label: "ProdDeck",
    blurb: "This home / Cloud OS",
    openUrl: "https://home.delena.buzz/",
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
    blurb: "Classic work plane",
    openUrl: "https://agentverse.delena.buzz/",
    probePort: 5310,
  },
  {
    id: "agentverse-v2",
    label: "AgentVerse v2",
    blurb: "stable-v2 side deploy",
    openUrl: "https://agentverse-v2.delena.buzz/",
    probePort: 5311,
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
    openUrl: "https://css.delena.buzz/",
    probeUrl: "http://127.0.0.1:5900/.well-known/jwks.json",
  },
];
