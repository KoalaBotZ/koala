const module = await import("../../common/json/settings.json", {
	with: {
		type: "json",
	},
});

export const settings = {
	emoji: module.default.emojis,
	colors: module.default.colors,
};
