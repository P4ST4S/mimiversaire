import HomeClient from "@/components/HomeClient";
import SalamSticker from "@/components/SalamSticker";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-xl">
        <SalamSticker />
        <h1
          className="font-black text-game-accent leading-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          🎂 Joyeux Anniversaire Mimi !
        </h1>
        <p
          className="text-game-accent-2 font-semibold"
          style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)" }}
        >
          Prouve que tu connais vraiment ta propre communauté...
        </p>
        <HomeClient />
      </div>
    </main>
  );
}
