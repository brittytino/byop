"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type HeroStat = {
  label: string;
  value: string;
};

type GsapHeroProps = {
  name: string;
  tagline: string;
  summary: string;
  stats: HeroStat[];
};

export function GsapHero({ name, tagline, summary, stats }: GsapHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current) {
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          "[data-hero-badge]",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.45 }
        )
        .fromTo(
          "[data-hero-title]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.2"
        )
        .fromTo(
          "[data-hero-summary]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          "[data-hero-stat]",
          { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08 },
          "-=0.25"
        );
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="glass rounded-3xl border border-border bg-surface/75 p-8 md:p-12"
    >
      <p
        data-hero-badge
        className="inline-flex items-center rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary"
      >
        {tagline}
      </p>

      <h1
        data-hero-title
        className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl"
      >
        {name}
      </h1>

      <p
        data-hero-summary
        className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-xl"
      >
        {summary}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            data-hero-stat
            className="rounded-2xl border border-border bg-surface/80 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-primary">{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
