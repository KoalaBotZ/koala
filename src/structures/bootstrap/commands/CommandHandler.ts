import { Client, Collection } from "discord.js";
import { Command } from "./Command.ts";
import { load } from "../utils.ts";
import consola from "consola";
import ck from "chalk";

export class CommandHandler {
	public static commands: Collection<
		string,
		Command
	> = new Collection();

	public static registerCommand(
		command: Command,
	): void {
		if (this.commands.has(command.name)) {
			consola.warn(`A command with the name ${command.name} is already registered.`);
			return;
		}

		this.commands.set(
			command.name,
			command,
		);
		consola.success(ck.greenBright(`{/} Command ${command.name} registered successfully.`));
	}

	public static async loadCommands(client: Client): Promise<void> {
		await load();
		if (client.application) {
			await client.application.commands.set(this.commands.map(
				(
					command,
				) => command,
			));
		}

		client.on("interactionCreate", async (interaction) => {
			if (!interaction.isChatInputCommand()) {
				return;
			}

			const command = this.commands.get(interaction.commandName);
			if (!command) {
				consola.warn(`Command "${interaction.commandName}" not found.`);
				return;
			}

			try {
				await command.run(interaction);
			} catch (error) {
				consola.error(
					`Error executing command "${interaction.commandName}":`,
					error,
				);
				await interaction.reply({
					flags: ["Ephemeral"],
					content: "An error occurred while executing this command.",
				});
			}
		});
	}
}
