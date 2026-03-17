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
        <form action="/admin/login" method="POST" className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            autoComplete="current-password"
            required
            className="w-full rounded-xl px-4 py-3 bg-game-surface-2 text-game-accent placeholder:text-game-accent-2/50 border border-white/10 outline-none focus:border-game-accent-2"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white cursor-pointer"
            style={{ background: "#1368CE" }}
          >
            Connexion
          </button>
        </form>
      </div>
    </main>
  );
}
