import { ComponentType, time } from "discord.js";
import { t } from "@structures";
import { createComponent } from "@koala";
import { calculatePamonhas, checkCooldown, updateUserRewards } from "./utils.ts";

createComponent({
	customId: "rewards/:type/:locale",
	type: ComponentType.Button,
	cache: "cached",
	async run(interaction, { type, locale }) {
		const { user } = interaction;

		const { canClaim, nextClaimTime } = await checkCooldown(user, type);
		if (!canClaim) {
			const relativeTime = time(Math.floor(nextClaimTime.getTime() / 1000), "R");

			await interaction.reply({
				flags: ["Ephemeral"],
				content: t.translate({
					locale,
					key: "commands.rewards.response.cooldown",
					options: {
						e: "⏰",
						time: relativeTime,
					},
				}),
			});
			return;
		}

		const pamonhas = calculatePamonhas(type);
		await updateUserRewards(user, type, pamonhas);

		await interaction.reply({
			flags: ["Ephemeral"],
			content: t.translate({
				locale,
				key: "commands.rewards.response.success",
				options: {
					user: user.toString(),
					pamonhas: pamonhas.toString(),
					reward: type,
				},
			}),
		});
	},
});
