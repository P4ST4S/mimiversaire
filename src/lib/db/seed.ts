import { db } from "./client";
import { questions } from "./schema";

const SEED_QUESTIONS = [
  {
    order: 1,
    questionType: "plain_text",
    text: "Qui ressemble au daron d'Arthur ?",
    options: null,
    correctIndex: null,
    correctAnswer: "Wassim",
    acceptPartial: true,
    clipUrl: "https://pub-4967b3d287b74363b485326b5a4d9a91.r2.dev/clips/4.mp4",
    roastText:
      "C'est pourtant... un des pitchounes que tu vois TOUT LE TEMPS ! 💀",
  },
  {
    order: 2,
    text: "Quelle recette du chef cuisinier de la communauté, Aziz n'a jamais faite ?",
    options: [
      { label: "A", text: "Son fameux tiramisu kiwi" },
      { label: "B", text: "L'iconique sandwich pims orange chèvre miel" },
      { label: "C", text: "L'union Chine - Italie nouilles carbonara" },
      { label: "D", text: "Le hot dog au mille saucisse" },
    ],
    correctIndex: 2,
    clipUrl: "https://pub-4967b3d287b74363b485326b5a4d9a91.r2.dev/clips/7.mp4",
    roastText:
      "Tu connais même pas le menu de ta propre communauté... Aziz te retire son étoile Michelin. 🍝",
  },
  {
    order: 3,
    text: "Mimi rêve de faire un cosplay très spécial, lequel ?",
    options: [
      { label: "A", text: "La reine, la déesse, l'inimitable, Makima" },
      { label: "B", text: "Son coup de cœur Orihime" },
      { label: "C", text: "Senritsu la magnifique" },
      { label: "D", text: "Le goat de RE3 Nemesis" },
    ],
    correctIndex: 3,
    clipUrl: "https://pub-4967b3d287b74363b485326b5a4d9a91.r2.dev/clips/5.mp4",
    roastText:
      "T'as même pas retenu ton propre rêve de cosplay... Le chat te regarde avec pitié. 🪡",
  },
  {
    order: 4,
    questionType: "plain_text",
    text: "Sur quel jeu Mimi à t'elle exploser la tête d'une grand-mère ?",
    options: null,
    correctIndex: null,
    correctAnswer: "The Quarry",
    acceptPartial: true,
    clipUrl: "https://pub-4967b3d287b74363b485326b5a4d9a91.r2.dev/clips/1.mp4",
    roastText:
      "T'as explosé une mamie en jeu et t'as même pas le souvenir du crime... Wesker aurait assumé, lui. 💥👵",
  },
  {
    order: 5,
    questionType: "qcm",
    text: "Quel personnage incarnait le cosplayer qui a offert à Mimi l'une des interactions sociales les plus malaisantes de sa vie ?",
    options: [
      { label: "A", text: "Deadpool, toujours prêt à briser le 4ème mur" },
      { label: "B", text: "Sanji, le simp numéro 1 de Nami" },
      { label: "C", text: 'Nicky Larson, qui a eu beaucoup de mal à "se contrôler"' },
      { label: "D", text: "Tortue Géniale, fidèle à sa réputation" },
    ],
    correctIndex: 2,
    clipUrl:
      "https://pub-4967b3d287b74363b485326b5a4d9a91.r2.dev/clips/nickycringe.mp4",
    roastText:
      "Tu as oublié ce moment de pure gêne absolue avec ce faux Nicky Larson ? Ton radar à malaise est définitivement cassé. 🔫",
  },
];

async function seed(): Promise<void> {
  console.warn("Deleting existing questions...");
  await db.delete(questions);
  console.warn("Inserting seed questions...");
  await db.insert(questions).values(SEED_QUESTIONS);
  console.warn("Seed complete. 5 questions inserted.");
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
