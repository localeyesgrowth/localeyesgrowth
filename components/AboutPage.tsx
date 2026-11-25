"use client";

import { ImagePlus } from "lucide-react";
import { Noise } from "@/components/effects/Noise";
import { useGrowthDiagnostic } from "@/components/growth-diagnostic/GrowthDiagnosticProvider";

/* ----------------------------------------------------------------------
   /about — PLACEHOLDER CONTENT, built ahead of the real photos and
   story so the page/nav/route exist today. Everything marked
   [bracketed] or with a dashed photo circle is a placeholder — swap
   FOUNDERS below with real photos, and replace the bracketed
   paragraphs with the real story once it's written.
   ---------------------------------------------------------------------- */

type Founder = {
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  /* Extra classes for wide/landscape source photos that need a tighter,
     face-centered crop than a plain object-cover gives — a scale +
     transform-origin pair, tuned per photo. */
  imgClassName?: string;
};

const STORY_PARAGRAPHS = [
  "I started my first business in 2014. A coffee cart on the back of a bike…",
  "I spent that year fighting water lines that burst mid-service, popping power circuits at farmers markets, and weekends where I'd load out having made almost nothing. I closed it after a year.",
  "At the time I blamed the equipment.",
  "Looking back, the equipment wasn't the problem. The problem was that outside of the few dozen people who happened to walk past me on a Saturday, nobody knew I existed.",
  "So I started over. I launched VOILA, a company built to revolutionize instant coffee, and Zane and I spent the next six years building it. We learned ecommerce the hard way, obsessed over conversion rates, built a brand that won awards, and figured out how to make people trust us before they'd ever tasted a single cup. VOILA ended up in the Wall Street Journal, Forbes, Gear Patrol, and Uncrate for making the highest scoring instant coffee ever made.",
  "When that chapter closed, Zane and I looked at what we'd learned and at what I'd lived through with the cart, and we built LocalEyes. An SEO and web agency for mobile event caterers. Exactly the thing I needed in 2014 and didn't have.",
  'Here\'s what we\'ve come to believe: in this business you rarely lose to the better cart. You lose to the one that shows up first when a bride, or an office manager, or an event planner types "coffee catering near me" at 10pm and books the top three results. Your position on Google is your storefront, and most owners have no idea theirs is empty.',
  "So we went narrow on purpose. We only work with event businesses, which means we know what's actually ranking in cities across the US right now, not what worked two years ago. SEO, conversion optimization, AI search optimization, and web design, all pointed at one thing: making you the obvious choice before anyone picks up the phone.",
  "Three years in, I've watched clients go from zero leads on Google to hundreds of them every month, and calendars that book out months ahead.",
  "I know what an empty calendar feels like. That's the whole reason LocalEyes exists.",
];

const FOUNDERS: Founder[] = [
  {
    name: "Kent",
    role: "Co-Founder",
    photo: "/kent-profile-picture.webp",
    photoAlt: "Kent Profile Picture",
  },
  {
    name: "Zane",
    role: "Co-Founder",
    photo: "/Zane-Profile-Picture.webp",
    photoAlt: "Zane Profile Picture",
    imgClassName: "scale-[1.6] origin-[29%_31%]",
  },
];

