import { config } from "dotenv";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, "../.env") });

config({ path: join(process.cwd(), ".env") });

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
});
