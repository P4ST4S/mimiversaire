import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import { getAllQuestions } from "@/lib/db/queries";
import { addQuestion, deleteQuestion } from "./actions";

function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const adminPassword = process.env["ADMIN_PASSWORD"] ?? "";
  if (!adminPassword) return false;
  const expected = createHash("sha256").update(adminPassword).digest("hex");
  return token === expected;
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!verifyAdminToken(token)) {
    redirect("/admin/login");
  }

  const allQuestions = await getAllQuestions();

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black text-game-accent mb-8">
        Admin — Questions
      </h1>

      {/* Existing questions */}
      <div className="flex flex-col gap-3 mb-10">
        {allQuestions.map((q) => {
          const options = q.options as Array<{ label: string; text: string }>;
          return (
            <div
              key={q.id}
              className="rounded-xl p-4 flex items-start justify-between gap-4"
              style={{ background: "#1B1D35", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex-1">
                <p className="font-bold text-game-accent text-sm">
                  #{q.order} — {q.text}
                </p>
                <p className="text-game-accent-2 text-xs mt-1">
                  Bonne réponse : {q.correctIndex != null ? options[q.correctIndex]?.text : q.correctAnswer} ?? "?"
                </p>
                {q.clipUrl && (
                  <p className="text-game-accent-2/60 text-xs truncate mt-0.5">
                    Clip : {q.clipUrl}
                  </p>
                )}
              </div>
              <form
                action={async () => {
                  "use server";
                  await deleteQuestion(q.id);
                }}
              >
                <button
                  type="submit"
                  className="text-xs px-3 py-1 rounded-lg font-semibold text-white cursor-pointer"
                  style={{ background: "#E21B3C" }}
                >
                  Supprimer
                </button>
              </form>
            </div>
          );
        })}
        {allQuestions.length === 0 && (
          <p className="text-game-accent-2 text-sm">Aucune question pour le moment.</p>
        )}
      </div>

      {/* Add question form */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#1B1D35", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-lg font-bold text-game-accent mb-5">
          Ajouter une question
        </h2>
        <form action={addQuestion} className="flex flex-col gap-3">
          <input
            name="order"
            type="number"
            placeholder="Ordre (ex: 4)"
            required
            className="admin-input"
          />
          <textarea
            name="text"
            placeholder="Texte de la question"
            required
            rows={2}
            className="admin-input resize-none"
          />
          {(["A", "B", "C", "D"] as const).map((l) => (
            <input
              key={l}
              name={`option_${l.toLowerCase()}`}
              placeholder={`Option ${l}`}
              required
              className="admin-input"
            />
          ))}
          <input
            name="correctIndex"
            type="number"
            placeholder="Index correct (0=A, 1=B, 2=C, 3=D)"
            min={0}
            max={3}
            required
            className="admin-input"
          />
          <input
            name="clipUrl"
            type="url"
            placeholder="URL clip R2 (optionnel)"
            className="admin-input"
          />
          <textarea
            name="roastText"
            placeholder="Texte roast (optionnel)"
            rows={2}
            className="admin-input resize-none"
          />
          <button
            type="submit"
            className="py-3 rounded-xl font-bold text-white cursor-pointer"
            style={{ background: "#26890C" }}
          >
            Ajouter
          </button>
        </form>
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          background: #22254A;
          color: #B8D0E8;
          border: 1px solid rgba(255,255,255,0.1);
          outline: none;
          font-size: 0.9rem;
        }
        .admin-input:focus { border-color: #7B9FD4; }
        .admin-input::placeholder { color: rgba(123,159,212,0.4); }
      `}</style>
    </main>
  );
}
