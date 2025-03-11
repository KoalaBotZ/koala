import { ClientEvents } from "discord.js";
import { EventHandler } from "./EventHandler.ts";

export class Event<K extends keyof ClientEvents> {
	public name: string;
	public type: K;
	public once: boolean;
	public run: (
		...args: ClientEvents[K]
	) =>
		| void
		| Promise<void>;

	constructor({ name, type, once = false, run }: {
		name: string;
		type: K;
		once?: boolean;
		run: (
			...args: ClientEvents[K]
		) =>
			| void
			| Promise<void>;
	}) {
		this.name = name;
		this.type = type;
		this.once = once;
		this.run = run;

		EventHandler.registerEvent(this);
	}
}
