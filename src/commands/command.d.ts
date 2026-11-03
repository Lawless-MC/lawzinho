import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import type Bot from "../bot.ts";

interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction, bot: Bot) => Promise<void>;
}
