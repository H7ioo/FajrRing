CREATE TYPE "public"."status" AS ENUM('PENDING', 'INITIATED', 'RINGING', 'ANSWERED', 'COMPLETED', 'NO_ANSWER', 'BUSY', 'FAILED', 'RETRY_SCHEDULED');--> statement-breakpoint
CREATE TABLE "fajr-ring_call_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"scheduled_time_utc" timestamp with time zone NOT NULL,
	"initiated_time_utc" timestamp with time zone,
	"twilio_call_sid" text,
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"attempt_number" integer DEFAULT 1 NOT NULL,
	"retry_scheduled_time_utc" timestamp with time zone,
	"duration_seconds" integer,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "fajr-ring_call_log_twilio_call_sid_unique" UNIQUE("twilio_call_sid")
);
--> statement-breakpoint
CREATE TABLE "fajr-ring_preference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"timezone" text,
	"prayer_method_id" text,
	"fajr_offset_minutes" integer DEFAULT 0,
	"next_call_time" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "fajr-ring_call_log" ADD CONSTRAINT "fajr-ring_call_log_user_id_fajr-ring_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fajr-ring_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fajr-ring_preference" ADD CONSTRAINT "fajr-ring_preference_user_id_fajr-ring_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fajr-ring_user"("id") ON DELETE cascade ON UPDATE no action;