"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AnswerResult = "correct" | "wrong" | null;

export interface GameState {
  sessionId: number | null;
  score: number;
  questionIndex: number;
  totalQuestions: number;
  lastAnswerResult: AnswerResult;
  isGameOver: boolean;
  timerStartedAt: number | null;
}

export interface GameActions {
  initSession: (sessionId: number, total: number) => void;
  recordAnswer: (isCorrect: boolean) => void;
  advanceQuestion: () => void;
  endGame: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  sessionId: null,
  score: 0,
  questionIndex: 0,
  totalQuestions: 3,
  lastAnswerResult: null,
  isGameOver: false,
  timerStartedAt: null,
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialState,

      initSession: (sessionId, total) =>
        set({
          ...initialState,
          sessionId,
          totalQuestions: total,
          timerStartedAt: Date.now(),
        }),

      recordAnswer: (isCorrect) =>
        set((state) => ({
          score: isCorrect ? state.score + 1 : state.score,
          lastAnswerResult: isCorrect ? "correct" : "wrong",
        })),

      advanceQuestion: () =>
        set((state) => ({
          questionIndex: state.questionIndex + 1,
          lastAnswerResult: null,
          timerStartedAt: Date.now(),
        })),

      endGame: () => set({ isGameOver: true }),

      resetGame: () => set(initialState),
    }),
    {
      name: "mimiversaire-game",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        score: state.score,
        questionIndex: state.questionIndex,
        totalQuestions: state.totalQuestions,
        lastAnswerResult: state.lastAnswerResult,
        isGameOver: state.isGameOver,
        timerStartedAt: state.timerStartedAt,
      }),
    }
  )
);
