import { Koala } from "@structures";
import { GatewayIntentBits } from "discord.js";
import { EnvManager } from "@settings";

EnvManager.initialize();

new Koala({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});
