import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import type { Command } from "./command.js";

type Bot = Parameters<Command["execute"]>[1];

async function buildServerEmbed(bot: Bot): Promise<EmbedBuilder> {
	try {
		const players = await bot.rcon.listOnlinePlayers();
		const tps = await bot.rcon.getTps();

		return new EmbedBuilder().setTitle("💻 Server (🟢 online)").addFields([
			{
				name: "🎮 Players",
				value: `${players.online}/${players.max} online\n${players.players.map((name) => `\`${name}\``).join("\n") || "nobody online"}`,
				inline: true,
			},
			{
				name: "⏱️ TPS (1m · 5m · 15m)",
				value: [tps.oneMinute, tps.fiveMinutes, tps.fifteenMinutes].map((v) => v.toFixed(1)).join(" · "),
				inline: true,
			},
		]);
	} catch (err) {
		console.error("RCON check failed:", err);
		return new EmbedBuilder().setTitle("💻 Server (🔴 offline)");
	}
}

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("shows the bot latency and the Minecraft server status"),
	execute: async (interaction, bot) => {
		await interaction.deferReply();

		const gatewayPing = interaction.client.ws.ping;
		const replyPing = Date.now() - interaction.createdTimestamp;
		const serverEmbed = await buildServerEmbed(bot);

		await interaction.editReply({
			content: "Pong! 🏓",
			embeds: [
				new EmbedBuilder().setTitle("🤖 Bot").addFields([
					{
						name: "📡 Gateway ping",
						value: gatewayPing >= 0 ? `${gatewayPing}ms` : "n/a",
						inline: true,
					},
					{
						name: "💬 Reply ping",
						value: `${replyPing}ms`,
						inline: true,
					},
				]),
				serverEmbed,
			],
		});
	},
} satisfies Command;
