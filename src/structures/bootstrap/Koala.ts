import { Client, GatewayIntentBits, Partials } from "discord.js";
import { CommandHandler, ComponentHandler, EventHandler } from "@structures";
import { EnvManager } from "@settings";
import { Database } from "@database";
import consola from "consola";
import ck from "chalk";

interface KoalaProps {
	intents: GatewayIntentBits[];
	partials?: Partials[];
	whenReady?: (client: Koala) => void | Promise<void>;
	beforeReady?: (client: Koala) => void | Promise<void>;
	afterReady?: (client: Koala) => void | Promise<void>;
}

export class Koala extends Client<true> {
	private readonly whenReadyCallback?: (client: Koala) => void | Promise<void>;
	private readonly beforeReadyCallback?: (client: Koala) => void | Promise<void>;
	private readonly afterReadyCallback?: (client: Koala) => void | Promise<void>;

	constructor(props: KoalaProps) {
		super({
			intents: props.intents,
			partials: props.partials || [],
		});

		this.whenReadyCallback = props.whenReady;
		this.beforeReadyCallback = props.beforeReady;
		this.afterReadyCallback = props.afterReady;

		this.start();
	}

	private async start(): Promise<void> {
		try {
			const envManager = EnvManager.getInstance();

			await Database.connect();
			await this.beforeReadyPhase();
			await this.login(envManager.get("DISCORD_TOKEN"));
			await this.loadHandlers();
			await this.whenReadyPhase();
			await this.afterReadyPhase();

			consola.success(
				ck.greenBright(`Logged in as ${ck.underline(this.user.displayName)}`),
				ck.blueBright(`🦕 deno ${ck.underline(Deno.version.deno)}`),
			);
		} catch (error) {
			consola.error("Failed to start the bot:", error);
			throw error;
		}
	}

	private async beforeReadyPhase(): Promise<void> {
		if (this.beforeReadyCallback) {
			await this.beforeReadyCallback(this);
		}
	}

	private async whenReadyPhase(): Promise<void> {
		if (this.whenReadyCallback) {
			await this.whenReadyCallback(this);
		}
	}

	private async afterReadyPhase(): Promise<void> {
		if (this.afterReadyCallback) {
			await this.afterReadyCallback(this);
		}
	}

	private async loadHandlers(): Promise<void> {
		await EventHandler.loadEvents(this);
		await CommandHandler.loadCommands(this);
		await ComponentHandler.loadComponents(this);
	}
}
