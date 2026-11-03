import { Rcon } from "rcon-client";

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
}
