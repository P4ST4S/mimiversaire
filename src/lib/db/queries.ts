import { asc, eq, count } from "drizzle-orm";
import { db } from "./client";
import { questions, gameSessions } from "./schema";

export type Question = typeof questions.$inferSelect;
export type GameSession = typeof gameSessions.$inferSelect;

export async function getAllQuestions(): Promise<Question[]> {
  return db.select().from(questions).orderBy(asc(questions.order));
}

export async function getQuestionByOrder(
  order: number
): Promise<Question | undefined> {
  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.order, order))
    .limit(1);
  return question;
}

export async function countQuestions(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(questions);
  return result?.count ?? 0;
}

export async function createSession(): Promise<number> {
  const [session] = await db
    .insert(gameSessions)
    .values({ score: 0, currentQuestion: 0 })
    .returning({ id: gameSessions.id });
  if (!session) throw new Error("Failed to create session");
  return session.id;
}

export async function updateSession(
  id: number,
  score: number,
  currentQuestion: number
): Promise<void> {
  await db
    .update(gameSessions)
    .set({ score, currentQuestion })
    .where(eq(gameSessions.id, id));
}

export async function getSession(
  id: number
): Promise<GameSession | undefined> {
  const [session] = await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.id, id))
    .limit(1);
  return session;
}
