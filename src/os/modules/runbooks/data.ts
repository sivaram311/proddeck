export type RunbookId =
  | "port-conflict"
  | "promote-stuck"
  | "disk-low"
  | "nginx-502"
  | "jwt-issuer";

export type Runbook = {
  id: RunbookId;
  title: string;
  category: string;
  steps: string[];
  links: { label: string; href: string }[];
};

export const RUNBOOKS: Runbook[] = [
  {
    id: "port-conflict",
    title: "Port conflict / bind failed",
    category: "Ports",
    steps: [
      "Open Ports — find reserved-not-listening vs unknown listen.",
      "Confirm MyAgent registry row before any kill.",
      "Kill-by-port only the app’s reserved port (never $PID as a local).",
      "If bind race: poll LISTENING 30–60s after start.ps1.",
    ],
    links: [
      { label: "Open Ports", href: "/?osPlace=control-tower" },
      { label: "Dispatch briefing", href: "/?osPlace=forge" },
    ],
  },
  {
    id: "promote-stuck",
    title: "Promote stuck / no GO",
    category: "Promote",
    steps: [
      "Open Promote checklist — ensure field-ops tip checked.",
      "Confirm evidence under H:\\releases\\<app>-<ver>\\evidence\\q1|q2.",
      "Only EM records GO; ops awaits GO.",
      "Hire field-ops pack from Yard if lessons not applied.",
    ],
    links: [
      { label: "Promote", href: "/?osPlace=forge" },
      { label: "Yard", href: "/?osPlace=yard" },
      { label: "Archive", href: "/?osPlace=archive" },
    ],
  },
  {
    id: "disk-low",
    title: "Disk low on E/F/G/H",
    category: "Pulse",
    steps: [
      "Open Pulse — note free GB per drive role.",
      "Do not delete without explicit confirm (CONSCIOUS).",
      "Archive/prune only with EM plan + user confirm.",
      "H: is handoff — not a runtime.",
    ],
    links: [{ label: "Pulse", href: "/?osPlace=control-tower" }],
  },
  {
    id: "nginx-502",
    title: "Public 502 / origin down",
    category: "Beacon",
    steps: [
      "Beacon — is origin TCP up on reserved port?",
      "Confirm nginx upstream port matches registry.",
      "Smoke origin :port then public HTTPS.",
      "Do not restart nginx from phone MVP.",
    ],
    links: [
      { label: "Beacon", href: "/?osPlace=control-tower" },
      { label: "Ports", href: "/?osPlace=control-tower" },
    ],
  },
  {
    id: "jwt-issuer",
    title: "CSS JWT / localhost issuer",
    category: "Identity",
    steps: [
      "Confirm client bundle bakes NEXT_PUBLIC_CSS_ISSUER=https://css.delena.buzz.",
      "Rebuild with .env.production before F/G cutover.",
      "Hard-refresh phone; clear stale chunks.",
      "Vault — Sign out then re-auth.",
    ],
    links: [
      { label: "Vault", href: "/?osPlace=vault" },
      { label: "OPS bake note", href: "/docs/OPS.md" },
    ],
  },
];
