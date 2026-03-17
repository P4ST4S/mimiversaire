"use server";

import { SubmitAnswerSchema, InitSessionSchema } from "@/lib/validators/answer";
import {
  createSession,
  updateSession,
  getQuestionByOrder,
  getSession,
  countQuestions,
} from "@/lib/db/queries";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function initGameSession(
  input: unknown
): Promise<ActionResult<{ sessionId: number; totalQuestions: number }>> {
  const parsed = InitSessionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }
  const [sessionId, total] = await Promise.all([
    createSession(),
    countQuestions(),
  ]);
  return { success: true, data: { sessionId, totalQuestions: total } };
}

export async function submitAnswer(input: unknown): Promise<
  ActionResult<{
    isCorrect: boolean;
    correctIndex: number | null;
    correctAnswer: string | null;
    clipUrl: string | null;
    roastText: string | null;
  }>
> {
  const parsed = SubmitAnswerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const { sessionId, questionOrder, answerIndex, answerText } = parsed.data;

  const [question, session] = await Promise.all([
    getQuestionByOrder(questionOrder),
    getSession(sessionId),
  ]);

  if (!question) return { success: false, error: "Question not found" };
  if (!session) return { success: false, error: "Session not found" };

  let isCorrect: boolean;
  if (question.questionType === "plain_text") {
    const expected = (question.correctAnswer ?? "").toLowerCase().trim();
    const given = (answerText ?? "").toLowerCase().trim();
    isCorrect = question.acceptPartial
      ? given.includes(expected) || expected.includes(given)
      : given === expected;
  } else {
    isCorrect = answerIndex === question.correctIndex;
  }

  const newScore = session.score + (isCorrect ? 1 : 0);
  await updateSession(sessionId, newScore, questionOrder + 1);

  return {
    success: true,
    data: {
      isCorrect,
      correctIndex: question.correctIndex ?? null,
      correctAnswer: question.correctAnswer ?? null,
      clipUrl: question.clipUrl ?? null,
      roastText: question.roastText ?? null,
    },
  };
}
