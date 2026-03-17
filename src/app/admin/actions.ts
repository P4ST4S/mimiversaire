"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { questions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const QuestionSchema = z.object({
  text: z.string().min(1),
  options: z.array(
    z.object({ label: z.string(), text: z.string().min(1) })
  ).length(4),
  correctIndex: z.coerce.number().int().min(0).max(3),
  clipUrl: z.string().url().optional().or(z.literal("")),
  roastText: z.string().optional(),
  order: z.coerce.number().int().min(1),
});

export async function addQuestion(formData: FormData): Promise<void> {
  const raw = {
    text: formData.get("text"),
    options: [
      { label: "A", text: formData.get("option_a") },
      { label: "B", text: formData.get("option_b") },
      { label: "C", text: formData.get("option_c") },
      { label: "D", text: formData.get("option_d") },
    ],
    correctIndex: formData.get("correctIndex"),
    clipUrl: formData.get("clipUrl"),
    roastText: formData.get("roastText"),
    order: formData.get("order"),
  };

  const parsed = QuestionSchema.parse(raw);

  await db.insert(questions).values({
    text: parsed.text,
    options: parsed.options,
    correctIndex: parsed.correctIndex,
    clipUrl: parsed.clipUrl ?? null,
    roastText: parsed.roastText ?? null,
    order: parsed.order,
  });

  revalidatePath("/admin");
}

export async function deleteQuestion(id: number): Promise<void> {
  await db.delete(questions).where(eq(questions.id, id));
  revalidatePath("/admin");
}
