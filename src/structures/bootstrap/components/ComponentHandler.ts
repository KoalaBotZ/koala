import { CacheType, Client, ComponentType, Interaction } from "discord.js";
import { Component, ComponentInteraction } from "./Component.ts";
import consola from "consola";
import ck from "chalk";
import { load } from "../utils.ts";

export class ComponentHandler {
	public static components: Array<Component<ComponentType | ComponentType[], string, CacheType>> = [];

	public static registerComponent<
		T extends ComponentType | ComponentType[],
		TPattern extends string,
		C extends CacheType,
	>(component: Component<T, TPattern, C>): void {
		this.components.push(component as unknown as Component<ComponentType | ComponentType[], string, CacheType>);
		consola.success(ck.greenBright(`{>} Component ${component.customIdPattern} registered successfully.`));
	}

	public static async loadComponents(client: Client): Promise<void> {
		await load();
		client.on("interactionCreate", async (interaction) => {
			if (!("customId" in interaction)) return;

			for (const component of this.components) {
				if (!this.isInteractionAllowed(interaction, component.type)) continue;

				const params = component.match(interaction.customId);
				if (params) {
					try {
						const cacheType = this.getInteractionCacheType(interaction);

						await component.run(
							interaction as ComponentInteraction<typeof component.type, typeof cacheType>,
							params,
						);
					} catch (error) {
						consola.error(`Error executing component "${interaction.customId}":`, error);
						if (interaction.isRepliable()) {
							await interaction.reply({
								flags: ["Ephemeral"],
								content: "There was an error executing this component.",
							});
						}
					}
					return;
				}
			}
		});
	}

	private static isInteractionAllowed(interaction: Interaction, type: ComponentType | ComponentType[]): boolean {
		const types = Array.isArray(type) ? type : [type];
		return types.some((t) => {
			switch (t) {
				case ComponentType.Button:
					return interaction.isButton();
				case ComponentType.StringSelect:
					return interaction.isStringSelectMenu();
				case ComponentType.UserSelect:
					return interaction.isUserSelectMenu();
				case ComponentType.RoleSelect:
					return interaction.isRoleSelectMenu();
				case ComponentType.TextInput:
					return interaction.isModalSubmit();
				default:
					return false;
			}
		});
	}

	private static getInteractionCacheType(interaction: Interaction): CacheType {
		if (interaction.isMessageComponent() && interaction.message.partial) {
			return "raw";
		}
		return "cached";
	}
}
