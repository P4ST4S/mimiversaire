"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/game-store";
import { submitAnswer } from "@/lib/actions/game";
import type { AnswerState } from "@/components/AnswerButton";
import QuestionCard from "@/components/QuestionCard";
import ClipPlayer from "@/components/ClipPlayer";
import RoastDisplay from "@/components/RoastDisplay";
import ScoreBoard from "@/components/ScoreBoard";
import type { Question } from "@/lib/db/queries";

type FeedbackState =
  | { type: "idle" }
  | { type: "correct"; clipUrl: string }
  | { type: "wrong"; roastText: string; correctAnswer: string };

export default function QuizContent() {
  const router = useRouter();
  const {
    sessionId,
    score,
    questionIndex,
    totalQuestions,
    isGameOver,
    recordAnswer,
    advanceQuestion,
    endGame,
  } = useGameStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>([
    "idle",
    "idle",
    "idle",
    "idle",
  ]);
  const [isLocked, setIsLocked] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "idle" });

  // Redirect to home if no session
  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }
  }, [sessionId, router]);

  // Fetch all questions once
  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json() as Promise<{ questions: Question[] }>)
      .then(({ questions: qs }) => {
        setQuestions(qs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Reset answer states when question changes
  useEffect(() => {
    setAnswerStates(["idle", "idle", "idle", "idle"]);
    setIsLocked(false);
    setFeedback({ type: "idle" });
  }, [questionIndex]);

  const handleAnswer = useCallback(
    async (index: number) => {
      if (isLocked || !sessionId) return;
      setIsLocked(true);

      const result = await submitAnswer({
        sessionId,
        questionOrder: questionIndex + 1,
        answerIndex: index,
      });

      if (!result.success) return;

      const { isCorrect, correctIndex, clipUrl, roastText } = result.data;

      // Update answer button states
      const newStates: AnswerState[] = ["idle", "idle", "idle", "idle"];
      if (isCorrect) {
        for (let i = 0; i < 4; i++) {
          newStates[i] = i === correctIndex ? "correct" : "reveal";
        }
      } else {
        newStates[index] = "wrong";
      }
      setAnswerStates(newStates);

      recordAnswer(isCorrect);

      setTimeout(() => {
        const currentQuestion = questions[questionIndex];
        if (isCorrect && clipUrl) {
          setFeedback({ type: "correct", clipUrl });
        } else {
          const correctOption = currentQuestion?.options?.[correctIndex ?? -1] as
            | { text: string }
            | undefined;
          setFeedback({
            type: "wrong",
            roastText: roastText ?? "Mauvaise réponse !",
            correctAnswer: correctOption?.text ?? "",
          });
        }
      }, 800);
    },
    [isLocked, sessionId, questionIndex, recordAnswer, questions]
  );

  const handleTextAnswer = useCallback(
    async (text: string) => {
      if (isLocked || !sessionId) return;
      setIsLocked(true);

      const result = await submitAnswer({
        sessionId,
        questionOrder: questionIndex + 1,
        answerText: text,
      });

      if (!result.success) return;

      const { isCorrect, correctAnswer, clipUrl, roastText } = result.data;

      recordAnswer(isCorrect);

      if (isCorrect && clipUrl) {
        setFeedback({ type: "correct", clipUrl });
      } else {
        setFeedback({
          type: "wrong",
          roastText: roastText ?? "Mauvaise réponse !",
          correctAnswer: correctAnswer ?? "",
        });
      }
    },
    [isLocked, sessionId, questionIndex, recordAnswer]
  );

  const handleContinue = useCallback(() => {
    const nextIndex = questionIndex + 1;
    if (nextIndex >= totalQuestions) {
      endGame();
    } else {
      advanceQuestion();
    }
  }, [questionIndex, totalQuestions, endGame, advanceQuestion]);

  if (!sessionId) return null;

  if (isGameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ScoreBoard score={score} totalQuestions={totalQuestions} />
      </div>
    );
  }

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-game-accent-2 font-semibold text-lg">
          Chargement...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) {
    endGame();
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Score display */}
      <div className="fixed top-4 right-4 bg-game-surface rounded-xl px-4 py-2 font-bold text-game-accent text-lg">
        Score : {score}
      </div>

      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {feedback.type === "idle" && (
            <QuestionCard
              key={`q-${questionIndex}`}
              question={currentQuestion}
              questionNumber={questionIndex + 1}
              totalQuestions={totalQuestions}
              onAnswer={(i) => void handleAnswer(i)}
              onTextAnswer={(t) => void handleTextAnswer(t)}
              answerStates={answerStates}
              isLocked={isLocked}
            />
          )}
          {feedback.type === "correct" && (
            <ClipPlayer
              key="clip"
              clipUrl={feedback.clipUrl}
              onContinue={handleContinue}
            />
          )}
          {feedback.type === "wrong" && (
            <RoastDisplay
              key="roast"
              roastText={feedback.roastText}
              correctAnswer={feedback.correctAnswer}
              onContinue={() => {
                setFeedback({ type: "idle" });
                setAnswerStates(["idle", "idle", "idle", "idle"]);
                setIsLocked(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
