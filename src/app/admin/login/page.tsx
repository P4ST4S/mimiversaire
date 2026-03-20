import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

async function loginAction(formData: FormData): Promise<void> {
  "use server";
  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    redirect("/admin/login");
  }
  const adminPassword = process.env["ADMIN_PASSWORD"] ?? "";
  if (password !== adminPassword) {
    redirect("/admin/login");
  }
  const token = createHash("sha256").update(adminPassword).digest("hex");
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div
        className="w-full max-w-sm flex flex-col gap-5 rounded-2xl p-8"
        style={{ background: "#1B1D35", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <h1 className="text-xl font-black text-game-accent text-center">
          Admin — Mimiversaire
        </h1>
        <form action={loginAction} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            autoComplete="current-password"
            required
            className="w-full rounded-xl px-4 py-3 bg-game-surface-2 text-game-accent border border-white/10 outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white cursor-pointer"
            style={{ background: "#88a2ee" }}
          >
            Connexion
          </button>
        </form>
      </div>
    </main>
  );
}
