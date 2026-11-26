"use client";

import Link from "next/link";
import { Noise } from "@/components/effects/Noise";

const EMPTY_ROWS = [
  { title: "w-2/3" },
  { title: "w-1/2" },
  { title: "w-3/5" },
  { title: "w-[45%]" },
];

export default function NotFound() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-clip bg-[#ededd5] text-[#261f15] selection:bg-[#ededd5] selection:text-[#261f15]">
      <section className="relative mx-auto w-full max-w-[1480px] px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40">
        <style>{`
          @keyframes nf-in {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .nf-in {
            opacity: 0;
            animation: nf-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          @keyframes nf-caret {
            0%, 55% { opacity: 1; }
            60%, 95% { opacity: 0.15; }
            100% { opacity: 1; }
          }
          .nf-caret { animation: nf-caret 1.3s steps(1) infinite 1.4s; }
          @keyframes nf-scan {
            0%, 21% { transform: translateY(0); }
            25%, 46% { transform: translateY(4.5rem); }
            50%, 71% { transform: translateY(9rem); }
            75%, 96% { transform: translateY(13.5rem); }
            100% { transform: translateY(0); }
          }
          .nf-scan {
            animation: nf-scan 9s cubic-bezier(0.22, 1, 0.36, 1) infinite 1.6s;
          }
          @media (prefers-reduced-motion: reduce) {
            .nf-in { opacity: 1; animation: none; }
            .nf-caret, .nf-scan { animation: none; }
          }
        `}</style>

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ------------------------------------------------ copy column */}
          <div>
            <p
              className="nf-in font-sans text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#6a5f4e]"
              style={{ animationDelay: "420ms" }}
            >
              Error 404
              Not Found
            </p>

            {/* giant 404 — decorative; the message lives in real text below */}
            <p
              aria-hidden="true"
              className="nf-in mt-4 font-heading font-thin leading-[0.9] tracking-[-0.02em] text-[clamp(4rem,21vw,15rem)]"
              style={{ animationDelay: "500ms" }}
            >
              404
            </p>

            <h1
              className="nf-in mt-6 font-heading font-thin not-italic leading-[1.05] pb-4 text-[clamp(1.9rem,4.2vw,3.3rem)]"
              style={{ animationDelay: "620ms" }}
            >
              This page isn&rsquo;t ranking.
            </h1>

            <p
              className="nf-in mt-5 max-w-xl font-sans text-sm leading-relaxed text-[#261f15]/70 sm:text-base"
              style={{ animationDelay: "720ms" }}
            >
              It&rsquo;s not on page one. It&rsquo;s not on page ten. It
              doesn&rsquo;t exist, which is exactly how your customers feel
              when your business isn&rsquo;t on Google.
            </p>

            <div
              className="nf-in mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8"
              style={{ animationDelay: "820ms" }}
            >
              {/* primary — gold, confident; the site's chip-bloom pill */}
              <Link
                href="/"
                className="inline-flex cursor-pointer items-center justify-center rounded-[4px] px-6 py-3.5 font-sans text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--le-accent)] border border-[#261f15]/30 text-[#261f15] hover:border-[#261f15] shrink-0"
              >
                Back to Home
              </Link>

              {/* secondary — quiet link, gold underline draws in from left */}
              <Link
                href="/results"
                className="group/link relative rounded-sm font-sans text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#4a3421]/75 transition-colors duration-300 hover:text-[#261f15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6a5f4e]"
              >
                See what we do for pages that DO exist{" "}
                <span className="whitespace-nowrap">
                  Results
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#6a5f4e] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100"
                />
              </Link>
            </div>
          </div>

          {/* ----------------------------------------- illustration column */}
          <div
            aria-hidden="true"
            className="relative mx-auto w-full max-w-[30rem]"
          >
            {/* second sheet behind — '70s stationery, barely there */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[1.2deg] rounded-[1.5rem] border border-[#a39b84]/40" />

            <div className="nf-in relative rounded-[1.5rem] border border-[#261f15]/15 bg-[#ededd5] shadow-[0_40px_90px_-40px_rgba(38,31,21,0.4)]">
              {/* search field — the query that found nothing */}
              <div className="flex items-center gap-4 border-b border-[#261f15]/10 px-6 py-4">
                <span className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.25em] text-[#4a3421]/60">
                  Search
                </span>
                <span className="flex-1 border-b border-dashed border-[#4a3421]/30 pb-1 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#261f15]/70">
                  this page
                </span>
              </div>

              {/* the empty result slots + the searching ✦ cursor */}
              <div className="relative">
                {EMPTY_ROWS.map((row, i) => (
                  <div
                    key={i}
                    className={`nf-in flex h-[4.5rem] flex-col justify-center gap-2.5 border-b border-[#261f15]/10 pl-8 pr-6 ${
                      i === EMPTY_ROWS.length - 1 ? "border-b-0" : ""
                    }`}
                    style={{ animationDelay: `${80 + i * 90}ms` }}
                  >
                    <div
                      className={`h-0 border-t-2 border-dashed border-[#4a3421]/30 ${row.title}`}
                    />
                    <div className="h-0 w-full border-t border-dashed border-[#4a3421]/15" />
                    <div className="h-0 w-5/6 border-t border-dashed border-[#4a3421]/15" />
                  </div>
                ))}
              </div>

              {/* ledger footer — the wink, in small print */}
              <div className="flex items-center justify-between border-t border-[#261f15]/10 px-6 py-3.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-[#4a3421]/55">
                <span>0 results found</span>
                <span>0.00 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
