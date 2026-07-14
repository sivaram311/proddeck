"use server";

import { listArchiveReleases } from "./releases";
import type { ArchiveListResult } from "./types";

export async function fetchArchiveReleases(): Promise<ArchiveListResult> {
  return listArchiveReleases();
}
