import { Client, GatewayIntentBits } from "discord.js";

import type { Command } from "./commands/command.js";
import type RconClient from "./rcon.js";
import { getAllDefaultExports } from "./util.js";

export default class Bot {
	private readonly client = new Client({
		intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
	});

	constructor(
		private readonly token: string,
		readonly rcon: RconClient,
	) {}

	async start() {
		const commands = await getAllDefaultExports<Command>("./commands", import.meta.dirname);

		this.client.once("clientReady", (c) => {
			console.log(`Client logged in as ${c.user.tag}`);
		});

		this.client.on("interactionCreate", async (interaction) => {
			if (!interaction.isChatInputCommand()) return;

			const cmd = commands.find((v) => v.data.name === interaction.commandName);
			if (!cmd) {
				await interaction.reply("Command not found");
				console.warn(`Command not found: ${interaction.command}`);
				return;
			}

			try {
				await cmd.execute(interaction, this);
			} catch (err) {
				console.error(`Error running '${interaction.commandName}' command: ${err}`);

				if (interaction.replied) {
					await interaction.editReply("Failed to execute this command");
					return;
				}

				await interaction.reply("Failed to execute this command");
			}
		});

		await this.client.login(this.token);
	}

	async shutdown() {
		try {
			console.log("Disconnecting client...");
			await this.client.destroy();
			console.log("Client disconnected");
		} catch (err) {
			console.error(`Error disconnecting client: ${err}`);
		}
	}
}
