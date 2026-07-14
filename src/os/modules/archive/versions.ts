import { access, readFile } from "fs/promises";
import type { EnvVersionPin, EnvVersionPinsResult } from "./types";

const PIN_SPECS: ReadonlyArray<{
  env: EnvVersionPin["env"];
  drive: EnvVersionPin["drive"];
  path: string;
}> = [
  { env: "PREPROD", drive: "F:", path: "F:\\apps\\proddeck\\VERSION" },
  { env: "PROD", drive: "G:", path: "G:\\apps\\proddeck\\VERSION" },
];

async function readPin(spec: (typeof PIN_SPECS)[number]): Promise<EnvVersionPin> {
  try {
    await access(spec.path);
    const raw = await readFile(spec.path, "utf8");
    const version = raw.trim();
    return {
      env: spec.env,
      drive: spec.drive,
      path: spec.path,
      version: version.length > 0 ? version : null,
    };
  } catch {
    return {
      env: spec.env,
      drive: spec.drive,
      path: spec.path,
      version: null,
    };
  }
}

/** Server-side read of F:/G: live VERSION files. Never throws — missing drives pin as null. */
export async function readEnvVersionPins(): Promise<EnvVersionPinsResult> {
  const pins = await Promise.all(PIN_SPECS.map((spec) => readPin(spec)));
  return { pins };
}
