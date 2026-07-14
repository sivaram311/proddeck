import { readFile } from "fs/promises";
import path from "path";
import { z } from "zod";

const CategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  crewRole: z.string().min(1),
});

const CrewSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  watch: z.string().min(1),
});

const OsModuleFlagsSchema = z.object({
  pulse: z.boolean(),
  ports: z.boolean(),
  beacon: z.boolean(),
  identity: z.boolean(),
  "activity-log": z.boolean(),
  archive: z.boolean(),
  dispatch: z.boolean(),
  promote: z.boolean(),
  yard: z.boolean(),
  runbooks: z.boolean(),
  appliances: z.boolean(),
  "drive-guard": z.boolean(),
  filebridge: z.boolean(),
});

export const ProdDeckPackSchema = z.object({
  appId: z.literal("proddeck"),
  displayName: z.string().min(1),
  version: z.string().min(1),
  modules: z.object({
    catalog: z.boolean(),
    helpdesk: z.boolean(),
    scene: z.boolean(),
    crewsDesk: z.boolean(),
  }),
  os: z
    .object({
      enabled: z.boolean(),
      defaultPlace: z.enum([
        "quay",
        "control-tower",
        "forge",
        "yard",
        "archive",
        "watch",
        "remember",
        "vault",
      ]),
      modules: OsModuleFlagsSchema,
    })
    .optional(),
  scene: z.object({
    pack: z.string().min(1),
    defaultView: z.enum(["catalog", "helpdesk", "scene"]),
  }),
  helpdesk: z.object({
    categories: z.array(CategorySchema).min(1),
  }),
  crews: z.array(CrewSchema).optional().default([]),
  auth: z.object({
    cssClientId: z.literal("proddeck"),
  }),
  hosts: z.object({
    dev: z.string().min(1),
    preprod: z.string().min(1),
    prod: z.string().min(1),
  }),
  ports: z.object({
    dev: z.number().int(),
    preprod: z.number().int(),
    prod: z.number().int(),
  }),
});

export type ProdDeckPack = z.infer<typeof ProdDeckPackSchema>;

export type PackPublic = Pick<
  ProdDeckPack,
  "appId" | "displayName" | "version" | "modules" | "scene" | "helpdesk" | "crews" | "os"
>;

let cached: ProdDeckPack | null = null;

/** Clear pack cache (DEV hot-reload / after pack file edits). */
export function clearPackCache() {
  cached = null;
}

export async function loadProdDeckPack(): Promise<ProdDeckPack> {
  if (cached && process.env.NODE_ENV === "production") return cached;
  const file = path.join(process.cwd(), "packs", "proddeck", "app.json");
  const raw = JSON.parse(await readFile(file, "utf8")) as unknown;
  const parsed = ProdDeckPackSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid ProdDeck pack: ${parsed.error.message}`);
  }
  cached = parsed.data;
  return cached;
}

export function toPackPublic(pack: ProdDeckPack): PackPublic {
  return {
    appId: pack.appId,
    displayName: pack.displayName,
    version: pack.version,
    modules: pack.modules,
    scene: pack.scene,
    helpdesk: pack.helpdesk,
    crews: pack.crews || [],
    os: pack.os,
  };
}
