import { validateRequest } from "#call";
import { createMiddleware } from "hono/factory";

/**
 * Configuration options for the Twilio authentication middleware.
 */
type TwilioAuthOptions = {
  /**
   * A function that returns your Twilio Auth Token.
   * e.g., () => process.env.TWILIO_AUTH_TOKEN
   */
  authToken: () => string;

  /**
   * A function that returns the public base URL of your webhook.
   * This is crucial for environments behind a proxy or ngrok.
   * e.g., () => process.env.TWILIO_WEBHOOK_BASE_URL
   */
  baseUrl: () => string;
};

/**
 * Hono middleware to validate that an incoming request is genuinely from Twilio
 * by checking the X-Twilio-Signature header.
 *
 * @param {TwilioAuthOptions} options - Configuration for the middleware.
 * @returns A Hono middleware handler.
 */
export const twilioAuth = (options: TwilioAuthOptions) => {
  return createMiddleware(async (c, next) => {
    const signature = c.req.header("x-twilio-signature");
    if (!signature) {
      return c.text("FORBIDDEN", 403);
    }

    const baseUrl = options.baseUrl();

    // 2. Get the path and query string from the incoming request.
    const path = c.req.path; // e.g., "/twilio/status"
    const search = new URL(c.req.url).search; // e.g., "?jobId=123&..."

    // 3. Combine them to form the full, public URL that Twilio called.
    const validationUrl = `${baseUrl}${path}${search}`;
    const data = await c.req.parseBody();

    const token = options.authToken();

    const isValid = validateRequest(token, signature, validationUrl, data);

    if (!isValid) {
      return c.text("UNAUTHORIZED", 401);
    }

    // Signature is valid, proceed to the next middleware or handler.
    await next();
  });
};
