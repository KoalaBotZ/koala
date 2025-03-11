import { Command, CommandParams, Component, ComponentInteraction, Event, ExtractParams } from "@structures";
import { CacheType, ClientEvents, ComponentType } from "discord.js";

function createCommand(params: CommandParams): Command {
	return new Command(params);
}

function createComponent<
	T extends ComponentType | ComponentType[],
	TPattern extends string,
	C extends CacheType,
>(params: {
	customId: TPattern;
	type: T;
	cache: C;
	run: (
		interaction: ComponentInteraction<T, C>,
		params: ExtractParams<TPattern>,
	) => void | Promise<void>;
}): Component<T, TPattern, C> {
	return new Component(params);
}

function createEvent<K extends keyof ClientEvents>(params: {
	name: string;
	type: K;
	once?: boolean;
	run: (
		...args: ClientEvents[K]
	) =>
		| void
		| Promise<void>;
}): Event<K> {
	return new Event(params);
}

export { createCommand, createComponent, createEvent };
