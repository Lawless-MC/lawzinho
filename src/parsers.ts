export interface PlayerList {
	online: number;
	max: number;
	players: string[];
}

export interface TpsReport {
	oneMinute: number;
	fiveMinutes: number;
	fifteenMinutes: number;
}

const FORMAT_CODES = /§[0-9a-fk-or]/gi;
const TPS_VALUE = String.raw`\*?\d+(?:[.,]\d+)?`;

const LIST_PATTERN = /^There are (?<online>\d+) of a max of (?<max>\d+) players online:\s*(?<players>.*)$/;
const TPS_PATTERN = new RegExp(
	String.raw`^TPS from last 1m, 5m, 15m:\s*(?<oneMinute>${TPS_VALUE}),\s*(?<fiveMinutes>${TPS_VALUE}),\s*(?<fifteenMinutes>${TPS_VALUE})$`,
);

export function parsePlayersList(response: string): PlayerList {
	const match = LIST_PATTERN.exec(response.trim());

	if (!match?.groups) {
		throw new Error(`Unexpected list response: ${response}`);
	}

	const { online, max, players } = match.groups;

	return {
		online: Number(online),
		max: Number(max),
		players: players ? players.split(",").map((player) => player.trim()) : [],
	};
}

export function stripFormatting(text: string): string {
	return text.replace(FORMAT_CODES, "").trim();
}

function parseTpsValue(value: string): number {
	return Number(value.replace("*", "").replace(",", "."));
}

export function parseTps(response: string): TpsReport {
	const match = TPS_PATTERN.exec(stripFormatting(response));

	if (!match?.groups) {
		throw new Error(`Unexpected tps response: ${response}`);
	}

	const { oneMinute, fiveMinutes, fifteenMinutes } = match.groups;

	return {
		oneMinute: parseTpsValue(oneMinute),
		fiveMinutes: parseTpsValue(fiveMinutes),
		fifteenMinutes: parseTpsValue(fifteenMinutes),
	};
}
