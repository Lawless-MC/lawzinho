export function getEnvironmentVariable(key: string, required: boolean = false): string {
	const value = process.env[key];
	if (value) return value;
	if (required) throw new Error(`Missing required '${key}' environment variable`);
	return "";
}
