import { Client, ClientEvents } from "discord.js";
import { Event } from "./Event.ts";
import consola from "consola";
import ck from "chalk";
import { load } from "../utils.ts";

export class EventHandler {
    private static events: Array<Event<keyof ClientEvents>> = [];

    public static registerEvent<K extends keyof ClientEvents>(event: Event<K>): void {
        this.events.push(event as unknown as Event<keyof ClientEvents>);
        consola.success(ck.greenBright(`{.} Event ${event.name} registered successfully.`));
    }

    public static async loadEvents(client: Client): Promise<void> {
        await load();
        for (const event of this.events) {
            if (event.once) {
                client.once(event.type, (...args) => event.run(...args));
            } else {
                client.on(event.type, (...args) => event.run(...args));
            }
        }
    }
}