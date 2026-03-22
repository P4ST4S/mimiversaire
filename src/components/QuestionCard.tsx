"use client";

import { motion } from "framer-motion";
import type { Question } from "@/lib/db/queries";
import type { AnswerLabel, AnswerState } from "./AnswerButton";
import AnswerButton from "./AnswerButton";
import TextInputQuestion from "./TextInputQuestion";
import AzizQuestionImg from "./AzizQuestionImg";
import TrollAnswerGrid from "./TrollAnswerGrid";

const LABELS: AnswerLabel[] = ["A", "B", "C", "D"];
const DELAYS = [0, 0.08, 0.16, 0.24];

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (index: number) => void;
  onTextAnswer: (text: string) => void;
  answerStates: AnswerState[];
  isLocked: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onTextAnswer,
  answerStates,
  isLocked,
}: QuestionCardProps) {
  const isPlainText = question.questionType === "plain_text";
  const options = (question.options ?? []) as Array<{
    label: string;
    text: string;
  }>;

  return (
    <>
      <motion.div
        key={question.id}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-3xl mx-auto flex flex-col gap-5"
      >
        {/* Header: progress */}
        <div className="flex items-center">
          <span className="text-sm font-semibold text-game-accent-2">
            Question {questionNumber}
          </span>
        </div>

        {/* Question */}
        <div
          className="rounded-2xl p-6 text-center font-bold text-game-accent leading-snug"
          style={{
            background: "#1B1D35",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
          }}
        >
          {question.text}
        </div>

        {/* Answers */}
        {isPlainText ? (
          <TextInputQuestion onSubmit={onTextAnswer} disabled={isLocked} />
        ) : question.order === 3 ? (
          <TrollAnswerGrid
            options={options}
            correctIndex={question.correctIndex ?? 0}
            onAnswer={onAnswer}
            answerStates={answerStates}
            isLocked={isLocked}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => {
              const label = LABELS[index];
              const state = answerStates[index] ?? "idle";
              if (!label) return null;
              return (
                <AnswerButton
                  key={index}
                  label={label}
                  text={option.text}
                  onClick={() => onAnswer(index)}
                  disabled={isLocked}
                  state={state}
                  delay={DELAYS[index] ?? 0}
                />
              );
            })}
          </div>
        )}
      </motion.div>
      {questionNumber === 2 && <AzizQuestionImg />}
      {questionNumber === 4 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/omg.png"
          alt="OMG"
          className="absolute bottom-4 left-4 w-84 opacity-60 pointer-events-none"
        />
      )}
      {questionNumber === 5 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/slayy.png"
          alt="Nicky Larson cringe"
          className="absolute bottom-20 right-80 w-74 opacity-60 pointer-events-none"
        />
      )}
    </>
  );
}
