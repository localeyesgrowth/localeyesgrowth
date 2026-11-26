"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { Noise } from "@/components/effects/Noise";
import TiltedCard from "@/components/TiltedCard/TiltedCard";
import { useCalendly, CALENDLY_BOOKING_URL } from "@/components/sections/CalendlyModal";

/* /public/valor-photo.webp (640x640) — referenced root-relative. */
const IMG = (path: string) => `${"/"}${path.replace(/^\//, "")}`;

/* Card treatment for the podcast cover — a warm cream mat (thick border)
   plus a hairline ring, shared by the tilted card and the reduced-motion
   static fallback so both render identically. */
const CARD_IMG =
  "rounded-2xl border-[10px] border-[#f6f2e3] shadow-[0_30px_60px_-18px_rgba(38,31,21,0.4)] ring-1 ring-[#261f15]/15";

export default function ValorHero() {
  const containerRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const { open: openCalendly } = useCalendly();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(motion.matches);
    const update = () => setReduced(motion.matches);
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      /* Staggered entrance — eyebrow, headline, copy, buttons, photo.
         fromTo keeps the server-rendered state fully visible (no
         opacity-0 initial styles baked into the markup). */
      gsap.fromTo(
        ".le-valor-reveal",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={containerRef}
      className="relative z-0 flex min-h-[90vh] w-full flex-col justify-center overflow-hidden bg-[#ededd5] pb-20 pt-40 text-[#261f15] md:pb-28 md:pt-48"
    >
      <Noise patternAlpha={10} patternRefreshInterval={reduced ? 1000000 : 2} />

      {/* Soft radial vignette for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,#ffffff40_0%,transparent_70%)]"
      />

      {/* Vertical hairlines — the site's quiet editorial column grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 mx-auto flex w-full max-w-[1480px] justify-between px-6 md:px-12"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-full w-px bg-gradient-to-b from-transparent via-[#261f15]/15 to-transparent"
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1480px] items-center gap-14 px-6 md:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* ---------------- Text column ---------------- */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="le-valor-reveal font-sans text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#a39b84] sm:text-xs">
            Exclusive · Valor Listeners
          </p>

          <h1 className="le-valor-reveal mt-5 font-heading font-thin not-italic text-[clamp(3.25rem,6.5vw,6.25rem)] leading-[0.92] tracking-[-0.02em] text-[#261f15]">
            Exclusive SEO Offers for{" "}
            Valor Listeners
          </h1>

          <p className="le-valor-reveal mt-10 max-w-xl font-sans text-sm leading-relaxed text-[#261f15]/75 sm:text-base md:text-lg">
            If you&apos;re looking to start taking your SEO seriously, Valor
            listeners can also enjoy exclusive pricing for our plans.
          </p>

          <div className="le-valor-reveal mx-auto mt-10 flex w-fit flex-col items-stretch gap-3 sm:mx-0 sm:w-auto sm:flex-row">
            {/* Primary — same pill treatment as the header CTA.
               href is a placeholder (#) until the real URL is provided. */}
            <a
              href="#pricing"
              className="inline-flex cursor-pointer items-center justify-center rounded-[4px] px-6 py-3.5 font-sans text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--le-accent)] border border-[#261f15]/30 text-[#261f15] hover:border-[#261f15]"
            >
              Exclusive Catering SEO Prices
            </a>

            {/* Secondary — quiet bordered pill; stretches to match the
               primary's height in both row and column layouts. Opens the
               same Calendly modal as the header's "Book a Call". */}
            <a
              href={CALENDLY_BOOKING_URL}
              onClick={(e) => {
                e.preventDefault();
                openCalendly();
              }}
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] border border-[#261f15]/30 px-6 py-3.5 font-sans text-sm font-semibold text-[#261f15] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#261f15] hover:text-[#ededd5] active:bg-[#261f15] active:text-[#ededd5] sm:px-8 sm:py-0 sm:text-xs"
            >
              Book A Call
            </a>
          </div>
        </div>

        {/* ---------------- Photo column ---------------- */}
        <div className="le-valor-reveal relative mx-auto w-full max-w-[420px] lg:max-w-[480px]">
          {/* Single symmetric gold frame behind the card — extends equally
             left + right, offset downward; one clean outline, no inner lines */}
          <div
            aria-hidden="true"
            className="absolute -left-6 -right-6 top-6 -bottom-6 rounded-2xl border-2 border-[#a39b84]/60 bg-[#ededd5]/5"
          />
          {reduced ? (
            <Image
              src={IMG("/valor-photo.webp")}
              alt="Valor Coffee Podcast cover: the three hosts at a table with Valor mugs"
              width={640}
              height={640}
              priority
              className={`relative w-full ${CARD_IMG}`}
            />
          ) : (
            <div className="relative aspect-square w-full">
              <TiltedCard
                imageSrc={IMG("/valor-photo.webp")}
                altText="Valor Coffee Podcast cover: the three hosts at a table with Valor mugs"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={10}
                translateAmplitude={10}
                scaleOnHover={1.04}
                imageClassName={CARD_IMG}
              />
            </div>
          )}
          <p className="mt-8 text-center font-sans text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#261f15]/50">
            As heard on the Valor Coffee Podcast
          </p>
        </div>
      </div>
    </section>
  );
}
