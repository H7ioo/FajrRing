import { z } from "zod";

export const twilioStatusBodySchema = z
  .object({
    // --- Core Call Identifiers (Always Present) ---
    CallSid: z.string().startsWith("CA"),
    AccountSid: z.string().startsWith("AC"),
    ApiVersion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    Timestamp: z.string(), // RFC 2822 timestamp

    // --- Call Parties (Always Present) ---
    From: z.string(),
    To: z.string(),

    // --- Call Status & Direction (Always Present) ---
    CallStatus: z.enum([
      // The call is in a queue, waiting to be initiated.
      "queued",
      // The call has been removed from the queue and Twilio has started dialing.
      "initiated",
      // The destination has started ringing.
      "ringing",
      // The call was answered and is ongoing. Fired by the 'answered' event.
      "in-progress",
      // The call has ended, for any reason.
      "completed",
      // The called party was busy.
      "busy",
      // The call could not be connected (e.g., invalid number, carrier error).
      "failed",
      // The call was not answered before the timeout.
      "no-answer",
      // The call was canceled via the API before being answered.
      "canceled",
    ]),
    Direction: z.enum(["inbound", "outbound-api", "outbound-dial"]),

    // --- Event-Specific Information (Always Present in Status Callbacks) ---
    CallbackSource: z.literal("call-progress-events"),
    SequenceNumber: z.coerce.number().int().nonnegative(),

    // --- Optional/Conditional Parameters ---

    // Duration fields are only present on 'completed' events
    Duration: z.string().optional(), // Billed minutes
    CallDuration: z.string().optional(), // Duration in seconds

    // Recording fields are only present on 'completed' events if recording was enabled
    RecordingUrl: z.string().url().optional(),
    RecordingSid: z.string().startsWith("RE").optional(),
    RecordingDuration: z.string().optional(),

    // SIP code is present on call completion
    SipResponseCode: z.string().optional(),

    // These are less common and depend on specific call scenarios
    ForwardedFrom: z.string().optional(),
    CallerName: z.string().optional(),
    ParentCallSid: z.string().startsWith("CA").optional(),
  })
  // Use .passthrough() to allow any other fields Twilio might send
  // without causing a validation error. This is a good defensive practice.
  .passthrough();

export const twilioStatusQuerySchema = z.object({
  jobId: z.string().min(1),
  userId: z.string().min(1),
  initiatedTimeUtc: z.string().datetime(),
  scheduledTimeUtc: z.string().datetime(),
  attemptsMade: z.coerce.number().int().nonnegative(),
});

export type TwilioStatusBody = z.infer<typeof twilioStatusBodySchema>;
export type TwilioStatusQuery = z.infer<typeof twilioStatusQuerySchema>;
