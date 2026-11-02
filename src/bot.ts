import { Client, GatewayIntentBits } from "discord.js";

export default class Bot {
	private readonly client = new Client({
		intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
	});

	constructor(private readonly token: string) {}

	async start() {
		this.client.once("clientReady", (c) => {
			console.log(`Client logged in as ${c.user.tag}`);
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
