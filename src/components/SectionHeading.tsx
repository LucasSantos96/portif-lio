import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id: string;
  title: string;
  intro?: string;
  className?: string;
}

export const sectionContainer = "mx-auto w-full max-w-[1240px] px-4 md:px-8";

export default function SectionHeading({ id, title, intro, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", className)}>
      <h2 id={id} className="type-heading text-[2.5rem] text-paper md:text-6xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 max-w-[52ch] text-lg text-fog md:text-xl">{intro}</p>
      ) : null}
    </Reveal>
  );
}
