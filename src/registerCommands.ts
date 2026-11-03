import "dotenv/config";

import { REST, Routes } from "discord.js";

import type { Command } from "./commands/command.js";
import { getAllDefaultExports, getEnvironmentVariable } from "./util.js";

const token = getEnvironmentVariable("DISCORD_TOKEN", true);
const clientId = getEnvironmentVariable("CLIENT_ID", true);
const guildId = getEnvironmentVariable("GUILD_ID");

const commands = await getAllDefaultExports<Command>("./commands", import.meta.dirname);
const body = commands.map((cmd) => cmd.data.toJSON());

const rest = new REST().setToken(token);

try {
	const routes = guildId !== undefined ? Routes.applicationCommands : Routes.applicationGuildCommands;
	await rest.put(routes(clientId, guildId), { body });

	if (guildId !== "") {
		console.log(`Registering the commands on the server: ${guildId}. On the client: ${clientId}`);
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
	} else {
		console.log(`Registering commands globally on the client: ${clientId}`);
	}
} catch (err) {
	console.error(`Error registering commands: ${err}`);
}
