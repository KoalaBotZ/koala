import { Event, t } from "@structures";
import { db } from "@database";
import { createEmbed } from "@magicyan/discord";
import { Events, version } from "discord.js";
import { settings } from "@settings";

new Event({
    name: "Bot mention",
    type: Events.MessageCreate,
    async run(message) {
        const { author: user, client } = message;

        if (user.bot || !message.mentions.has(client.user)) return;

        const { locale } = await db.users.get(user);

        const embed = createEmbed({
            thumbnail: client.user.displayAvatarURL(),
            color: settings.colors.default,
            description: t.translate({
                locale, key: "events.message_create.embed_description",
                options: {
                    author: user.toString(),
                    bot: client.user.toString()
                }
            }),
            fields: [
                {
                    name: `${settings.emoji.static.deno} Deno`,
                    value: `-# v: ${Deno.version.deno}`,
                    inline: true
                },
                {
                    name: `${settings.emoji.static.typeScript} TypeScript`,
                    value: `-# v: ${Deno.version.typescript}`,
                    inline: true
                },
                {
                    name: `${settings.emoji.static.djs} Discord.js`,
                    value: `-# v: ${version}`,
                    inline: true
                }
            ],
            footer: {
                text: "♥ & 🦕"
            }
        })

        await message.reply({ embeds: [embed] });
    }
});