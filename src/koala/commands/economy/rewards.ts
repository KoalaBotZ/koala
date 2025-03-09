import { Command, t } from '@structures';
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createRow } from "@magicyan/discord";
import { db } from "@database";

enum Rewards {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
}

new Command({
    name: "rewards",
    nameLocalizations: t.getLocalizations("commands.rewards.name"),
    description: "Collect your rewards.",
    descriptionLocalizations: t.getLocalizations("commands.rewards.description"),
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const { user } = interaction;

        await interaction.deferReply({ flags: ["Ephemeral"] });

        const { locale } = await db.users.get(user);

        const rewardStyles: Record<Rewards, ButtonStyle> = {
            [Rewards.DAILY]: ButtonStyle.Primary,
            [Rewards.WEEKLY]: ButtonStyle.Success,
            [Rewards.MONTHLY]: ButtonStyle.Danger,
        };

        const createRewardButton = (reward: Rewards) => {
            const style = rewardStyles[reward] || ButtonStyle.Secondary;

            return new ButtonBuilder({
                customId: `rewards/${reward}/${locale}`,
                label: t.translate({
                    locale,
                    key: `commands.rewards.buttons.type.${reward}`,
                }),
                style,
            });
        };

        const buttons = Object.values(Rewards).map((reward) => createRewardButton(reward));

        const row = createRow(...buttons);

        await interaction.editReply({
            content: t.translate({
                locale,
                key: "commands.rewards.select_reward",
            }),
            components: [row],
        });
    },
});