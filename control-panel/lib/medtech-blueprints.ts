import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const FLOW_PACK_PATH = path.join(REPO_ROOT, "docs", "strategy", "medtech-intake-flow-pack.json");
const FLOW_PACK_INDEX_PATH = path.join(REPO_ROOT, "scripts", "data", "medtech-flow-pack.index.json");

export interface MedtechToolBlueprint {
  role: string;
  recommendedPatterns: string[];
  officialSources: string[];
}

export interface MedtechLaneBlueprint {
  id: string;
  name: string;
  purpose: string;
  sourceTools: string[];
  trigger: {
    tool: string;
    pattern: string;
  };
  recordModel?: Record<string, string[] | string>;
  actions: string[];
}

export interface MedtechFlowPack {
  version: string;
  sourcePolicy: string;
  primaryTools: Record<string, MedtechToolBlueprint>;
  recommendedLanes: MedtechLaneBlueprint[];
  defaultGuidance: string[];
}

export interface MedtechLanePackIndex {
  packVersion: string;
  sourcePack: string;
  sourcePolicy: string;
  artifacts: Array<{
    laneId: string;
    file: string;
    purpose: string;
  }>;
  operatorRules: string[];
}

export function getMedtechFlowPack(): MedtechFlowPack {
  const raw = fs.readFileSync(FLOW_PACK_PATH, "utf8");
  return JSON.parse(raw) as MedtechFlowPack;
}

export function getMedtechFlowPackPath() {
  return FLOW_PACK_PATH;
}

export function getMedtechLanePackIndex(): MedtechLanePackIndex | null {
  if (!fs.existsSync(FLOW_PACK_INDEX_PATH)) {
    return null;
  }

  const raw = fs.readFileSync(FLOW_PACK_INDEX_PATH, "utf8");
  return JSON.parse(raw) as MedtechLanePackIndex;
}

export function getMedtechLanePackIndexPath() {
  return FLOW_PACK_INDEX_PATH;
}
