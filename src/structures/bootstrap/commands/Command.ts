import {
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	PermissionResolvable,
} from "discord.js";
import { CommandHandler } from "./CommandHandler.ts";

export type CommandParams = {
	name: string;
	description: string;
	nameLocalizations?: ChatInputApplicationCommandData["nameLocalizations"];
	descriptionLocalizations?: ChatInputApplicationCommandData["descriptionLocalizations"];
	options?: ChatInputApplicationCommandData["options"];
	type?: ChatInputApplicationCommandData["type"];
	dmPermission?: ChatInputApplicationCommandData["dmPermission"];
	defaultMemberPermissions?:
		| PermissionResolvable
		| null;
	nsfw?: ChatInputApplicationCommandData["nsfw"];
	contexts?: ChatInputApplicationCommandData["contexts"];
	run: (
		interaction: ChatInputCommandInteraction,
	) =>
		| void
		| Promise<void>;
};

export class Command {
	public name: string;
	public description: string;

	public nameLocalizations?: CommandParams["nameLocalizations"];
	public descriptionLocalizations?: CommandParams["descriptionLocalizations"];
	public options?: CommandParams["options"];
	public type?: CommandParams["type"];
	public dmPermission?: CommandParams["dmPermission"];
	public defaultMemberPermissions?: CommandParams["defaultMemberPermissions"];
	public nsfw?: CommandParams["nsfw"];
	public contexts?: CommandParams["contexts"];

	public run: CommandParams["run"];

	constructor(
		params: CommandParams,
	) {
		this.name = params.name;
		this.description = params.description;
		this.nameLocalizations = params.nameLocalizations;
		this.descriptionLocalizations = params.descriptionLocalizations;
		this.options = params.options;
		this.type = params.type;
		this.dmPermission = params.dmPermission;
		this.defaultMemberPermissions = params.defaultMemberPermissions ??
			PermissionFlagsBits.SendMessages;
		this.nsfw = params.nsfw;
		this.contexts = params.contexts;
		this.run = params.run;

		CommandHandler.registerCommand(this);
	}
}
