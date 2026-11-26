import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

/* The client-ready quote as a real PDF. Brand neutral on purpose: it
   carries the caterer's business name and nothing of ours, so they can
   forward it to their client as is. Built with pdf-lib and the standard
   PDF fonts, so the same code runs in the API route (email attachment)
   and in the browser (Download PDF). */

export type QuoteDoc = {
  business: string;
  client: string;
  eventDate: string;
  preparedBy: string;
  email: string;
  phone: string;
  refNum: string;
  refDate: string;
  service: string;
  positioning: string;
  guests: string;
  hours: number;
  miles: number;
  drinks: number;
  carts: number;
  baristas: number;
  base: number;
  travel: number;
  addons: { label: string; amount: number }[];
  total: number;
  perGuest: number;
};

const str = (v: unknown, max = 140) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const num = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v < 1e7 ? v : null;

/* Validates what the browser sent. Returns null when anything is off. */
export function parseQuoteDoc(input: unknown): QuoteDoc | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  const numbers = ["hours", "miles", "drinks", "carts", "baristas", "base", "travel", "total", "perGuest"] as const;
  const n: Record<string, number> = {};
  for (const key of numbers) {
    const v = num(o[key]);
    if (v === null) return null;
    n[key] = v;
  }
  if (!Array.isArray(o.addons) || o.addons.length > 30) return null;
  const addons: QuoteDoc["addons"] = [];
  for (const a of o.addons) {
    const label = str((a as Record<string, unknown>)?.label, 80);
    const amount = num((a as Record<string, unknown>)?.amount);
    if (!label || amount === null) return null;
    addons.push({ label, amount });
  }
  const doc: QuoteDoc = {
    business: str(o.business) || "Mobile Coffee Catering",
    client: str(o.client) || "Your event",
    eventDate: str(o.eventDate, 40) || "To be confirmed",
    preparedBy: str(o.preparedBy),
    email: str(o.email),
    phone: str(o.phone, 40),
    refNum: str(o.refNum, 24),
    refDate: str(o.refDate, 40),
    service: str(o.service, 60),
    positioning: str(o.positioning, 60),
    guests: str(o.guests, 12),
    hours: n.hours,
    miles: n.miles,
    drinks: n.drinks,
    carts: n.carts,
    baristas: n.baristas,
    base: n.base,
    travel: n.travel,
    addons,
    total: n.total,
    perGuest: n.perGuest,
  };
  if (!doc.refNum || !doc.service || !doc.guests) return null;
  return doc;
}

export const quoteMoney = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function quoteFileName(doc: QuoteDoc) {
  return `${doc.refNum}-event-quote.pdf`;
}

const INK = rgb(38 / 255, 31 / 255, 21 / 255);
const MUTED = rgb(0.42, 0.38, 0.32);
const HAIR = rgb(0.8, 0.78, 0.74);

