import { Reveal } from "@/components/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "dark"
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const titleClass = tone === "light" ? "text-white" : "text-navy";
  const bodyClass = tone === "light" ? "text-white/70" : "text-charcoal/75";

  return (
    <Reveal
      className={`mx-auto max-w-3xl ${align === "center" ? "text-center" : ""}`}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-magenta">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`font-heading text-3xl font-semibold tracking-normal md:text-5xl ${titleClass}`}>
        {title}
      </h2>
      {body ? (
        <p className={`mt-5 text-base leading-8 md:text-lg ${bodyClass}`}>{body}</p>
      ) : null}
    </Reveal>
  );
}
