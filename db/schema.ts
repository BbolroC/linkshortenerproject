import { pgTable, integer, text, varchar, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const links = pgTable(
  "links",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").notNull(),
    shortCode: varchar("short_code", { length: 20 }).notNull(),
    originalUrl: text("original_url").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    shortCodeIdx: uniqueIndex("short_code_idx").on(table.shortCode),
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

export type Link = InferSelectModel<typeof links>;
export type NewLink = InferInsertModel<typeof links>;
