import { describe, it, expect } from "vitest";
import { SubmitAnswerSchema } from "./answer";

describe("SubmitAnswerSchema", () => {
  it("accepts valid input", () => {
    const result = SubmitAnswerSchema.safeParse({
      sessionId: 1,
      questionOrder: 0,
      answerIndex: 2,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative sessionId", () => {
    const result = SubmitAnswerSchema.safeParse({
      sessionId: -1,
      questionOrder: 0,
      answerIndex: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects answerIndex > 3", () => {
    const result = SubmitAnswerSchema.safeParse({
      sessionId: 1,
      questionOrder: 0,
      answerIndex: 4,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = SubmitAnswerSchema.safeParse({ sessionId: 1 });
    expect(result.success).toBe(false);
  });

  it("rejects float sessionId", () => {
    const result = SubmitAnswerSchema.safeParse({
      sessionId: 1.5,
      questionOrder: 0,
      answerIndex: 0,
    });
    expect(result.success).toBe(false);
  });
});
