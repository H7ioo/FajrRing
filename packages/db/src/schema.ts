// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fajr-ring_${name}`);

export const user = createTable("user", (t) => ({
  id: t.text("id").primaryKey(),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t.boolean("email_verified").notNull(),
  image: t.text("image"),
  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: t
    .timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date()),

  // Phone number plugin
  phoneNumber: t.text("phone_number").unique(),
  phoneNumberVerified: t.boolean("phone_number_verified"),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  preferences: one(preference, {
    fields: [user.id],
    references: [preference.userId],
  }),
  callLogs: many(callLog),
}));

export const session = createTable(
  "session",
  (t) => ({
    id: t.text("id").primaryKey(),
    expiresAt: t.timestamp("expires_at").notNull(),
    token: t.text("token").notNull().unique(),
    createdAt: t
      .timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: t
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
    ipAddress: t.text("ip_address"),
    userAgent: t.text("user_agent"),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)]
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const account = createTable(
  "account",
  (t) => ({
    id: t.text("id").primaryKey(),
    accountId: t.text("account_id").notNull(),
    providerId: t.text("provider_id").notNull(),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: t.text("access_token"),
    refreshToken: t.text("refresh_token"),
    idToken: t.text("id_token"),
    accessTokenExpiresAt: t.timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at"),
    scope: t.text("scope"),
    password: t.text("password"),
    createdAt: t
      .timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: t
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("account_user_id_idx").on(t.userId)]
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const verification = createTable("verification", (t) => ({
  id: t.text("id").primaryKey(),
  identifier: t.text("identifier").notNull(),
  value: t.text("value").notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: t
    .timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const preference = createTable("preference", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(), // One user can only have one preference

  // Location Data (Select input) - displayName
  location: t.text("location"),

  // Google Places API settings
  placeId: t.text("place_id"),
  formattedAddress: t.text("formatted_address"),
  city: t.text("city"),
  country: t.text("country"),

  // Coordinates
  latitude: t.doublePrecision("latitude"),
  longitude: t.doublePrecision("longitude"),

  // Google Timezone
  timezoneId: t.text("timezone"), // Europe/Berlin
  timezoneName: t.text("timezone_name"),
  rawOffset: t.integer("raw_offset"),
  dstOffset: t.integer("dst_offset"),

  // Aladhan Calculation Method
  calculationMethodId: t.text("calculation_method_id"),

  // Call Timing
  fajrOffsetMinutes: t.integer("fajr_offset_minutes").default(0),

  // TODO: Not relevant anymore. Deprecated
  // Call Scheduling & Status
  nextCallTimeUtc: t.timestamp("next_call_time", {
    mode: "date",
    withTimezone: true,
  }),

  // Is Active
  callsEnabled: t.boolean("calls_enabled").notNull().default(true),

  createdAt: t
    .timestamp("created_at", { withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: t
    .timestamp("updated_at", { withTimezone: true, mode: "date" })
    .$onUpdate(() => new Date()),
}));

export const preferenceRelations = relations(preference, ({ one }) => ({
  user: one(user, {
    fields: [preference.userId],
    references: [user.id],
  }),
}));

export const callStatusEnum = pgEnum("status", [
  "PENDING", // The call is scheduled but not yet attempted. (handled by worker)
  "INITIATED", // The call process has started (handled by calling service)
  "ANSWERED", // The call has been answered (handled by calling service)
  "COMPLETED", // Successfully played message (handled by calling service)
  "NO_ANSWER", // No one picked up the call (handled by calling service)
  "FAILED", // Calling error or other failure (handled by any)
  "RETRY_SCHEDULED", // The call has failed and a retry is scheduled (handled by worker)
]);

export const callLog = createTable(
  "call_log",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    jobId: t.text("job_id").notNull(), // Or parentJobId. This is for grouping
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    initiatedTimeUtc: t.timestamp("initiated_time_utc", {
      mode: "date",
      withTimezone: true,
    }),
    scheduledTimeUtc: t
      .timestamp("scheduled_time_utc", { mode: "date", withTimezone: true })
      .notNull(),
    callSid: t.text("call_sid").unique(),
    status: callStatusEnum().default("PENDING").notNull(),
    attemptNumber: t.integer("attempt_number").default(1).notNull(),
    callDuration: t.integer("call_duration"),
    errorMessage: t.text("error_message"),
    createdAt: t
      .timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: t
      .timestamp("updated_at", { mode: "date", withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("call_log_job_id_idx").on(t.jobId),
    index("call_log_user_id_idx").on(t.userId),
    index("call_log_status_idx").on(t.status),
    index("call_log_scheduled_time_utc_idx").on(t.scheduledTimeUtc),
  ]
);

export const callLogRelations = relations(callLog, ({ one }) => ({
  user: one(user, {
    fields: [callLog.userId],
    references: [user.id],
  }),
}));
