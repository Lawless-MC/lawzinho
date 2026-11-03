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
	if (guildId) {
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
		console.log(`Registering the commands on the server: ${guildId}. On the client: ${clientId}`);
	} else {
		await rest.put(Routes.applicationCommands(clientId), { body });
		console.log(`Registering commands globally on the client: ${clientId}`);
	}
} catch (err) {
	console.error(`Error registering commands: ${err}`);
}
