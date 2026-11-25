"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop({ threshold = 480 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > threshold);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    /* release focus so it never sits inside the soon-hidden button */
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
      className={`group fixed bottom-6 right-6 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-[4px] border border-[#261f15]/20 bg-[#ededd5] text-[#261f15] transition-[opacity,transform,background-color,color] duration-300 ease-out hover:bg-[#261f15] hover:text-[#ededd5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--le-accent)] md:bottom-8 md:right-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
