import { Suspense } from "react";
import QuizContent from "./QuizContent";

export const experimental_ppr = true;

function QuizSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-game-accent-2 font-semibold text-lg">
        Chargement du quiz...
      </p>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<QuizSkeleton />}>
      <QuizContent />
    </Suspense>
  );
}
