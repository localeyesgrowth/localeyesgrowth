import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildQuotePdf,
  parseQuoteDoc,
  plural,
  quoteFileName,
  quoteMoney,
  type QuoteDoc,
} from "../../../lib/quote-pdf";

type LeadPayload = {
  lead: {
    name: string;
    email: string;
    business: string;
    phone?: string;
    client?: string;
    date?: string;
  };
  summary: string;
  /* the client-ready quote document, turned into the attached PDF */
  quote?: unknown;
  /* pricing notes for the caterer only, never shown on the client's copy */
  notes?: { low?: number; high?: number; perDrink?: number; drinksPerHour?: number };
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;

const SANS = "Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

/* The email to the caterer. Tables and inline styles only, so it holds
   up in Gmail, Outlook and Apple Mail. */
function buildEmailHtml(name: string, doc: QuoteDoc, notes: LeadPayload["notes"]) {
  const cell = `padding:9px 0;border-bottom:1px solid #d9d6bf;font-family:${SANS};font-size:14px;`;
  const row = (k: string, v: string) =>
    `<tr><td style="${cell}color:#6a5f4e;">${esc(k)}</td><td align="right" style="${cell}font-weight:600;color:#261f15;">${esc(v)}</td></tr>`;
  const label = `margin:0;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#6a5f4e;`;
  const para = `font-family:${SANS};font-size:15px;line-height:1.6;color:#261f15;`;
  const total = `padding:16px 0 0;font-family:${SERIF};font-size:22px;color:#261f15;`;
  const noteLines = [
    finite(notes?.low) && finite(notes?.high)
      ? `Market range for this event: ${quoteMoney(notes.low)} to ${quoteMoney(notes.high)}`
      : "",
    finite(notes?.perDrink) ? `That works out to $${notes.perDrink.toFixed(2)} per drink` : "",
    finite(notes?.drinksPerHour)
      ? `Staffing is based on about ${Math.round(notes.drinksPerHour)} drinks an hour`
      : "",
  ].filter(Boolean);
  const notesBlock = noteLines.length
    ? `<tr><td style="padding:28px 36px 0;">
  <p style="${label}">For your eyes only</p>
  ${noteLines.map((l) => `<p style="margin:8px 0 0;${para}font-size:14px;">${esc(l)}</p>`).join("")}
</td></tr>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#ededd5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ededd5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#f4f1e3;border:1px solid #d9d6bf;">
<tr><td style="padding:36px 36px 8px;">
  <p style="${label}">LocalEyes Coffee Catering Price Calculator</p>
  <h1 style="margin:14px 0 0;font-family:${SERIF};font-weight:400;font-size:30px;line-height:1.15;color:#261f15;">Your client-ready quote is attached</h1>
  <p style="margin:18px 0 0;${para}">Hi ${esc(name)},</p>
  <p style="margin:10px 0 0;${para}">Quote ${esc(doc.refNum)} is attached as a PDF. It carries the ${esc(doc.business)} name only, so you can forward it to your client as it is.</p>
</td></tr>
<tr><td style="padding:20px 36px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Prepared for", doc.client)}
    ${row("Event date", doc.eventDate)}
    ${row("Service", `${doc.service}, ${doc.positioning}`)}
    ${row("Guests", doc.guests)}
    ${row("Duration", plural(doc.hours, "hour"))}
    ${row("Setup", `${plural(doc.carts, "cart")}, ${plural(doc.baristas, "barista")}`)}
    <tr><td style="${total}">Total</td><td align="right" style="${total}">${quoteMoney(doc.total)}</td></tr>
    <tr><td></td><td align="right" style="padding:2px 0 0;font-family:${SANS};font-size:12px;color:#6a5f4e;">${quoteMoney(doc.perGuest)} per guest</td></tr>
  </table>
</td></tr>
${notesBlock}
<tr><td style="padding:28px 36px 36px;">
  <a href="https://www.localeyesgrowth.com/coffee-cart-pricing-calculator" style="display:inline-block;background:#261f15;color:#ededd5;font-family:${SANS};font-size:14px;font-weight:600;text-decoration:none;padding:13px 22px;border-radius:4px;">Price another event</a>
  <p style="margin:24px 0 0;font-family:${SANS};font-size:12px;line-height:1.6;color:#6a5f4e;">Sent by LocalEyes, the growth agency for event caterers. Reply to this email if anything looks off.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { lead, summary } = body ?? {};
  if (!lead?.email || !lead?.name?.trim() || !lead?.business?.trim() || !summary) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!EMAIL_RE.test(lead.email.trim())) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const doc = parseQuoteDoc(body.quote);
  if (!doc) {
    return NextResponse.json({ error: "Missing quote details." }, { status: 400 });
  }

  let pdf: Uint8Array;
  try {
    pdf = await buildQuotePdf(doc);
  } catch (error) {
    console.error("Quote PDF build failed:", error);
    return NextResponse.json({ error: "Failed to build the quote." }, { status: 500 });
  }

  /* plain-text fallback for mail clients that do not show HTML */
  const text = [
    `Hi ${lead.name.trim()},`,
    ``,
    `Your client-ready quote ${doc.refNum} is attached as a PDF. It carries your business name only, so you can forward it to your client as it is.`,
    ``,
    summary,
    ``,
    `Business: ${lead.business.trim()}`,
    lead.client?.trim() ? `Client / event: ${lead.client.trim()}` : null,
    lead.date?.trim() ? `Event date: ${lead.date.trim()}` : null,
    lead.phone?.trim() ? `Phone: ${lead.phone.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "LocalEyes Growth <quotes@localeyesgrowth.com>",
      to: lead.email.trim(),
      replyTo: "hello@localeyesgrowth.com",
      subject: `Your client-ready quote ${doc.refNum} | LocalEyes`,
      text,
      html: buildEmailHtml(lead.name.trim(), doc, body.notes),
      attachments: [{ filename: quoteFileName(doc), content: Buffer.from(pdf) }],
    });

    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
    }
  } catch (error) {
    console.error("Resend send failed:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
  }

  /* Best-effort — log this quote request to Google Sheets too (separate
     tab from the growth diagnostic quiz). Never fails the request just
     because the sheet forward failed; the email already sent. */
  const sheetUrl = process.env.SHEETS_WEBHOOK_URL;
  if (sheetUrl) {
    try {
      await fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "quote",
          submittedAt: new Date().toISOString(),
          name: lead.name.trim(),
          email: lead.email.trim(),
          business: lead.business.trim(),
          phone: lead.phone?.trim() || "",
          client: lead.client?.trim() || "",
          date: lead.date?.trim() || "",
          summary,
        }),
      });
    } catch (error) {
      console.error("Failed to forward quote request to sheet webhook:", error);
    }
  } else {
    console.warn("SHEETS_WEBHOOK_URL is not set, quote request not recorded in a sheet.");
  }

  return NextResponse.json({ ok: true });
}
