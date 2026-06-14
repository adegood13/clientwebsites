import { Reveal } from "@/components/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <Reveal>
      <p className="coords mb-3 text-cable">{eyebrow}</p>
      <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] uppercase leading-[0.95] text-spray">
        {title}
      </h2>
      {sub && <p className="mt-4 max-w-2xl text-lg text-mist">{sub}</p>}
    </Reveal>
  );
}
