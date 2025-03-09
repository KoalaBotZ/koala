import { z } from "zod";
import consola from "consola";

const envSchema = z.object({
    DISCORD_TOKEN: z.string().min(1, "Token must not be empty"),
    MONGO_URI: z.string().min(1, "Mongo URI must not be empty"),
    WEBHOOK_URL: z.string().min(1, "Webhook URL must not be empty"),
});

type EnvKeys = keyof z.infer<typeof envSchema>;

export class EnvManager {
    private static instance: EnvManager;
    private env: Record<string, string>;

    private constructor() {
        this.env = {};
    }

    public static initialize(): void {
        if (!EnvManager.instance) {
            EnvManager.instance = new EnvManager();
            EnvManager.instance.loadAndValidateEnv();
        }
    }

    public static getInstance(): EnvManager {
        if (!EnvManager.instance) {
            throw new Error("EnvManager has not been initialized. Call 'initialize' first.");
        }
        return EnvManager.instance;
    }

    private loadAndValidateEnv(): void {
        const rawEnv = Deno.env.toObject();

        try {
            this.env = envSchema.parse(rawEnv);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));

                consola.error("Validation errors in environment variables:");
                console.table(formattedErrors);

                throw new Error("Invalid environment variables. Check the logs above for details");
            } else {
                consola.error("An unexpected error occurred while loading environment variables:", error);
                throw error;
            }
        }
    }

    public get<T = string>(key: EnvKeys): T {
        return this.env[key] as T;
    }

    public has(key: EnvKeys): boolean {
        return key in this.env;
    }
}
