"use client";

import type { ComponentType } from "react";
import type { OsModuleId } from "./types";
import { ActivityLogView } from "./modules/activity-log";
import { AppliancesView } from "./modules/appliances";
import { ArchiveView } from "./modules/archive";
import { BeaconView } from "./modules/beacon";
import { DispatchView } from "./modules/dispatch";
import { DriveGuardView } from "./modules/drive-guard";
import { FileBridgeView } from "./modules/filebridge";
import { IdentityView } from "./modules/identity";
import { PortsView } from "./modules/ports";
import { PromoteView } from "./modules/promote";
import { PulseView } from "./modules/pulse";
import { RunbooksView } from "./modules/runbooks";
import { YardView } from "./modules/yard";

export const OS_MODULE_VIEWS: Record<OsModuleId, ComponentType> = {
  pulse: PulseView,
  ports: PortsView,
  beacon: BeaconView,
  identity: IdentityView,
  "activity-log": ActivityLogView,
  archive: ArchiveView,
  dispatch: DispatchView,
  promote: PromoteView,
  yard: YardView,
  runbooks: RunbooksView,
  appliances: AppliancesView,
  "drive-guard": DriveGuardView,
  filebridge: FileBridgeView,
};
