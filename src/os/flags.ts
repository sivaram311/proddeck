/**
 * Cloud OS hard-out feature flags — default OFF (CONSCIOUS / Grok 1.0 plan).
 * Enable only via env on an explicit EM GO env; never bake ON into F/G without promote.
 */

function flagOn(name: string): boolean {
  const v = (process.env[name] ?? "0").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export const OS_FLAGS = {
  filebridgeDelete: () => flagOn("OS_FILEBRIDGE_DELETE"),
  driveGuardMutate: () => flagOn("OS_DRIVE_GUARD_MUTATE"),
  portsStopKill: () => flagOn("OS_PORTS_STOP_KILL"),
  yardLiveRunners: () => flagOn("OS_YARD_LIVE_RUNNERS"),
} as const;

export function osFlagsSnapshot() {
  return {
    OS_FILEBRIDGE_DELETE: OS_FLAGS.filebridgeDelete(),
    OS_DRIVE_GUARD_MUTATE: OS_FLAGS.driveGuardMutate(),
    OS_PORTS_STOP_KILL: OS_FLAGS.portsStopKill(),
    OS_YARD_LIVE_RUNNERS: OS_FLAGS.yardLiveRunners(),
  };
}
