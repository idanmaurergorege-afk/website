import path from "node:path";
import fs from "node:fs";

const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");

export const KEY_NAMES = [
  "ALPHA_VANTAGE_KEY",
  "METALS_API_KEY",
  "REALESTATE_API_KEY",
  "FRED_API_KEY",
  "WATCH_DATA_API_KEY",
  "CAR_DATA_API_KEY",
] as const;

export type KeyName = (typeof KEY_NAMES)[number];

type ConfigFile = Partial<Record<KeyName, string>>;

function readConfigFile(): ConfigFile {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(raw) as ConfigFile;
  } catch {
    return {};
  }
}

function writeConfigFile(config: ConfigFile) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Keys resolve from process.env first (.env.local), falling back to the
 * locally-stored config file written by the in-app Settings page. Both are
 * server-only and are never transmitted anywhere except to the provider
 * whose key it is.
 */
export function getKey(name: KeyName): string | undefined {
  const fromEnv = process.env[name];
  if (fromEnv) return fromEnv;
  const fromFile = readConfigFile()[name];
  return fromFile || undefined;
}

export function getKeyStatuses(): Record<KeyName, { set: boolean; masked: string | null; from: "env" | "settings" | null }> {
  const file = readConfigFile();
  const result = {} as Record<KeyName, { set: boolean; masked: string | null; from: "env" | "settings" | null }>;
  for (const name of KEY_NAMES) {
    const envVal = process.env[name];
    const fileVal = file[name];
    const value = envVal || fileVal;
    result[name] = {
      set: Boolean(value),
      masked: value ? maskKey(value) : null,
      from: envVal ? "env" : fileVal ? "settings" : null,
    };
  }
  return result;
}

export function setKeys(patch: Partial<Record<KeyName, string>>) {
  const current = readConfigFile();
  for (const [name, value] of Object.entries(patch)) {
    if (value === "") delete current[name as KeyName];
    else current[name as KeyName] = value;
  }
  writeConfigFile(current);
}

function maskKey(value: string): string {
  if (value.length <= 4) return "••••";
  return `••••${value.slice(-4)}`;
}
