import { db } from "@database";
import { User } from "discord.js";

type CooldownType = "daily" | "weekly" | "monthly";

async function checkCooldown(user: User, type: string): Promise<{ canClaim: boolean; nextClaimTime: Date }> {
	const userData = await db.users.get(user);

	const lastClaimed = (userData.cooldowns?.rewards?.[type as CooldownType] as Date) ||
		new Date(0);
	const now = new Date();

	const cooldownDuration = getCooldownDuration(type);
	const nextClaimTime = new Date(
		lastClaimed.getTime() +
			cooldownDuration,
	);

	return {
		canClaim: now.getTime() >=
			nextClaimTime.getTime(),
		nextClaimTime,
	};
}

function getCooldownDuration(type: string): number {
	switch (type) {
		case "daily":
			return 24 *
				60 *
				60 *
				1000;
		case "weekly":
			return 7 *
				24 *
				60 *
				60 *
				1000;
		case "monthly":
			return 30 *
				24 *
				60 *
				60 *
				1000;
		default:
			return 0;
	}
}

function calculatePamonhas(type: string): number {
	const rewardRanges: Record<
		string,
		number
	> = {
		daily: 100,
		weekly: 500,
		monthly: 1000,
	};
	const max = rewardRanges[type] ||
		0;
	return max >
			0
		? Math.floor(
			Math.random() *
				max,
		)
		: 0;
}

async function updateUserRewards(user: User, type: string, pamonhas: number): Promise<void> {
	const updateData = {
		balance: (await db.users.get(user)).balance +
			pamonhas,
		[`cooldowns.rewards.${type}`]: new Date(),
	};
	await db.users.update(
		user,
		updateData,
	);
}

export { calculatePamonhas, checkCooldown, updateUserRewards };
