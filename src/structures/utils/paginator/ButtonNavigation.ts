import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { NavigationComponent } from "./NavigationComponent.ts";
import { createRow } from "@magicyan/discord";

export class ButtonNavigation implements NavigationComponent {
	private currentPage: number = 0;
	private totalPages: number;

	constructor(
		totalPages: number,
	) {
		this.totalPages = totalPages;
	}

	public create(): ActionRowBuilder<ButtonBuilder> {
		return createRow(
			new ButtonBuilder({
				customId: "first",
				emoji: "⏮️",
				style: ButtonStyle.Primary,
				disabled: this.currentPage ===
					0,
			}),
			new ButtonBuilder({
				customId: "previous",
				emoji: "◀️",
				style: ButtonStyle.Primary,
				disabled: this.currentPage ===
					0,
			}),
			new ButtonBuilder({
				customId: "next",
				emoji: "▶️",
				style: ButtonStyle.Primary,
				disabled: this.currentPage ===
					this.totalPages -
						1,
			}),
			new ButtonBuilder({
				customId: "last",
				emoji: "⏭️",
				style: ButtonStyle.Primary,
				disabled: this.currentPage ===
					this.totalPages -
						1,
			}),
		);
	}

	public update(
		currentPage: number,
	): void {
		this.currentPage = currentPage;
	}
}
