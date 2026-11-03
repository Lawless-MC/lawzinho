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

const FORMAT_CODES = /§x(?:§[0-9a-f]){6}|§[0-9a-fk-or]/gi;
const TPS_VALUE = String.raw`\*?\d+(?:[.,]\d+)?`;

const LIST_PATTERN =
	/^(?:There are (?<englishOnline>\d+) of a max of (?<englishMax>\d+) players online:?|Há (?<portugueseOnline>\d+)(?:\/(?<portugueseTotal>\d+))? de (?:no máximo|um máximo de) (?<portugueseMax>\d+) jogadores online\.?)/i;
const TPS_PATTERN = new RegExp(
	String.raw`^TPS from last 1m, 5m, 15m:\s*(?<oneMinute>${TPS_VALUE}),\s*(?<fiveMinutes>${TPS_VALUE}),\s*(?<fifteenMinutes>${TPS_VALUE})$`,
);

export function parsePlayersList(response: string): PlayerList {
	const clean = stripFormatting(response);
	const match = LIST_PATTERN.exec(clean);

	if (!match?.groups) {
		throw new Error(`Unexpected list response: ${response}`);
	}

	const { englishOnline, englishMax, portugueseOnline, portugueseMax } = match.groups;

	const players = clean
		.slice(match[0].length)
		.split(/[\n,]/)
		.map((entry) => entry.split(":").pop()?.trim() ?? "")
		.filter((name) => name.length > 0);

	return {
		online: Number(englishOnline ?? portugueseOnline),
		max: Number(englishMax ?? portugueseMax),
		players,
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
