import { ApplicationCommandType, InteractionContextType } from "discord.js";
import { t } from "@structures";
import { createCommand } from "@koala";
import { db } from "@database";

createCommand({
	name: "ping",
	description: "Check the bot's response time",
	descriptionLocalizations: t.getLocalizations("commands.ping.description"),
	type: ApplicationCommandType.ChatInput,
	contexts: [InteractionContextType.Guild],
	async run(interaction) {
		const { client, user } = interaction;

		await interaction.deferReply({ flags: ["Ephemeral"] });

		const { locale } = await db.users.get(user);

		await interaction.editReply(t.translate({
			locale,
			key: "commands.ping.response",
			options: {
				response_time: client.ws.ping.toString(),
			},
		}));
	},
});
