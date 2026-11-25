"use client";

import { HeroOptionWheel } from "./HeroOptionWheel";
import { useGrowthDiagnostic } from "../growth-diagnostic/GrowthDiagnosticProvider";

export default function Hero() {
  /* Growth Diagnostic quiz lives in a single global provider (see
     GrowthDiagnosticProvider) so its open state stays in sync with the
     URL no matter which CTA triggered it. */
  const { open: openQuiz } = useGrowthDiagnostic();

  return (
    <section className="relative flex h-full min-h-svh w-full flex-col overflow-hidden bg-[#ededd5] text-[#261f15]">
      {/* Vertical hairlines — quiet editorial grid behind everything */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 mx-auto flex w-full max-w-[1480px] justify-between px-6 md:px-12"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-full w-px bg-[#261f15]/[0.07]" />
        ))}
      </div>

      {/* ---------- Centered content ---------- */}
      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-40 text-center md:pt-52">
        {/* Eyebrow — tracks in from wide letter-spacing with a soft focus pull */}
        <h1 className="flex items-center gap-3 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#261f15]/60 sm:text-xs animate-le-eyebrow-in">
          Catering SEO Services for Coffee Carts, Mobile Bars & Every Kind of Caterer
        </h1>

        {/* Headline — each word rises out of its own clipping mask, staggered */}
        <p className="mt-[13px] max-w-6xl text-balance font-heading font-thin not-italic text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[5.2rem]">
          {"The Growth Agency for Event Caterers"
            .split(" ")
            .map((word, i, arr) => (
              <span key={i}>
                <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] pt-[0.08em] -mt-[0.08em] pl-[0.06em] -ml-[0.06em] align-baseline">
                  <span
                    className="inline-block animate-le-word-rise"
                    style={{ animationDelay: `${100 + i * 42}ms` }}
                  >
                    {word}
                  </span>
                </span>
                {i < arr.length - 1 && " "}
              </span>
            ))}
        </p>

        {/* CTA pair — same mechanic as the header CTA (pill + icon chip + slow bloom) */}
        <div
          className="mt-10 flex w-full flex-row flex-wrap items-center justify-center gap-3 sm:mt-12 sm:w-auto sm:gap-5 animate-le-fade-up"
          style={{ animationDelay: "760ms" }}
        >
          <button
            type="button"
            onClick={openQuiz}
            className="inline-flex cursor-pointer items-center justify-center rounded-[4px] bg-[#261f15] px-6 py-3.5 font-sans text-sm font-semibold text-[#ededd5] transition-colors duration-300 hover:bg-[#4a3421] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--le-accent)]"
          >
            Free Growth Score
          </button>
          <a
            href="/pricing"
            className="inline-flex items-center justify-center rounded-[4px] border border-[#261f15]/30 px-6 py-3.5 font-sans text-sm font-semibold text-[#261f15] transition-colors duration-300 hover:border-[#261f15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--le-accent)]"
          >
            Pricing
          </a>
        </div>

        {/* Stat line */}
        <p
          className="mt-10 font-sans text-[0.7rem] uppercase tracking-[0.12em] text-[#261f15]/55 sm:text-sm animate-le-fade-up"
          style={{ animationDelay: "880ms" }}
        >
          <span className="mr-1.5 font-heading normal-case tracking-normal text-xl text-[#261f15] sm:text-2xl align-[-0.08em]">
            $350k+
          </span>
          Generated in Client Bookings each Month
        </p>
      </div>

      {/* ---------- Bottom: React Bits OptionWheel — drag / scroll / arrow keys to spin ---------- */}
      <div className="relative z-20 w-full">
        {/* soft cream fades at both ends so items roll in/out gracefully */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#ededd5] to-transparent sm:w-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#ededd5] to-transparent sm:w-40"
        />
        <HeroOptionWheel />
      </div>

      
    </section>
  );
}
