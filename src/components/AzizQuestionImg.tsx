export default function AzizQuestionImg() {
  return (
    <div>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src="/pims.webp"
        alt="Pims"
        className="absolute top-6 right-24 w-60 opacity-50 rounded-lg"
      />
      <img
        src="/pate.webp"
        alt="Pate"
        className="absolute bottom-6 right-5 w-60 opacity-50 rounded-lg"
      />
      <img
        src="/saucisse.webp"
        alt="Saucisson"
        className="absolute bottom-6 left-4 w-60 opacity-50 rounded-lg"
      />
    </div>
  );
}