export async function buildQuotePdf(doc: QuoteDoc): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${doc.business}: Event Quote ${doc.refNum}`);
  pdf.setAuthor(doc.business);
  pdf.setCreator(doc.business);
  pdf.setProducer("");

  const W = 612;
  const H = 792;
  const M = 60;
  const page = pdf.addPage([W, H]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  /* the standard fonts only cover Latin-1; drop anything they cannot draw */
  const charset = new Set(sans.getCharacterSet());
  const safe = (s: string) =>
    Array.from(s.normalize("NFC"))
      .filter((ch) => charset.has(ch.codePointAt(0) as number))
      .join("");

  const widthOf = (text: string, font: PDFFont, size: number, tracking = 0) =>
    font.widthOfTextAtSize(text, size) + tracking * Math.max(0, text.length - 1);

  type Opts = { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; tracking?: number; align?: "left" | "right" | "center" };
  /* y is measured from the top of the page; `off` pushes everything
     below the masthead down when the business name needs two lines */
  let off = 0;
  const text = (raw: string, x: number, yTop: number, o: Opts = {}) => {
    const y = yTop + off;
    const font = o.font ?? sans;
    const size = o.size ?? 10;
    const tracking = o.tracking ?? 0;
    const s = safe(raw);
    const w = widthOf(s, font, size, tracking);
    let cx = o.align === "right" ? x - w : o.align === "center" ? x - w / 2 : x;
    if (!tracking) {
      page.drawText(s, { x: cx, y: H - y, size, font, color: o.color ?? INK });
      return;
    }
    for (const ch of s) {
      page.drawText(ch, { x: cx, y: H - y, size, font, color: o.color ?? INK });
      cx += font.widthOfTextAtSize(ch, size) + tracking;
    }
  };
  const fit = (raw: string, font: PDFFont, size: number, max: number) => {
    let s = safe(raw);
    if (widthOf(s, font, size) <= max) return s;
    while (s.length > 1 && widthOf(s + "...", font, size) > max) s = s.slice(0, -1);
    return s.trimEnd() + "...";
  };
  const rule = (y: number, x1 = M, x2 = W - M, thickness = 0.5, color = HAIR, dash?: number[]) =>
    page.drawLine({ start: { x: x1, y: H - y - off }, end: { x: x2, y: H - y - off }, thickness, color, dashArray: dash });
  const label = (s: string, x: number, y: number, align: Opts["align"] = "left") =>
    text(s.toUpperCase(), x, y, { font: bold, size: 7, tracking: 1.6, color: MUTED, align });

  /* masthead */
  label("Event Quote", M, 78);
  text(doc.refNum, W - M, 78, { font: bold, size: 8, tracking: 1.2, align: "right" });
  text(`Issued ${doc.refDate}`.toUpperCase(), W - M, 92, { size: 7, tracking: 1.2, color: MUTED, align: "right" });

  let nameSize = 32;
  const nameMax = W - M * 2;
  const name = safe(doc.business);
  while (nameSize > 24 && widthOf(name, serif, nameSize) > nameMax) nameSize -= 1;
  if (widthOf(name, serif, nameSize) <= nameMax) {
    text(name, M, 128, { font: serif, size: nameSize });
  } else {
    /* a long name wraps onto a second line instead of being cut */
    const words = name.split(/\s+/);
    let first = "";
    while (words.length && widthOf(`${first} ${words[0]}`.trim(), serif, nameSize) <= nameMax)
      first = `${first} ${words.shift()}`.trim();
    if (!first) first = words.shift() ?? "";
    text(fit(first, serif, nameSize, nameMax), M, 124, { font: serif, size: nameSize });
    text(fit(words.join(" "), serif, nameSize, nameMax), M, 124 + nameSize + 3, { font: serif, size: nameSize });
    off = nameSize + 3;
  }

  rule(146, M, W - M, 1.5, INK);
  rule(149.5, M, W - M, 0.5, INK);

  /* prepared for / by */
  const col2 = W / 2 + 14;
  const colW = W / 2 - M - 14;
  label("Prepared for", M, 180);
  text(fit(doc.client, sans, 12, colW), M, 199, { size: 12 });
  text(`Event date: ${doc.eventDate}`, M, 215, { size: 9, color: MUTED });
  label("Prepared by", col2, 180);
  text(fit(doc.preparedBy, sans, 12, colW), col2, 199, { size: 12 });
  text(fit([doc.email, doc.phone].filter(Boolean).join("  |  "), sans, 9, colW), col2, 215, { size: 9, color: MUTED });

  /* event details: two columns of dotted rows */
  label("Event details", M, 258);
  const details: [string, string][] = [
    ["Service", doc.service],
    ["Positioning", doc.positioning],
    ["Guests", doc.guests],
    ["Service duration", plural(doc.hours, "hour")],
    ["Travel allotted", plural(doc.miles, "mile")],
    ["Estimated drinks", `About ${doc.drinks}`],
    ["On-site setup", `${plural(doc.carts, "cart")}, ${plural(doc.baristas, "barista")}`],
  ];
  const rowsPerCol = Math.ceil(details.length / 2);
  details.forEach(([k, v], i) => {
    const c = i < rowsPerCol ? 0 : 1;
    const r = c === 0 ? i : i - rowsPerCol;
    const x1 = c === 0 ? M : col2;
    const x2 = c === 0 ? W / 2 - 14 : W - M;
    const y = 284 + r * 24;
    text(k, x1, y, { size: 9.5, color: MUTED });
    text(fit(v, bold, 9.5, x2 - x1 - 110), x2, y, { font: bold, size: 9.5, align: "right" });
    rule(y + 8, x1, x2, 0.5, MUTED, [1, 2.5]);
  });

  /* investment ledger */
  let y = 284 + rowsPerCol * 24 + 30;
  label("Investment", M, y);
  y += 26;
  const lines: [string, number][] = [["Base service", doc.base]];
  if (doc.travel > 0) lines.push(["Travel", doc.travel]);
  for (const a of doc.addons) lines.push([a.label, a.amount]);
  const rowH = lines.length > 10 ? 15 : lines.length > 6 ? 21 : 26;
  const rowSize = lines.length > 10 ? 8.5 : 10.5;
  for (const [k, v] of lines) {
    text(fit(k, sans, rowSize, W - M * 2 - 90), M, y, { size: rowSize });
    text(quoteMoney(v), W - M, y, { size: rowSize, align: "right" });
    rule(y + rowH * 0.36);
    y += rowH;
  }
  /* the heavy rule sits where the last hairline was */
  const totalRule = y - rowH * 0.64;
  rule(totalRule, M, W - M, 1.5, INK);
  y = totalRule + 30;
  text("Total", M, y, { font: serif, size: 22 });
  text(quoteMoney(doc.total), W - M, y, { font: serif, size: 22, align: "right" });
  text(`${quoteMoney(doc.perGuest)} per guest`, W - M, y + 18, { size: 9, color: MUTED, align: "right" });

  /* foot */
  off = 0;
  rule(H - 62);
  label("Quote valid 14 days", W / 2, H - 46, "center");

  return pdf.save();
}
