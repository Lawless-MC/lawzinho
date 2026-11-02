import "dotenv/config";

import Bot from "./bot.js";

const token = process.env["DISCORD_TOKEN"];
if (token === undefined) throw new Error(`Missing required 'DISCORD_TOKEN' environment variable`);

const bot = new Bot(token);
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
