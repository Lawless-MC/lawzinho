import Database from "better-sqlite3";

import { getEnvironmentVariable } from "./util.js";

const dbPath = getEnvironmentVariable("DB_PATH", true);
export const db = new Database(dbPath);
