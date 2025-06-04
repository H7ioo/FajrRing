import { config } from "dotenv";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the queue package directory
config({ path: join(__dirname, "../.env") });

// Than load app .env as fallback
config({ path: join(process.cwd(), ".env") });

export const env = createEnv({
  server: {
    REDIS_DATABASE_URL: z.string().url(),
  },
  runtimeEnvStrict: {
    REDIS_DATABASE_URL: process.env.REDIS_DATABASE_URL,
  },
  emptyStringAsUndefined: true,
});
