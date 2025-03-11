// deno-lint-ignore-file
import { parse } from "jsr:@std/yaml";
import { Locale } from "discord.js";

interface LocaleOptions {
	locale:
		| string
		| Locale.PortugueseBR;
	key: string;
	options?: Record<
		string,
		string
	>;
}

const loadLocales = (): Record<string, any> => {
	const fileContent = Deno.readTextFileSync("./common/locale/locales.yml");
	return parse(fileContent) as Record<
		string,
		any
	>;
};

let localesCache: Record<string, any> | null = null;

export function translate({ locale, key, options }: LocaleOptions): string {
	if (!localesCache) {
		try {
			localesCache = loadLocales();
		} catch (error) {
			console.error(
				"Failed to load locales:",
				error,
			);
			throw new Error("Failed to load locales");
		}
	}

	const keys = key.split(".");

	let translation: any = localesCache;
	for (
		const part of keys
	) {
		if (
			translation &&
			typeof translation ===
				"object" &&
			part in
				translation
		) {
			translation = translation[part];
		} else {
			return `Translation for locale "${locale}" not found in key "${key}"`;
		}
	}

	if (
		!(locale in
			translation)
	) {
		return `Translation for locale "${locale}" not found in key "${key}"`;
	}

	let result = translation[locale];

	if (options) {
		for (
			const [
				placeholder,
				value,
			] of Object.entries(options)
		) {
			result = result.replace(
				new RegExp(
					`{{${placeholder}}}`,
					"g",
				),
				value,
			);
		}
	}

	return result;
}
