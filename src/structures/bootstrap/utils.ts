import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts";
import consola from "consola";

export async function load() {
	const path = join(Deno.cwd(), "src", "koala");

	if (!(await exists(path))) {
		consola.warn(`The directory "${path}" does not exist.`);
		return;
	}

	for await (const entry of walk(path, { exts: [".ts", ".js"] })) {
		const filePath = entry.path;
		const absolutePath = `file://${filePath.replace(/\\/g, "/")}`;

		try {
			await import(absolutePath);
		} catch (error) {
			consola.error(
				`Error loading file "${filePath}":`,
				error,
			);
		}
	}
}
