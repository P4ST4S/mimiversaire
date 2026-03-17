import { z } from "zod";

export const SubmitAnswerSchema = z.object({
  sessionId: z.number().int().positive(),
  questionOrder: z.number().int().min(0),
  answerIndex: z.number().int().min(0).max(3),
});

export const InitSessionSchema = z.object({
  metadata: z.record(z.string(), z.string()).optional(),
});

export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;
