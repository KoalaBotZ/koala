import { Locale } from "discord.js";
import { translate } from "./translater.ts";

export function getLocalizations(key: string): Record<string, string> {
	const localizations: Record<string, string> = {};

	const supportedLocales: string[] = [
		Locale.SpanishES,
		Locale.EnglishUS,
		Locale.PortugueseBR,
	];

	for (const locale of Object.values(Locale)) {
		try {
			const isSupported = supportedLocales.includes(locale);

			const targetLocale = isSupported ? locale : Locale.PortugueseBR;

			let t = translate({
				locale: targetLocale,
				key: key,
			});

			if (!t || t.length < 1 || t.length > 100) {
				console.warn(
					`Invalid translation length for locale "${locale}" and key "${key}": Length must be between 1 and 100.`,
				);
				t = "Default";
			}

			localizations[locale] = t;
		} catch (error) {
			console.warn(
				`Translation not found for locale "${locale}" and key "${key}":`,
				error,
			);
			localizations[locale] = "Default";
		}
	}

	return localizations;
}
