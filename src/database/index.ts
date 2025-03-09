import mongoose, { model } from "mongoose";
import { EnvManager } from "@settings";
import consola from "consola";
import chalk from "chalk";
import { userSchema } from "./schemas/user.ts";

export abstract class Database {
    public static async connect(): Promise<void> {
        try {
            const envManager = EnvManager.getInstance();
            await mongoose.connect(envManager.get("MONGO_URI"), { dbName: "database" });
            consola.success(chalk.greenBright("Connected to the MongoDB."));
        } catch (error) {
            consola.error("Error connecting to the database:", error);
        }
    }
}

class DatabtaseModels extends Database {
    public readonly users = model("users", userSchema);
}

export const db = new DatabtaseModels();
