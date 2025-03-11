import { Schema } from "mongoose";
import { Locale } from "discord.js";

export const userSchema = new Schema(
	{
		id: { type: String, required: true },
		locale: { type: String, default: Locale.PortugueseBR },
		balance: { type: Number, default: 0 },
		cooldowns: {
			rewards: {
				daily: { type: Date, default: new Date(0) },
				weekly: { type: Date, default: new Date(0) },
				monthly: { type: Date, default: new Date(0) },
			},
		},
	},
	{
		statics: {
			async get(user: { id: string }) {
				const query = { id: user.id };
				return await this.findOne(query) ??
					this.create(query);
			},

			async update(user: { id: string }, data: {
				locale?: string;
				balance?: number;
			}) {
				const query = {
					id: user.id,
				};
				return await this.findOneAndUpdate(
					query,
					data,
					{
						upsert: true,
						new: true,
					},
				);
			},
		},
	},
);
