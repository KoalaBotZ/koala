import { Interaction, User, EmbedBuilder, ComponentType } from "discord.js";
import { ButtonNavigation } from "./ButtonNavigation.ts";
import { SelectMenuNavigation } from "./SelectMenuNavigation.ts";
import { NavigationComponent } from "./NavigationComponent.ts";
import consola from "consola";

interface PaginationOptions {
    from: Interaction;
    expires?: number;
    filter: (user: User) => boolean;
    pages: EmbedBuilder[];
    useSelectMenu?: boolean;
}

export class Pagination {
    private interaction: Interaction;
    private expires: number;
    private filter: (user: User) => boolean;
    private pages: EmbedBuilder[];
    private navigation: NavigationComponent;
    private currentPage: number = 0;

    constructor(options: PaginationOptions) {
        this.interaction = options.from;
        this.expires = options.expires || 60_000;
        this.filter = options.filter;
        this.pages = options.pages;

        this.navigation = options.useSelectMenu
            ? new SelectMenuNavigation(this.pages.length)
            : new ButtonNavigation(this.pages.length);

        Promise.resolve(this.start()).catch(consola.error);
    }

    private async start(): Promise<void> {
        if (!this.interaction.isRepliable()) {
            throw new Error("A interação não pode ser respondida.");
        }

        const response = (await this.interaction.reply({
            withResponse: true,
            embeds: [this.pages[this.currentPage]],
            components: [this.navigation.create()],
        }));

        const collector = response.resource?.message?.createMessageComponentCollector({
            componentType: this.navigation instanceof SelectMenuNavigation
                ? ComponentType.StringSelect
                : ComponentType.Button,
            time: this.expires,
            filter: (interaction) => this.filter(interaction.user),
        });

        collector?.on("collect", async (interaction) => {
            if (this.navigation instanceof SelectMenuNavigation && interaction.isStringSelectMenu()) {
                this.currentPage = parseInt(interaction.values[0], 10);
            } else if (interaction.isButton()) {
                switch (interaction.customId) {
                    case "first":
                        this.currentPage = 0;
                        break;
                    case "previous":
                        this.currentPage = Math.max(0, this.currentPage - 1);
                        break;
                    case "next":
                        this.currentPage = Math.min(this.pages.length - 1, this.currentPage + 1);
                        break;
                    case "last":
                        this.currentPage = this.pages.length - 1;
                        break;
                }
            }

            this.navigation.update(this.currentPage, this.pages.length);

            await interaction.update({
                embeds: [this.pages[this.currentPage]],
                components: [this.navigation.create()],
            });
        });

        collector?.on("end", () => {
            response.resource?.message?.edit({ components: [] }).catch(console.error);
        });
    }
}