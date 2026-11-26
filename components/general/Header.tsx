"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  useCalendly,
  CALENDLY_BOOKING_URL,
} from "../../components/sections/CalendlyModal";

/* Nav structure: four things on the bar, everything else inside one
   mega menu under Services. Blog, Podcast and the calculator moved off
   the bar into the menu's third column (they are also in the footer). */

type NavLink = { label: string; href: string; note?: string };

const SERVICE_LINKS: NavLink[] = [
  { label: "SEO", href: "/seo", note: "Rank first for the searches that book events" },
  { label: "Websites", href: "/websites-for-event-businesses", note: "Sites built to rank, not just look good" },
  { label: "Ads", href: "/ads", note: "Google Ads for caterers" },
];

const INDUSTRY_LINKS: NavLink[] = [
  { label: "Coffee Carts", href: "/coffee-cart-seo" },
  { label: "Mobile Bars", href: "/mobile-bar-seo" },
  { label: "Charcuterie Catering", href: "/charcuterie-catering-seo" },
];

const RESOURCE_LINKS: NavLink[] = [
  { label: "Coffee Catering Calculator", href: "/coffee-cart-pricing-calculator" },
  { label: "Blog", href: "/blog" },
  /* Points straight at episode 1 until a /podcast index exists. */
  { label: "Podcast", href: "/podcast/episode-1-catering-seo-lessons" },
];

const BAR_LINKS: NavLink[] = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

const MENU_COLUMNS = [
  { heading: "Services", links: SERVICE_LINKS },
  { heading: "Who we work with", links: INDUSTRY_LINKS },
  { heading: "Free tools and reading", links: RESOURCE_LINKS },
];

/* one shared style so every item on the bar sits on the same line */
const BAR_ITEM =
  "inline-flex h-10 cursor-pointer items-center gap-1.5 font-sans text-sm font-medium leading-none text-[#261f15]/75 transition-colors duration-300 hover:text-[#261f15] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--le-accent)]";

function MobileGroup({
  heading,
  links,
  onNavigate,
}: {
  heading: string;
  links: NavLink[];
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex cursor-pointer items-center justify-between border-b border-[#261f15]/10 px-3 py-3.5 font-sans text-sm font-medium text-[#261f15]/85"
      >
        {heading}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onNavigate}
              className="block border-b border-[#261f15]/10 py-3 pl-7 pr-3 font-sans text-sm text-[#261f15]/70"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* a click while the pointer is already over the trigger must not close what hover just opened */
  const hovering = useRef(false);
  const { open: openCalendly } = useCalendly();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* the mega menu closes on Escape and on a click anywhere outside it */
  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!megaRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  /* hover opens at once; leaving waits a beat so a diagonal move toward
     the panel does not close it */
  const hoverOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    hovering.current = true;
    setMegaOpen(true);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    hovering.current = false;
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  const solid = isScrolled || megaOpen || isMenuOpen;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 border-b py-3 transition-[background-color,border-color] duration-300 ease-out md:py-4 ${
        solid ? "border-[#261f15]/10 bg-[#ededd5]/95 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div ref={megaRef} className="relative mx-auto flex w-full max-w-[1480px] items-center justify-between px-6 md:px-12">
        <Link href="/" aria-label="LocalEyes home" className="flex h-10 items-center font-heading text-2xl leading-none tracking-wide text-[#261f15] md:text-3xl">
          LE
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          <div onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
            <button
              type="button"
              onClick={() => setMegaOpen((v) => (hovering.current ? true : !v))}
              aria-expanded={megaOpen}
              aria-controls="le-mega"
              className={`${BAR_ITEM} ${megaOpen ? "text-[#261f15]" : ""}`}
            >
              Services
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
          {BAR_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className={BAR_ITEM}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CALENDLY_BOOKING_URL}
            onClick={(e) => {
              e.preventDefault();
              openCalendly();
            }}
            className="hidden h-10 cursor-pointer items-center justify-center rounded-[4px] bg-[#261f15] px-5 font-sans text-sm font-semibold leading-none text-[#ededd5] transition-colors duration-300 hover:bg-[#4a3421] sm:inline-flex"
          >
            Book a Call
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[4px] border border-[#261f15]/30 text-[#261f15] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mega menu: three columns under the whole bar */}
        <div
          id="le-mega"
          onPointerEnter={hoverOpen}
          onPointerLeave={hoverClose}
          className={`absolute left-0 right-0 top-full hidden px-6 pt-3 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-12 lg:block ${
            megaOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="grid grid-cols-12 gap-8 border border-[#261f15]/10 bg-[#ededd5] p-10 shadow-[0_30px_60px_-30px_rgba(38,31,21,0.45)]">
            {MENU_COLUMNS.map((col, c) => (
              <div key={col.heading} className={c === 0 ? "col-span-5" : c === 1 ? "col-span-3 col-start-7" : "col-span-3"}>
                <p className="font-sans text-sm text-[#6a5f4e]">{col.heading}</p>
                <ul className="mt-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setMegaOpen(false)}
                        className="group/mm block border-t border-[#261f15]/10 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--le-accent)]"
                      >
                        <span className={`block font-heading leading-tight text-[#261f15] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/mm:translate-x-1.5 ${c === 0 ? "text-4xl" : "text-2xl"}`}>
                          {link.label}
                        </span>
                        {link.note && <span className="mt-1 block font-sans text-sm text-[#261f15]/65">{link.note}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`absolute left-4 right-4 top-full mt-2 origin-top overflow-hidden rounded-[6px] border border-[#261f15]/10 bg-[#ededd5] shadow-[0_24px_54px_-24px_rgba(38,31,21,0.5)] transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
          }`}
        >
          <nav aria-label="Mobile" className="flex max-h-[75svh] flex-col overflow-y-auto p-4">
            {MENU_COLUMNS.slice(0, 2).map((col) => (
              <MobileGroup key={col.heading} heading={col.heading} links={col.links} onNavigate={() => setIsMenuOpen(false)} />
            ))}
            {BAR_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-[#261f15]/10 px-3 py-3.5 font-sans text-sm font-medium text-[#261f15]/85"
              >
                {link.label}
              </Link>
            ))}
            <MobileGroup heading={MENU_COLUMNS[2].heading} links={MENU_COLUMNS[2].links} onNavigate={() => setIsMenuOpen(false)} />
            <a
              href={CALENDLY_BOOKING_URL}
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                openCalendly();
              }}
              className="mt-4 inline-flex h-12 cursor-pointer items-center justify-center rounded-[4px] bg-[#261f15] font-sans text-sm font-semibold text-[#ededd5]"
            >
              Book a Call
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
