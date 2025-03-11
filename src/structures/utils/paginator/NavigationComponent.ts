import { ActionRowBuilder } from "discord.js";

export interface NavigationComponent {
	// deno-lint-ignore no-explicit-any
	create(): ActionRowBuilder<any>;
	update(
		currentPage: number,
		totalPages: number,
	): void;
}
