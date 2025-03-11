import {
	ButtonInteraction,
	CacheType,
	ComponentType,
	ModalSubmitInteraction,
	RoleSelectMenuInteraction,
	StringSelectMenuInteraction,
	UserSelectMenuInteraction,
} from "discord.js";
import { ComponentHandler } from "./ComponentHandler.ts";

type InteractionMap<C extends CacheType> = {
	[ComponentType.Button]: ButtonInteraction<C>;
	[ComponentType.StringSelect]: StringSelectMenuInteraction<C>;
	[ComponentType.UserSelect]: UserSelectMenuInteraction<C>;
	[ComponentType.RoleSelect]: RoleSelectMenuInteraction<C>;
	[ComponentType.TextInput]: ModalSubmitInteraction<C>;
};

export type ComponentInteraction<T extends ComponentType | ComponentType[], C extends CacheType> = T extends
	ComponentType[] ? InteractionMap<C>[Extract<T[number], keyof InteractionMap<C>>]
	: T extends ComponentType ? InteractionMap<C>[Extract<T, keyof InteractionMap<C>>]
	: never;

export type ExtractParams<TPattern extends string> = TPattern extends `${infer _Prefix}:${infer Param}/${infer Rest}`
	? { [K in Param | keyof ExtractParams<Rest>]: string }
	: TPattern extends `${infer _Prefix}:${infer Param}` ? { [K in Param]: string }
	// deno-lint-ignore ban-types
	: {};

export class Component<
	T extends ComponentType | ComponentType[],
	TPattern extends string,
	C extends CacheType,
> {
	public customIdPattern: TPattern;
	public type: T;
	public cache: C;

	public run: (interaction: ComponentInteraction<T, C>, params: ExtractParams<TPattern>) => void | Promise<void>;

	constructor({
		customId,
		type,
		cache,
		run,
	}: {
		customId: TPattern;
		type: T;
		cache: C;
		run: (interaction: ComponentInteraction<T, C>, params: ExtractParams<TPattern>) => void | Promise<void>;
	}) {
		this.customIdPattern = customId;
		this.type = type;
		this.cache = cache;
		this.run = run;

		ComponentHandler.registerComponent(this);
	}

	public match(customId: string): ExtractParams<TPattern> | null {
		const patternParts = this.customIdPattern.split("/");
		const customIdParts = customId.split("/");

		if (patternParts.length !== customIdParts.length) return null;

		const params: Record<string, string> = {};
		for (let i = 0; i < patternParts.length; i++) {
			const patternPart = patternParts[i];
			const customIdPart = customIdParts[i];

			if (patternPart.startsWith(":")) {
				const paramName = patternPart.slice(1);
				params[paramName] = customIdPart;
			} else if (patternPart !== customIdPart) {
				return null;
			}
		}

		return params as ExtractParams<TPattern>;
	}
}
