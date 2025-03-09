import { ChatInputApplicationCommandData, ChatInputCommandInteraction, PermissionResolvable, PermissionsBitField } from "discord.js";
import { CommandHandler } from "./CommandHandler.ts";

export class Command implements ChatInputApplicationCommandData {
    public name: string;
    public description: string;

    public nameLocalizations?: ChatInputApplicationCommandData["nameLocalizations"];
    public descriptionLocalizations?: ChatInputApplicationCommandData["descriptionLocalizations"];
    public options?: ChatInputApplicationCommandData["options"];
    public type?: ChatInputApplicationCommandData["type"];
    public dmPermission?: ChatInputApplicationCommandData["dmPermission"];
    public defaultMemberPermissions?: PermissionResolvable | null | undefined;
    public nsfw?: ChatInputApplicationCommandData["nsfw"];
    public contexts?: ChatInputApplicationCommandData["contexts"];

    public run: (interaction: ChatInputCommandInteraction) => void | Promise<void>;

    constructor({
        name,
        nameLocalizations,
        description,
        descriptionLocalizations,
        options,
        type,
        dmPermission,
        defaultMemberPermissions,
        nsfw,
        contexts,
        run,
    }: Omit<ChatInputApplicationCommandData, 'name' | 'description'> & { name: string; description: string; run: (interaction: ChatInputCommandInteraction) => void | Promise<void> }) {
        this.name = name;
        this.nameLocalizations = nameLocalizations;
        this.description = description;
        this.descriptionLocalizations = descriptionLocalizations;
        this.options = options;
        this.type = type;
        this.dmPermission = dmPermission;
        this.defaultMemberPermissions = defaultMemberPermissions ?? PermissionsBitField.Flags.SendMessages;
        this.nsfw = nsfw;
        this.contexts = contexts;
        this.run = run;

        CommandHandler.registerCommand(this);
    }
}