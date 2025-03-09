import { ActionRowBuilder, StringSelectMenuBuilder, } from "discord.js";
import { NavigationComponent } from "./NavigationComponent.ts";
import { createRow } from "@magicyan/discord";

export class SelectMenuNavigation implements NavigationComponent {
    private currentPage: number = 0;
    private totalPages: number;

    constructor(totalPages: number) {
        this.totalPages = totalPages;
    }

    public create(): ActionRowBuilder<StringSelectMenuBuilder> {
        return createRow(
            new StringSelectMenuBuilder({
                customId: "select-page",
                options: Array.from({ length: this.totalPages }, (_, index) => ({
                    label: `✔ ${index + 1}`,
                    value: index.toString(),
                    default: index === this.currentPage,
                })),
            })
        );
    }

    public update(currentPage: number): void {
        this.currentPage = currentPage;
    }
}