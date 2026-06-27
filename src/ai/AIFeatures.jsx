import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Check, Copy, Send, Sparkles, X } from "lucide-react";

/**
 * ai/AIFeatures.jsx
 * ──────────────────
 * All AI-powered components for tobiodeyemi's site.
 * Built to match the EXACT existing design system found in styles.css:
 *   - ivory: #f5f1e8   deep: #021b16   gold: #c8a96b / #e6c27a / #987a2f
 *   - Reuses existing classes: section-eyebrow, section-title, section-rule,
 *     section-copy, luxury-outline, book-button, content-section, section-inner
 *
 * Styling for genuinely new UI (chat bubbles, score cards, pills) lives in
 * ai-features.css — imported once here so nothing needs manual wiring.
 */

import "./ai-features.css";

const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

async function askClaude({ system, messages, maxTokens = 500 }) {
  const res = await fetch(ANTHROPIC_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  });
  const data = await res.json();
  return data.content?.find((b) => b.type === "text")?.text || "";
}

function parseJSON(raw, fallback) {
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return fallback;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   1. AI BOOKING ASSISTANT — conversational lead qualifier
   ────────────────────────────────────────────────────────────────────────── */
const BOOKING_SYSTEM = `You are Tobi Odeyemi's booking assistant. Tobi is a premium saxophonist based in Johannesburg, South Africa. Genres: Contemporary Jazz, Afro Fusion, Afro Pop, Soul & R&B, Gospel. Pricing: Private Function R10,000 | Corporate Event R15,000 | Full Evening R7,500. 50% deposit confirms booking, balance due on event day. Travels across South Africa, international on request.
Your job: warmly greet, then ask for event type → date → guest count → venue/location → genre preference → name and contact. Keep replies to 2-3 sentences. Be elegant and warm, like a high-end concierge. Once you have the details, summarise and say you'll pass it to Tobi directly.`;

export function AIBookingAssistant() {
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Hello! I'm here to help you book Tobi for your event. What type of occasion are you planning?" },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const logRef = React.useRef(null);

  React.useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await askClaude({ system: BOOKING_SYSTEM, messages: next });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Please WhatsApp Tobi directly on 073 507 4691." }]);
    }
    setLoading(false);
  }

  return (
    <div className="ai-panel">
      <span className="ai-badge"><Sparkles size={13} /> AI Booking Assistant</span>
      <div className="ai-chat-log" ref={logRef}>
        {messages.map((m, i) => (
          <div className={`ai-bubble ${m.role}`} key={i}>{m.content}</div>
        ))}
        {loading && <div className="ai-bubble assistant"><span className="ai-dot" /><span className="ai-dot" /><span className="ai-dot" /></div>}
      </div>
      <div className="ai-input-row">
        <input
          className="ai-input"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="ai-send" type="button" onClick={send} disabled={loading || !input.trim()} aria-label="Send">
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   2. VIBE RECOMMENDER — genre quiz
   ────────────────────────────────────────────────────────────────────────── */
const VIBE_QUESTIONS = [
  { q: "What type of event is it?", options: ["Wedding", "Corporate Gala", "Private Dinner", "Birthday", "Church Service", "Hotel / Restaurant Night"] },
  { q: "What's the desired atmosphere?", options: ["Romantic & Elegant", "Upbeat & Festive", "Sophisticated & Cool", "Spiritual & Moving", "Relaxed & Soulful"] },
  { q: "Who's the guest list?", options: ["Mixed / All ages", "Young professionals", "Corporate executives", "Faith community", "International guests"] },
];

export function VibeRecommender() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  async function pick(opt) {
    const next = [...answers, opt];
    if (step < VIBE_QUESTIONS.length - 1) {
      setAnswers(next);
      setStep((s) => s + 1);
      return;
    }
    setAnswers(next);
    setLoading(true);
    try {
      const res = await askClaude({
        system: `You are Tobi Odeyemi's music advisor. Genres available: Contemporary Jazz, Afro Fusion, Afro Pop, Soul & R&B, Gospel. Respond ONLY as JSON: {"genre":"...","why":"2 sentences","cta":"short call to action"}`,
        messages: [{ role: "user", content: `Event: ${next[0]}. Atmosphere: ${next[1]}. Guests: ${next[2]}.` }],
        maxTokens: 250,
      });
      setResult(parseJSON(res, { genre: "Contemporary Jazz & Afro Fusion", why: "A versatile blend perfect for elegant occasions.", cta: "Book this vibe" }));
    } catch {
      setResult({ genre: "Contemporary Jazz & Afro Fusion", why: "A versatile blend perfect for elegant occasions.", cta: "Book this vibe" });
    }
    setLoading(false);
  }

  function reset() { setStep(0); setAnswers([]); setResult(null); }

  return (
    <div className="ai-panel">
      <span className="ai-badge"><Sparkles size={13} /> AI Genre Advisor</span>
      {!result && !loading && (
        <>
          <div className="ai-progress">
            {VIBE_QUESTIONS.map((_, i) => <span className={i <= step ? "on" : ""} key={i} />)}
          </div>
          <p className="ai-question">{VIBE_QUESTIONS[step].q}</p>
          <div className="ai-pill-row">
            {VIBE_QUESTIONS[step].options.map((opt) => (
              <button className="ai-pill" type="button" onClick={() => pick(opt)} key={opt}>{opt}</button>
            ))}
          </div>
        </>
      )}
      {loading && <div className="ai-loading">Finding your perfect sound…</div>}
      {result && (
        <div className="ai-result-card">
          <span className="ai-result-label">Your Recommended Set</span>
          <strong className="ai-result-genre">{result.genre}</strong>
          <p>{result.why}</p>
          <div className="ai-result-actions">
            <a className="book-button" href="#book">{result.cta || "Book This Vibe"} <ArrowRight size={16} /></a>
            <button className="luxury-outline light" type="button" onClick={reset}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3. SMART QUOTE ENGINE
   ────────────────────────────────────────────────────────────────────────── */
const BASE_PRICE = { "Private Function": 10000, "Corporate Event": 15000, "Full Evening": 7500, Wedding: 12000, "Hotel Residency": 8000 };
const EXTRAS = [
  { id: "pa", label: "PA / Sound system", price: 1500 },
  { id: "travel", label: "Travel outside JHB", price: 2000 },
  { id: "ot", label: "Extra set (overtime)", price: 3500 },
];
const money = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });

export function SmartQuoteEngine() {
  const [type, setType] = React.useState("Corporate Event");
  const [xtr, setXtr] = React.useState([]);
  const [quote, setQuote] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  function toggle(id) {
    setXtr((x) => (x.includes(id) ? x.filter((v) => v !== id) : [...x, id]));
  }

  async function generate() {
    setLoading(true);
    const base = BASE_PRICE[type];
    const extrasTotal = xtr.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price || 0), 0);
    try {
      const res = await askClaude({
        system: `You are Tobi's booking manager. Respond ONLY as JSON: {"summary":"2 sentences","note":"1 tip"}`,
        messages: [{ role: "user", content: `Event: ${type}. Extras: ${xtr.map((id) => EXTRAS.find((e) => e.id === id)?.label).join(", ") || "none"}. Base: R${base}.` }],
        maxTokens: 200,
      });
      const parsed = parseJSON(res, { summary: `Premium saxophone performance for your ${type.toLowerCase()}.`, note: "50% deposit secures your date." });
      setQuote({ ...parsed, base, extrasTotal, total: base + extrasTotal });
    } catch {
      setQuote({ summary: `Premium saxophone performance for your ${type.toLowerCase()}.`, note: "50% deposit secures your date.", base, extrasTotal, total: base + extrasTotal });
    }
    setLoading(false);
  }

  return (
    <div className="ai-panel">
      <span className="ai-badge"><Sparkles size={13} /> Smart Quote Engine</span>
      <select className="ai-select" value={type} onChange={(e) => setType(e.target.value)}>
        {Object.keys(BASE_PRICE).map((t) => <option key={t}>{t}</option>)}
      </select>
      <div className="ai-pill-row" style={{ marginTop: "0.85rem" }}>
        {EXTRAS.map((ex) => (
          <button
            className={`ai-pill ${xtr.includes(ex.id) ? "active" : ""}`}
            type="button"
            onClick={() => toggle(ex.id)}
            key={ex.id}
          >
            {ex.label} +{money.format(ex.price)}
          </button>
        ))}
      </div>
      <button className="book-button" type="button" onClick={generate} disabled={loading} style={{ marginTop: "1.2rem" }}>
        {loading ? "Calculating..." : "Generate My Quote"}
      </button>
      {quote && (
        <div className="ai-result-card">
          <p>{quote.summary}</p>
          <div className="ai-quote-lines">
            <span>Base fee <strong>{money.format(quote.base)}</strong></span>
            {quote.extrasTotal > 0 && <span>Add-ons <strong>{money.format(quote.extrasTotal)}</strong></span>}
            <span className="ai-quote-total">Estimated Total <strong>{money.format(quote.total)}</strong></span>
          </div>
          <p className="ai-quote-note">{quote.note}</p>
          <a className="book-button" href="#book">Confirm This Booking <ArrowRight size={16} /></a>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   4. TESTIMONIAL ENGINE — refreshes existing reviews into new social copy
   ────────────────────────────────────────────────────────────────────────── */
export function TestimonialEngine({ reviews }) {
  const [snippets, setSnippets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await askClaude({
        system: `You are a luxury brand copywriter for Tobi Odeyemi, premium saxophonist. Craft 3 punchy re-worded social proof quotes (max 22 words each, different wording from originals). Respond ONLY as JSON array: [{"quote":"...","name":"...","event":"..."}]`,
        messages: [{ role: "user", content: JSON.stringify(reviews.map((r) => ({ name: r.name, event: r.event, text: r.text }))) }],
        maxTokens: 350,
      });
      setSnippets(parseJSON(res, reviews.slice(0, 3).map((r) => ({ quote: r.text, name: r.name, event: r.event }))));
    } catch {
      setSnippets(reviews.slice(0, 3).map((r) => ({ quote: r.text, name: r.name, event: r.event })));
    }
    setLoading(false);
  }

  return (
    <div className="ai-panel">
      <span className="ai-badge"><Sparkles size={13} /> AI Social Proof Engine</span>
      {snippets.length === 0 ? (
        <button className="luxury-outline light" type="button" onClick={generate} disabled={loading}>
          {loading ? "Crafting quotes..." : "Generate Fresh Testimonials"}
        </button>
      ) : (
        <>
          <div className="ai-quote-grid">
            {snippets.map((s, i) => (
              <div className="ai-quote-card" key={i}>
                <p>"{s.quote}"</p>
                <strong>{s.name}</strong>
                <span>{s.event}</span>
              </div>
            ))}
          </div>
          <button className="luxury-outline light" type="button" onClick={() => { setSnippets([]); generate(); }} style={{ marginTop: "1rem" }}>
            Refresh Quotes
          </button>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   5. FLOATING ENQUIRY BOT — launcher bubble + chat panel for bookings & enquiries
   ────────────────────────────────────────────────────────────────────────── */
const ENQUIRY_SYSTEM = `You are Tobi Odeyemi's booking enquiry assistant, available as a floating chat widget on his website. Tobi is a premium saxophonist based in Johannesburg. Genres: Contemporary Jazz, Afro Fusion, Afro Pop, Soul & R&B, Gospel. Pricing: Private Function R10,000 | Corporate Event R15,000 | Hotel/Restaurant Residencies custom rate. Standard performance 1-2 hours, 2-3 sets for galas/weddings. Travels across South Africa, international on request. 50% deposit, balance on event day. Book 3-4 weeks ahead, peak season Oct-Dec and April. Contact: tobisax@gmail.com | 073 507 4691.
Your job: answer questions about pricing, availability and genres briefly (2-3 sentences), and gently guide visitors with a real booking interest toward sharing their event type, date, and contact details so Tobi can follow up directly. Be warm or able to say tell them to use the booking form below for fastest service if they want a comprehensive option.`;

export function FloatingEnquiryBot() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Hi! I'm Tobi's virtual booking assistant. 🎷" },
    { role: "assistant", content: "Ask me about pricing, availability, genres or how to book." },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const logRef = React.useRef(null);

  React.useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, open]);

  async function ask(q) {
    const question = q || input.trim();
    if (!question || loading) return;
    const next = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await askClaude({ system: ENQUIRY_SYSTEM, messages: next, maxTokens: 220 });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "WhatsApp Tobi on 073 507 4691 for immediate help." }]);
    }
    setLoading(false);
  }

  const quickQ = [
    "What services do you offer?",
    "How do I book?",
    "What are your prices?",
    "Where are you located?",
    "Do you travel outside JHB?",
    "What genres do you play?",
  ];

  return (
    <>
      <button
        className="enquiry-launcher"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close booking assistant" : "Open booking assistant"}
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <Bot size={26} />}
        {!open && <span className="enquiry-launcher-ping" aria-hidden="true" />}
      </button>

      {open && (
        <div className="enquiry-panel">
          <div className="enquiry-panel-head">
            <div className="enquiry-panel-identity">
              <span className="enquiry-avatar"><Bot size={20} /></span>
              <div>
                <strong>Tobi's Assistant</strong>
                <span className="enquiry-status"><i /> Online</span>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
          </div>

          <div className="ai-chat-log" ref={logRef}>
            {messages.map((m, i) => <div className={`ai-bubble ${m.role}`} key={i}>{m.content}</div>)}
            {loading && <div className="ai-bubble assistant"><span className="ai-dot" /><span className="ai-dot" /><span className="ai-dot" /></div>}
          </div>

          <div className="enquiry-quick-grid">
            {quickQ.map((q) => (
              <button className="enquiry-quick-pill" type="button" onClick={() => ask(q)} disabled={loading} key={q}>{q}</button>
            ))}
          </div>

          <div className="ai-input-row">
            <input className="ai-input" value={input} placeholder="Ask me anything..." onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} />
            <button className="ai-send" type="button" onClick={() => ask()} disabled={loading || !input.trim()} aria-label="Ask"><Send size={17} /></button>
          </div>
          <a href="#book" className="enquiry-panel-cta" onClick={() => setOpen(false)}>Go to full booking form <ArrowRight size={14} /></a>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   6. CONTENT CALENDAR — admin only
   ────────────────────────────────────────────────────────────────────────── */
export function ContentCalendar() {
  const [gigs, setGigs] = React.useState("");
  const [genre, setGenre] = React.useState("Afro Fusion");
  const [cal, setCal] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await askClaude({
        system: `You are Tobi Odeyemi's social strategist (@officialtobiodeyemi). Generate a 7-day Instagram content calendar. Brand: luxury saxophonist, deep green & gold, Johannesburg. Respond ONLY as JSON array (7 items): [{"day":"Mon","type":"Reel","caption":"max 35 words","hashtags":"5 tags","time":"..."}]`,
        messages: [{ role: "user", content: `Upcoming gigs: ${gigs || "none"}. Focus genre: ${genre}.` }],
        maxTokens: 700,
      });
      setCal(parseJSON(res, null));
    } catch { setCal(null); }
    setLoading(false);
  }

  return (
    <div className="ai-panel">
      <span className="ai-badge"><Sparkles size={13} /> AI Content Strategist · Admin</span>
      <input className="ai-input" style={{ width: "100%", marginBottom: "0.75rem" }} value={gigs} onChange={(e) => setGigs(e.target.value)} placeholder="Upcoming gigs this week (optional)" />
      <select className="ai-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
        {["Afro Fusion", "Contemporary Jazz", "Gospel", "Afro Pop", "Soul & R&B"].map((g) => <option key={g}>{g}</option>)}
      </select>
      <button className="book-button" type="button" onClick={generate} disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Building calendar..." : "Generate This Week's Content"}
      </button>
      {cal && (
        <div className="ai-calendar">
          {cal.map((d, i) => (
            <div className="ai-cal-row" key={i}>
              <span className="ai-cal-day">{d.day}</span>
              <div>
                <span className="ai-cal-type">{d.type}</span>
                <p>{d.caption}</p>
                <em>{d.hashtags}</em>
              </div>
              <span className="ai-cal-time">{d.time}</span>
            </div>
          ))}
          <button
            className="luxury-outline light"
            type="button"
            style={{ marginTop: "1rem" }}
            onClick={() => {
              navigator.clipboard.writeText(cal.map((d) => `${d.day} (${d.type}, ${d.time})\n${d.caption}\n${d.hashtags}`).join("\n\n"));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <Copy size={16} /> {copied ? "Copied!" : "Copy All"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   7. LEAD SCORER — admin only
   ────────────────────────────────────────────────────────────────────────── */
export function LeadScorer() {
  const [form, setForm] = React.useState({ name: "", type: "Corporate Event", date: "", guests: "", notes: "" });
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  async function score() {
    setLoading(true);
    try {
      const res = await askClaude({
        system: `You are Tobi Odeyemi's booking manager. Score leads and draft follow-ups. Respond ONLY as JSON: {"score":1-10,"tier":"Hot|Warm|Cold","priority":"High|Medium|Low","reason":"1 sentence","followup":"3-sentence WhatsApp message from Tobi, warm and professional, ending with a clear next step"}`,
        messages: [{ role: "user", content: `Name: ${form.name}. Event: ${form.type}. Date: ${form.date || "TBC"}. Guests: ${form.guests || "unknown"}. Notes: ${form.notes || "none"}.` }],
        maxTokens: 350,
      });
      setResult(parseJSON(res, { score: 6, tier: "Warm", priority: "Medium", reason: "Standard enquiry.", followup: `Hi ${form.name || "there"}! Thanks for reaching out — I'd love to chat about your event. When's a good time to connect?` }));
    } catch {
      setResult({ score: 6, tier: "Warm", priority: "Medium", reason: "Standard enquiry.", followup: `Hi ${form.name || "there"}! Thanks for reaching out — I'd love to chat about your event. When's a good time to connect?` });
    }
    setLoading(false);
  }

  return (
    <div className="ai-panel">
      <span className="ai-badge"><Sparkles size={13} /> AI Lead Intelligence · Admin</span>
      <div className="ai-form-grid">
        <input className="ai-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Client name" />
        <select className="ai-select" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
          {["Corporate Event", "Wedding", "Private Function", "Hotel Residency", "Other"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <input className="ai-input" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        <input className="ai-input" value={form.guests} onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))} placeholder="Guest count" />
      </div>
      <textarea className="ai-textarea" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Paste enquiry notes..." />
      <button className="book-button" type="button" onClick={score} disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Analysing..." : "Score This Lead"}
      </button>
      {result && (
        <div className="ai-result-card">
          <div className="ai-score-row">
            <div><strong>{result.score}/10</strong><span>Score</span></div>
            <div><strong>{result.tier}</strong><span>Tier</span></div>
            <div><strong>{result.priority}</strong><span>Priority</span></div>
          </div>
          <p className="ai-quote-note">{result.reason}</p>
          <p className="ai-followup">{result.followup}</p>
          <div className="ai-result-actions">
            <button
              className="luxury-outline light"
              type="button"
              onClick={() => { navigator.clipboard.writeText(result.followup); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            >
              <Copy size={16} /> {copied ? "Copied!" : "Copy Message"}
            </button>
            <a className="book-button" href={`https://wa.me/?text=${encodeURIComponent(result.followup)}`} target="_blank" rel="noreferrer">
              Open in WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   8. RESIDENCY PITCH GENERATOR — admin only
   ────────────────────────────────────────────────────────────────────────── */
export function ResidencyPitchGenerator() {
  const [venue, setVenue] = React.useState("");
  const [vibe, setVibe] = React.useState("Sophisticated & Upscale");
  const [pitch, setPitch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  async function generate() {
    if (!venue.trim()) return;
    setLoading(true);
    try {
      const res = await askClaude({
        system: `Write a professional residency pitch email for Tobi Odeyemi, premium saxophonist, 20+ years experience, performed for President Cyril Ramaphosa, Sun International, Montecasino. Genres: Contemporary Jazz, Afro Fusion. Contact tobisax@gmail.com, 073 507 4691. Warm, confident, under 180 words. No subject line, just the body.`,
        messages: [{ role: "user", content: `Venue: ${venue}. Vibe: ${vibe}.` }],
        maxTokens: 450,
      });
      setPitch(res.trim());
    } catch {
      setPitch(`Dear ${venue} Team,\n\nI'm Tobi Odeyemi, a Johannesburg-based saxophonist with 20+ years of experience performing for premium audiences including Sun International and Montecasino.\n\nI'd love to bring a ${vibe.toLowerCase()} saxophone residency to ${venue}. I bring my own equipment and tailor every set to your space.\n\nLooking forward to connecting.\n\nTobi Odeyemi\ntobisax@gmail.com | 073 507 4691`);
    }
    setLoading(false);
  }

  return (
    <div className="ai-panel">
      <span className="ai-badge"><Sparkles size={13} /> AI Pitch Writer · Admin</span>
      <div className="ai-form-grid">
        <input className="ai-input" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue name" />
        <select className="ai-select" value={vibe} onChange={(e) => setVibe(e.target.value)}>
          {["Sophisticated & Upscale", "Vibrant & Afrocentric", "Relaxed & Soulful", "Modern & Corporate"].map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <button className="book-button" type="button" onClick={generate} disabled={loading || !venue.trim()} style={{ marginTop: "1rem" }}>
        {loading ? "Writing pitch..." : "Generate Pitch Email"}
      </button>
      {pitch && (
        <div className="ai-result-card">
          <pre className="ai-pitch-text">{pitch}</pre>
          <div className="ai-result-actions">
            <button className="luxury-outline light" type="button" onClick={() => { navigator.clipboard.writeText(pitch); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
              <Copy size={16} /> {copied ? "Copied!" : "Copy Email"}
            </button>
            <button className="luxury-outline light" type="button" onClick={() => setPitch("")}>New Pitch</button>
          </div>
        </div>
      )}
    </div>
  );
}
