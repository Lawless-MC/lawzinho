import "dotenv/config";

import Bot from "./bot.js";
import RconClient from "./rcon.js";
import { getEnvironmentVariable } from "./util.js";

const rconHost = getEnvironmentVariable("RCON_HOST", true);
const rconPort = getEnvironmentVariable("RCON_PORT", true);
const rconPassword = getEnvironmentVariable("RCON_PASSWORD", true);

const token = getEnvironmentVariable("DISCORD_TOKEN", true);

const rcon = new RconClient(rconHost, rconPort, rconPassword);
const bot = new Bot(token, rcon);
await bot.start();

function shutdown() {
	bot.shutdown();
	process.exit(0);
}

process.once("SIGINT", () => bot.shutdown());
process.once("SIGTERM", () => bot.shutdown());
process.once("uncaughtException", async (ex) => {
	console.error(`Uncaught exception: ${ex}`);
	shutdown();
});
