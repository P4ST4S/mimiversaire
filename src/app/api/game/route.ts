import { NextResponse } from "next/server";
import { createSession } from "@/lib/db/queries";
import { countQuestions } from "@/lib/db/queries";

export async function POST(): Promise<NextResponse> {
  const [sessionId, totalQuestions] = await Promise.all([
    createSession(),
    countQuestions(),
  ]);
  return NextResponse.json({ sessionId, totalQuestions });
}
