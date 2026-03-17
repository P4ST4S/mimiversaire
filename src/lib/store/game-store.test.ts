import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "./game-store";

// Reset store state before each test
beforeEach(() => {
  useGameStore.getState().resetGame();
});

describe("game-store", () => {
  it("initSession sets sessionId and totalQuestions", () => {
    useGameStore.getState().initSession(42, 3);
    const state = useGameStore.getState();
    expect(state.sessionId).toBe(42);
    expect(state.totalQuestions).toBe(3);
    expect(state.score).toBe(0);
    expect(state.questionIndex).toBe(0);
    expect(state.isGameOver).toBe(false);
  });

  it("recordAnswer increments score on correct answer", () => {
    useGameStore.getState().initSession(1, 3);
    useGameStore.getState().recordAnswer(true);
    expect(useGameStore.getState().score).toBe(1);
    expect(useGameStore.getState().lastAnswerResult).toBe("correct");
  });

  it("recordAnswer does not increment score on wrong answer", () => {
    useGameStore.getState().initSession(1, 3);
    useGameStore.getState().recordAnswer(false);
    expect(useGameStore.getState().score).toBe(0);
    expect(useGameStore.getState().lastAnswerResult).toBe("wrong");
  });

  it("advanceQuestion increments questionIndex and resets result", () => {
    useGameStore.getState().initSession(1, 3);
    useGameStore.getState().recordAnswer(true);
    useGameStore.getState().advanceQuestion();
    const state = useGameStore.getState();
    expect(state.questionIndex).toBe(1);
    expect(state.lastAnswerResult).toBeNull();
  });

  it("endGame sets isGameOver to true", () => {
    useGameStore.getState().initSession(1, 3);
    useGameStore.getState().endGame();
    expect(useGameStore.getState().isGameOver).toBe(true);
  });

  it("resetGame returns to initial state", () => {
    useGameStore.getState().initSession(1, 3);
    useGameStore.getState().recordAnswer(true);
    useGameStore.getState().endGame();
    useGameStore.getState().resetGame();
    const state = useGameStore.getState();
    expect(state.sessionId).toBeNull();
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
  });
});
