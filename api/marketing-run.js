const RESEND_ENDPOINT = "https://api.resend.com/emails";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";

const AGENTS = [
  {
    name: "Marketing Director",
    duty: "Choose the weekly booking-growth focus and coordinate specialist agents.",
  },
  {
    name: "SEO Growth Agent",
    duty: "Find organic search opportunities that can increase qualified booking enquiries across South Africa.",
  },
  {
    name: "Instagram Content Agent",
    duty: "Turn performances, testimonials and event footage into booking-driven posts, reels and stories.",
  },
  {
    name: "Venue Partnership Agent",
    duty: "Create partnership and residency outreach ideas for hotels, restaurants, venues and planners.",
  },
  {
    name: "Paid Ads Agent",
    duty: "Draft paid campaign angles for Google, Instagram and retargeting without spending money automatically.",
  },
  {
    name: "Lead Nurture Agent",
    duty: "Draft warm follow-up language that helps convert enquiries into confirmed bookings.",
  },
  {
    name: "Quality Control Agent",
    duty: "Check brand fit, accuracy, risk and whether human approval is required before anything is sent or published.",
  },
];

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function sanitize(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return sanitize(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function authOk(req) {
  const adminSecret = process.env.MARKETING_ADMIN_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const headerSecret = req.headers["x-marketing-secret"] || req.headers["x-admin-secret"];
  const authHeader = req.headers.authorization || "";
  const querySecret = req.query && req.query.secret;

  if (cronSecret && authHeader === "Bearer " + cronSecret) return true;
  if (adminSecret && (headerSecret === adminSecret || querySecret === adminSecret)) return true;

  return !adminSecret && !cronSecret;
}

function getRunContext(body) {
  const now = new Date();
  return {
    runType: sanitize(body.runType) || "weekly",
    focus: sanitize(body.focus) || "increase qualified saxophone booking enquiries across South Africa",
    bookingSegments: sanitize(body.bookingSegments) || "corporate events, weddings, private functions, hotels, restaurants, exclusive venues",
    notes: sanitize(body.notes) || "Prioritize actions that can lead to enquiries through the website booking form or direct Gmail follow-up.",
    date: now.toISOString(),
  };
}

function fallbackReport(context) {
  return {
    summary: "Marketing agents prepared a booking-growth plan focused on qualified enquiries, venue partnerships, SEO visibility and lead conversion.",
    bookingFocus: context.focus,
    agentOutputs: [
      {
        agent: "Marketing Director",
        priority: "Focus this week on corporate events, premium private functions and venue residencies because they can create higher-value or repeat bookings.",
        actions: ["Prepare one corporate booking offer", "Draft one hotel/restaurant residency outreach batch", "Review enquiry responses within 24 hours"],
      },
      {
        agent: "SEO Growth Agent",
        priority: "Expand search positioning from Johannesburg-only to South Africa while keeping Johannesburg local relevance.",
        actions: ["Add city/service FAQ ideas", "Create content brief for corporate saxophonist South Africa", "Track searches around wedding saxophonist and corporate saxophonist"],
      },
      {
        agent: "Instagram Content Agent",
        priority: "Use existing performance clips and testimonials to create trust-led booking content.",
        actions: ["Post one performance reel with enquiry CTA", "Share one testimonial story", "Create one behind-the-scenes post about event preparation"],
      },
      {
        agent: "Venue Partnership Agent",
        priority: "Start with premium restaurants, hotels and event venues where repeat music nights or referrals are realistic.",
        actions: ["Draft 10 venue outreach messages", "Create a 2-message follow-up sequence", "Prepare a concise residency pitch"],
      },
      {
        agent: "Paid Ads Agent",
        priority: "Do not spend yet; prepare ad tests for wedding and corporate event booking intent.",
        actions: ["Draft Google Search headlines", "Draft Instagram enquiry ad copy", "Recommend small test budget only after approval"],
      },
      {
        agent: "Lead Nurture Agent",
        priority: "Every enquiry should receive a warm reply with the next qualification questions.",
        actions: ["Ask for venue/city, timing and guest count", "Offer a quick call or WhatsApp follow-up", "Follow up after 48 hours if no reply"],
      },
    ],
    approvalQueue: [
      "Approve before sending venue outreach messages.",
      "Approve before launching any paid ads or spending budget.",
      "Approve before changing live website copy.",
      "Approve replies to high-value leads before sending until the voice is locked in.",
    ],
    qcNotes: ["No messages should invent client names, testimonials, pricing or availability.", "All public content should sound premium, warm and specific to Tobi."],
    nextReport: "Review the approval queue, then run the agents again after approved actions are completed.",
  };
}

function buildPrompt(context) {
  return [
    "You are an autonomous marketing agent team for Tobi Odeyemi, a premium saxophonist based in Johannesburg and available across South Africa.",
    "The business goal is to increase qualified bookings, not vanity engagement.",
    "Agents and duties:",
    AGENTS.map((agent) => "- " + agent.name + ": " + agent.duty).join("\n"),
    "",
    "Run context:",
    JSON.stringify(context, null, 2),
    "",
    "Create a concise weekly marketing operations report as strict JSON with this shape:",
    JSON.stringify({
      summary: "string",
      bookingFocus: "string",
      agentOutputs: [{ agent: "string", priority: "string", actions: ["string"] }],
      approvalQueue: ["string"],
      qcNotes: ["string"],
      nextReport: "string",
    }, null, 2),
    "Rules: do not claim actions were actually sent, published or paid for. Mark sending outreach, paid ads, public website changes and direct lead replies as approval-required. Keep everything practical and booking-focused.",
  ].join("\n");
}

function parseOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) chunks.push(content.text);
      if (content.type === "text" && content.text) chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}