function FounderCard({ founder }: { founder: Founder }) {
  return (
    <div className="flex flex-col items-center">
      {founder.photo ? (
        <div className="relative h-40 w-40 overflow-hidden rounded-full border border-[#261f15]/10 sm:h-48 sm:w-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={founder.photo}
            alt={founder.photoAlt ?? `${founder.name} Profile Picture`}
            className={`h-full w-full object-cover ${founder.imgClassName ?? ""}`}
          />
        </div>
      ) : (
        <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-[#261f15]/25 bg-[#f7f5e8] text-[#261f15]/30 sm:h-48 sm:w-48">
          <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
        </div>
      )}
      <p className="mt-5 font-heading font-thin not-italic text-xl text-[#261f15]">
        {founder.name}
      </p>
      <p className="mt-1 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#6a5f4e]">
        {founder.role}
      </p>
      {!founder.photo && (
        <p className="mt-1 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#261f15]/35">
          [Add photo]
        </p>
      )}
    </div>
  );
}

export default function AboutPage() {
  const { open: openQuiz } = useGrowthDiagnostic();

  return (
    <main className="relative w-full overflow-x-clip bg-[#ededd5] text-[#261f15] selection:bg-[#ededd5] selection:text-[#261f15]">
      <section className="relative w-full pb-24 pt-40 md:pb-32 md:pt-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 mx-auto flex w-full max-w-[1480px] justify-between px-6 md:px-12"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-full w-px bg-[#261f15]/[0.07]" />
          ))}
        </div>

        <div className="relative z-20 mx-auto w-full max-w-[1480px] px-6 md:px-12">
          {/* ---------------------------- hero ---------------------------- */}
          <div className="relative mx-auto max-w-3xl text-center">
            <Noise patternAlpha={5} />
            <div className="relative z-10">
              <p className="flex items-center justify-center gap-3 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[#6a5f4e] sm:text-xs">
                About LocalEyes
              </p>
              <h1 className="mx-auto mt-5 font-heading font-thin not-italic text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1.06] tracking-[-0.01em] text-[#261f15]">
                Two Guys Who Got Tired of Watching Good Businesses Stay
                Invisible
              </h1>
              <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-[#261f15]/65 sm:text-base">
                A great business shouldn't lose to a worse one just because it
                shows up first on Google. We started LocalEyes to make sure
                yours does.
              </p>
            </div>
          </div>

          {/* ------------------------- founders ---------------------------- */}
          <div className="mx-auto mt-16 flex flex-col items-center justify-center gap-12 sm:flex-row sm:gap-20 md:mt-20">
            {FOUNDERS.map((founder) => (
              <FounderCard key={founder.name} founder={founder} />
            ))}
          </div>

          {/* ---------------------------- story ----------------------------- */}
          <div className="mx-auto mt-16 max-w-3xl md:mt-20">
            <h2 className="font-heading font-thin not-italic text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.15] tracking-[-0.01em] text-[#261f15]">
              Our Story
            </h2>
            <div className="mt-6 flex flex-col gap-5">
              {STORY_PARAGRAPHS.map((paragraph, i) => (
                <p
                  key={i}
                  className="font-sans text-[1.05rem] leading-[1.75] text-[#261f15]/75"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-8 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#6a5f4e]">
Kent
            </p>
          </div>

          {/* ---------------- what it's like to work with us ------------------ */}
          <div className="mx-auto mt-16 max-w-3xl md:mt-20">
            <h2 className="font-heading font-thin not-italic text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.15] tracking-[-0.01em] text-[#261f15]">
              What It's Like to Work With Us
            </h2>
            <div className="mt-10 flex flex-col">
              {[
                "You talk directly to the person doing the work. Not an account manager relaying messages back and forth. Text us and you'll hear back the same day.",
                "We're not a “set it and check in once a quarter” agency. Every month you'll know exactly what moved, what we changed, and what's next. Not a black box you pay into and hope works.",
                "Just the real stuff only you have: event photos, past client feedback, quick answers when we ask. We handle the strategy and the technical work; you keep running your business.",
              ].map((text, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 py-7 sm:flex-row sm:gap-8 ${
                    i > 0 ? "border-t border-[#261f15]/10" : ""
                  }`}
                >
                  <p className="font-sans text-[0.95rem] leading-relaxed text-[#261f15]/75">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* --------------------------- closing ---------------------------- */}
          <div className="mx-auto mt-20 max-w-2xl rounded-[1.75rem] border border-[#a39b84]/35 bg-[#261f15] px-8 py-12 text-center text-[#ededd5] md:mt-24 md:px-14 md:py-16">
            <h2 className="font-heading font-thin not-italic text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.15] tracking-[-0.01em]">
              Want to see what we'd do for you?
            </h2>
            <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-[#ededd5]/65">
              Run the free Growth Diagnostic and get a scored read on your
              rankings, Google Business Profile, and site.
            </p>
            <button
              type="button"
              onClick={openQuiz}
              className="inline-flex cursor-pointer items-center justify-center rounded-[4px] px-6 py-3.5 font-sans text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--le-accent)] bg-[#ededd5] text-[#261f15] hover:bg-white mt-8"
            >
              Run My Free Growth Diagnostic
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
