"use server";

import { listArchiveReleases } from "./releases";
import type { ArchiveListResult, EnvVersionPinsResult } from "./types";
import { readEnvVersionPins } from "./versions";

export async function fetchArchiveReleases(): Promise<ArchiveListResult> {
  return listArchiveReleases();
}

export async function fetchEnvVersionPins(): Promise<EnvVersionPinsResult> {
  return readEnvVersionPins();
}
