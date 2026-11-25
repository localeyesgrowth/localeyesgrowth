"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CurvedLoop from "@/components/CurvedLoop";
import { Noise } from "@/components/effects/Noise";

gsap.registerPlugin(ScrollTrigger);

export default function PricingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

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
      // Gentle entrance for the text
      gsap.fromTo(
        ".le-hero-reveal",
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

      // Parallax effect on scroll
      if (textRef.current && loopRef.current) {
        gsap.to(textRef.current, {
          y: "15%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={containerRef}
      className={`${reduced ? "relative" : "sticky top-0"} z-0 flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-[#ededd5] pt-44 text-[#261f15] md:pt-52`}
    >
      <Noise patternAlpha={10} patternRefreshInterval={reduced ? 1000000 : 2} />

      {/* Soft radial vignette for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,#ffffff40_0%,transparent_70%)]"
      />

      {/* Vertical hairlines — a quiet editorial column grid behind the type.
          5 full-height rules, fading out at the top and bottom edges. */}
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

      <div
        ref={textRef}
        className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-col items-center px-6 text-center md:px-12"
      >
        <p className="le-hero-reveal font-sans text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#a39b84] sm:text-xs">
          Investment
        </p>

        <h1 className="le-hero-reveal mt-5 max-w-5xl font-heading font-thin not-italic text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.02em] text-[#261f15]">
          Growth is an{" "}
          equation, not an
          expense.
        </h1>

        <p className="le-hero-reveal mt-12 max-w-2xl font-sans text-sm leading-relaxed text-[#261f15]/75 sm:text-base md:text-lg">
          We don't charge for hours. We charge for the system that fills your
          calendar with premium events. Choose the engine that matches your
          operational capacity.
        </p>

        <div className="le-hero-reveal mt-12">
          {/* Same pill treatment as the header CTA — gold wash floods on hover */}
          <a
            href="#pricing"
            className="inline-flex cursor-pointer items-center justify-center rounded-[4px] px-6 py-3.5 font-sans text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--le-accent)] border border-[#261f15]/30 text-[#261f15] hover:border-[#261f15]"
          >
            View Rate Card
          </a>
        </div>
      </div>

      {/* Curved Loop Graphic — arched upward (∩), ends anchored to the
          very bottom-left / bottom-right corners of the section */}
      <div
        ref={loopRef}
        className="le-hero-reveal relative z-0 mt-auto w-full pt-24 opacity-80 md:pt-32"
      >
        <CurvedLoop
          marqueeText="PREMIUM EVENTS • SCALABLE GROWTH • MEASURABLE ROI • "
          speed={reduced ? 0 : 1.5}
          interactive={!reduced}
          curveAmount={-190}
          direction="left"
          className="fill-[#261f15]/10 font-heading not-italic text-[4.5rem] uppercase tracking-[0.05em] md:text-[6rem] lg:text-[8rem]"
        />
      </div>
    </section>
  );
}
