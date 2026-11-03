import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function getEnvironmentVariable(key: string, required: boolean = false): string {
	const value = process.env[key];
	if (value) return value;
	if (required) throw new Error(`Missing required '${key}' environment variable`);
	return "";
}

async function findModuleFiles(dirPath: string): Promise<string[]> {
	const entries = await readdir(dirPath, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = join(dirPath, entry.name);
			if (entry.isDirectory()) return findModuleFiles(fullPath);
			const isModule = entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) && !entry.name.endsWith(".d.ts");
			return isModule ? [fullPath] : [];
		}),
	);
	return nested.flat();
}

async function importModule<TModule extends Record<string, unknown> = Record<string, unknown>>(
	filePath: string,
): Promise<TModule> {
	return import(pathToFileURL(filePath).href);
}

function hasDefaultExport<T>(mod: Record<string, unknown>): mod is { default: T } {
	return "default" in mod;
}

export async function getAllDefaultExports<T = unknown>(dirPath: string, baseDir: string = ""): Promise<T[]> {
	const files = await findModuleFiles(resolve(baseDir, dirPath));
	const modules = await Promise.all(files.map((file) => importModule(file)));
	return modules.filter(hasDefaultExport<T>).map((mod) => mod.default);
}