async function generateReport(context) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { report: fallbackReport(context), aiUsed: false };

  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: buildPrompt(context),
      text: { format: { type: "json_object" } },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("OpenAI marketing report failed", response.status, detail);
    return { report: fallbackReport(context), aiUsed: false, aiError: response.status };
  }

  const data = await response.json();
  const text = parseOutputText(data);
  try {
    return { report: JSON.parse(text), aiUsed: true };
  } catch (error) {
    console.error("OpenAI marketing report parse failed", error.message, text);
    return { report: fallbackReport(context), aiUsed: false, aiError: "parse" };
  }
}

function list(items) {
  return "<ul>" + (items || []).map((item) => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul>";
}

function buildEmailHtml(report, context, meta) {
  const outputs = (report.agentOutputs || []).map((item) => (
    "<section style=\"border:1px solid #e7e0d2;border-radius:10px;padding:14px;margin:12px 0;background:#fffdf8\">" +
    "<h2 style=\"font-size:17px;margin:0 0 6px;color:#123b31\">" + escapeHtml(item.agent) + "</h2>" +
    "<p style=\"margin:0 0 8px\"><strong>Priority:</strong> " + escapeHtml(item.priority) + "</p>" +
    list(item.actions) +
    "</section>"
  )).join("");

  return "<div style=\"font-family:Arial,sans-serif;color:#16201d;line-height:1.55;max-width:760px\">" +
    "<h1 style=\"font-size:25px;margin:0 0 8px\">Tobi Marketing Agents Report</h1>" +
    "<p style=\"margin:0 0 16px;color:#6b6258\">Run type: " + escapeHtml(context.runType) + " | AI used: " + escapeHtml(meta.aiUsed ? "yes" : "fallback") + "</p>" +
    "<p><strong>Booking focus:</strong> " + escapeHtml(report.bookingFocus || context.focus) + "</p>" +
    "<p>" + escapeHtml(report.summary) + "</p>" +
    outputs +
    "<h2 style=\"font-size:18px;margin-top:22px\">Approval Queue</h2>" + list(report.approvalQueue) +
    "<h2 style=\"font-size:18px;margin-top:22px\">Quality Control Notes</h2>" + list(report.qcNotes) +
    "<h2 style=\"font-size:18px;margin-top:22px\">Next Step</h2>" +
    "<p>" + escapeHtml(report.nextReport || "Review the approval queue and approve what should move forward.") + "</p>" +
    "</div>";
}

function buildEmailText(report, context, meta) {
  const lines = [
    "Tobi Marketing Agents Report",
    "Run type: " + context.runType,
    "AI used: " + (meta.aiUsed ? "yes" : "fallback"),
    "",
    "Booking focus: " + (report.bookingFocus || context.focus),
    report.summary || "",
    "",
  ];

  for (const item of report.agentOutputs || []) {
    lines.push(item.agent, "Priority: " + item.priority, ...(item.actions || []).map((action) => "- " + action), "");
  }

  lines.push("Approval Queue", ...(report.approvalQueue || []).map((item) => "- " + item), "");
  lines.push("Quality Control Notes", ...(report.qcNotes || []).map((item) => "- " + item), "");
  lines.push("Next Step", report.nextReport || "Review the approval queue and approve what should move forward.");
  return lines.join("\n");
}

async function sendReportEmail(report, context, meta) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true, reason: "RESEND_API_KEY missing" };

  const to = process.env.MARKETING_REPORT_EMAIL || process.env.INQUIRY_TO_EMAIL || "tobisax@gmail.com";
  const from = process.env.RESEND_FROM_EMAIL || "Tobi Odeyemi Website <onboarding@resend.dev>";

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Marketing agents report: " + (report.bookingFocus || context.focus).slice(0, 90),
      html: buildEmailHtml(report, context, meta),
      text: buildEmailText(report, context, meta),
      tags: [{ name: "source", value: "marketing-agents" }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error("Resend marketing report failed: " + response.status + " " + detail);
  }

  return response.json().catch(() => ({ ok: true }));
}

async function runMarketingAgents(req, res) {
  if (!authOk(req)) return json(res, 401, { error: "Unauthorized" });

  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { body = {}; }
  }

  const context = getRunContext(body);
  const generated = await generateReport(context);
  const email = await sendReportEmail(generated.report, context, { aiUsed: generated.aiUsed });

  return json(res, 200, {
    success: true,
    context,
    report: generated.report,
    aiUsed: generated.aiUsed,
    aiError: generated.aiError || null,
    email,
  });
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") return runMarketingAgents(req, res);
  if (req.method === "POST") return runMarketingAgents(req, res);
  res.setHeader("Allow", "GET, POST");
  return json(res, 405, { error: "Method not allowed" });
};
