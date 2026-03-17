import { NextResponse } from "next/server";
import { getAllQuestions } from "@/lib/db/queries";

export async function GET(): Promise<NextResponse> {
  const questions = await getAllQuestions();
  return NextResponse.json({ questions });
}
