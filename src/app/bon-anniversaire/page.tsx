import { Cinzel_Decorative } from "next/font/google";
import BonAnniversaireClient from "./BonAnniversaireClient";

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
});

export default function BonAnniversairePage() {
  const base = process.env.RUKIA_BASE_URL ?? "";
  return (
    <main className={cinzelDecorative.variable}>
      <BonAnniversaireClient
        openingUrl={`${base}opening.mov`}
        messageUrl={`${base}rukia-msg.mp4`}
        ostUrl={`${base}ost.mp3`}
      />
    </main>
  );
}
