"use client";

import { useGrowthDiagnostic } from "@/components/growth-diagnostic/GrowthDiagnosticProvider";
import { useCalendly, CALENDLY_BOOKING_URL } from "@/components/sections/CalendlyModal";
import { Hairlines } from "./parts";

/* ----------------------------------------------------------------------
   WebsitesClosing: the last word on the websites page, on the dark of
   the home page's closing band. A wide ring of lettering turns slowly
   behind it, the house badge grown large; still with reduced motion.
   ---------------------------------------------------------------------- */

export default function WebsitesClosing({
  lead,
  accent,
  body,
  buyLabel,
  buyUrl,
}: {
  lead: string;
  accent: string;
  body: string;
  buyLabel: string;
  buyUrl: string;
}) {
  const { open: openQuiz } = useGrowthDiagnostic();
  const { open: openCalendly } = useCalendly();
  const link =
    "font-sans text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#ededd5]/55 underline decoration-[#ededd5]/25 underline-offset-[6px] transition-colors hover:text-[#ededd5] hover:decoration-[#ededd5]/60 sm:text-xs";

  return (
    <section aria-labelledby="websites-closing-title" className="relative w-full overflow-hidden bg-[#261f15] py-28 text-[#ededd5] md:py-40">
      <Hairlines dark />
      {/* the house badge, grown large */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(118vw,700px)] w-[min(118vw,700px)] -translate-x-1/2 -translate-y-1/2"
      >
        <svg viewBox="0 0 100 100" className="h-full w-full animate-le-spin-slow" fill="none">
          <defs>
            <path id="le-closing-circle" d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
          </defs>
          <circle cx="50" cy="50" r="40.5" stroke="#a39b84" strokeOpacity="0.1" strokeWidth="0.1" />
          <text className="font-sans" fill="#a39b84" fillOpacity="0.11" fontSize="2.3" fontWeight="600" letterSpacing="1.5">
            <textPath href="#le-closing-circle" startOffset="0">
              LOCALEYES · WEBSITES BUILT TO RANK · EST. MMXXIII · LOCALEYES · WEBSITES BUILT TO RANK · EST. MMXXIII
            </textPath>
          </text>
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(45% 50% at 50% 50%, rgba(163, 155, 132,0.12), rgba(163, 155, 132,0) 70%)" }}
      />

      <div className="relative mx-auto flex w-full max-w-[1480px] flex-col items-center px-6 text-center md:px-12">
        <p className="flex items-center gap-3 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[#a39b84] sm:text-xs">
          Free growth diagnostic
        </p>
        <h2
          id="websites-closing-title"
          className="mt-8 max-w-[52rem] font-heading font-thin not-italic text-[clamp(2.6rem,6vw,5.4rem)] leading-[1.02] tracking-[-0.02em]"
        >
          {lead} <span>{accent}</span>
        </h2>
        <p className="mt-7 max-w-[32rem] font-sans text-[1rem] leading-[1.7] text-[#ededd5]/60">{body}</p>

        <button
          type="button"
          onClick={openQuiz}
          className="inline-flex cursor-pointer items-center justify-center rounded-[4px] px-6 py-3.5 font-sans text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--le-accent)] bg-[#ededd5] text-[#261f15] hover:bg-white mt-11"
        >
          Run my free growth diagnostic
        </button>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          <a
            href={CALENDLY_BOOKING_URL}
            onClick={(e) => {
              e.preventDefault();
              openCalendly();
            }}
            className={link}
          >
            Book a call
          </a>
          <a href={buyUrl} target="_blank" rel="noopener noreferrer" className={link}>
            {buyLabel}
          </a>
          <a href="/pricing" className={link}>
            View pricing
          </a>
        </div>
      </div>
    </section>
  );
}
