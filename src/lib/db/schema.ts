import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export type QuestionOption = {
  label: string;
  text: string;
};

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  options: jsonb("options").$type<QuestionOption[]>().notNull(),
  correctIndex: integer("correct_index").notNull(),
  clipUrl: text("clip_url"),
  roastText: text("roast_text"),
  order: integer("order").notNull().default(0),
});

export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  score: integer("score").notNull().default(0),
  currentQuestion: integer("current_question").notNull().default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
});
