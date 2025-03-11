import { t } from "@structures";
import { createCommand } from "@koala";
import { ApplicationCommandOptionType, ApplicationCommandType, InteractionContextType } from "discord.js";
import { db } from "@database";
import { settings } from "@settings";

createCommand({
	name: "locale",
	nameLocalizations: t.getLocalizations("commands.locale.name"),
	description: "Set the locale for the bot",
	descriptionLocalizations: t.getLocalizations("commands.locale.description"),
	type: ApplicationCommandType.ChatInput,
	contexts: [InteractionContextType.Guild],
	options: [
		{
			name: "locale",
			nameLocalizations: t.getLocalizations("commands.locale.name"),
			description: "The locale you want to set",
			descriptionLocalizations: t.getLocalizations("commands.locale.options.lang.description"),
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: "English",
					value: "en-US",
				},
				{
					name: "Español",
					value: "es-ES",
				},
				{
					name: "Português",
					value: "pt-BR",
				},
			],
		},
	],
	async run(interaction) {
		const { user, options } = interaction;

		await interaction.deferReply({ flags: ["Ephemeral"] });

		const locale = options.getString("locale", true);

		await db.users.update(user, { locale });

		const { locale: userLocale } = await db.users.get(user);

		await interaction.editReply(t.translate({
			locale: userLocale,
			key: "commands.locale.response",
			options: {
				e: settings.emoji.static.accept,
				lang: userLocale,
			},
		}));
	},
});
