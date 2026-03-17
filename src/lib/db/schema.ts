import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export type QuestionOption = {
  label: string;
  text: string;
};

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionType: text("question_type").notNull().default("qcm"),
  text: text("text").notNull(),
  // qcm only
  options: jsonb("options").$type<QuestionOption[]>(),
  correctIndex: integer("correct_index"),
  // plain_text only
  correctAnswer: text("correct_answer"),
  acceptPartial: boolean("accept_partial").notNull().default(false),
  // common
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
