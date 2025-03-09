import {
    ButtonInteraction,
    StringSelectMenuInteraction,
    ModalSubmitInteraction,
    UserSelectMenuInteraction,
    RoleSelectMenuInteraction,
    ComponentType,
} from "discord.js";
import { ComponentHandler } from "./ComponentHandler.ts";

export type ComponentInteraction<T extends ComponentType> =
    T extends ComponentType.Button ? ButtonInteraction :
    T extends ComponentType.StringSelect ? StringSelectMenuInteraction :
    T extends ComponentType.UserSelect ? UserSelectMenuInteraction :
    T extends ComponentType.RoleSelect ? RoleSelectMenuInteraction :
    T extends ComponentType.TextInput ? ModalSubmitInteraction :
    never;

export class Component<T extends ComponentType> {
    public customIdPattern: string;
    public type: T;
    public run: (interaction: ComponentInteraction<T>, params: Record<string, string>) => void | Promise<void>;

    constructor({
        customId,
        type,
        run,
    }: {
        customId: string;
        type: T;
        run: (interaction: ComponentInteraction<T>, params: Record<string, string>) => void | Promise<void>;
    }) {
        this.customIdPattern = customId;
        this.type = type;
        this.run = run;

        ComponentHandler.registerComponent(this);
    }

    public match(customId: string): Record<string, string> | null {
        const patternParts = this.customIdPattern.split("/");
        const customIdParts = customId.split("/");

        if (patternParts.length !== customIdParts.length) {
            return null;
        }

        const params: Record<string, string> = {};
        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const customIdPart = customIdParts[i];

            if (patternPart.startsWith(":")) {
                const paramName = patternPart.slice(1);
                params[paramName] = customIdPart;
            } else if (patternPart !== customIdPart) {
                return null;
            }
        }

        return params;
    }
}
