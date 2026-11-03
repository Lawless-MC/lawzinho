import { Rcon } from "rcon-client";

import { parsePlayersList, parseTps, type PlayerList, type TpsReport } from "./parsers.js";

export default class RconClient {
	constructor(
		private readonly host: string,
		private readonly port: string,
		private readonly password: string,
	) {}

	async sendCommand(command: string): Promise<string> {
		const rcon = await Rcon.connect({ host: this.host, port: Number(this.port), password: this.password });
		try {
			return await rcon.send(command);
		} catch (err) {
			throw new Error(`Rcon error: ${err}`, { cause: err });
		} finally {
			rcon.end();
		}
	}

	async listOnlinePlayers(): Promise<PlayerList> {
		return parsePlayersList(await this.sendCommand("minecraft:list"));
	}

	async getTps(): Promise<TpsReport> {
		return parseTps(await this.sendCommand("tps"));
	}
}
