const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TELEGRAM_ENDPOINT = "https://api.telegram.org";
const requiredFields = ["name", "email", "eventType", "eventDate"];

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
    .replace(/"/g, "&quot;");
}

function row(label, value) {
  return "<tr>" +
    "<td style=\"border:1px solid #e7e0d2;padding:10px;font-weight:700;background:#f8f4ea\">" + escapeHtml(label) + "</td>" +
    "<td style=\"border:1px solid #e7e0d2;padding:10px\">" + escapeHtml(value) + "</td>" +
    "</tr>";
}

function buildEmailHtml(inquiry) {
  const rows = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone / WhatsApp", inquiry.phone || "Not provided"],
    ["Event type", inquiry.eventType],
    ["Event date", inquiry.eventDate],
    ["Approx. guests", inquiry.guests || "Not provided"],
    ["Source", inquiry.source || "website-booking-form"],
  ];

  return "<div style=\"font-family:Arial,sans-serif;color:#16201d;line-height:1.55\">" +
    "<h1 style=\"font-size:24px;margin:0 0 16px\">New booking enquiry</h1>" +
    "<table style=\"border-collapse:collapse;width:100%;max-width:640px\">" +
    rows.map(([label, value]) => row(label, value)).join("") +
    "</table>" +
    "<h2 style=\"font-size:18px;margin:24px 0 8px\">Message</h2>" +
    "<p style=\"white-space:pre-wrap;border:1px solid #e7e0d2;padding:14px;background:#fffdf8\">" +
    escapeHtml(inquiry.notes || "No message provided.") +
    "</p></div>";
}

function buildEmailText(inquiry) {
  return [
    "New booking enquiry",
    "",
    "Name: " + inquiry.name,
    "Email: " + inquiry.email,
    "Phone / WhatsApp: " + (inquiry.phone || "Not provided"),
    "Event type: " + inquiry.eventType,
    "Event date: " + inquiry.eventDate,
    "Approx. guests: " + (inquiry.guests || "Not provided"),
    "Source: " + (inquiry.source || "website-booking-form"),
    "",
    "Message:",
    inquiry.notes || "No message provided.",
  ].join("\n");
}

function buildTelegramText(inquiry) {
  return [
    "New website enquiry",
    "",
    "Event: " + inquiry.eventType,
    "Date: " + inquiry.eventDate,
    "Name: " + inquiry.name,
    "Email: " + inquiry.email,
    "Phone: " + (inquiry.phone || "Not provided"),
    "Guests: " + (inquiry.guests || "Not provided"),
    "",
    "Message:",
    inquiry.notes || "No message provided.",
  ].join("\n");
}

async function sendTelegramAlert(inquiry) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return { skipped: true };
  }

  const response = await fetch(TELEGRAM_ENDPOINT + "/bot" + botToken + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramText(inquiry),
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error("Telegram alert failed: " + response.status + " " + detail);
  }

  return response.json().catch(() => ({ ok: true }));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(res, 500, { error: "Resend is not configured" });
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      return json(res, 400, { error: "Invalid JSON" });
    }
  }

  const inquiry = {
    name: sanitize(body.name),
    firstName: sanitize(body.firstName),
    lastName: sanitize(body.lastName),
    email: sanitize(body.email).toLowerCase(),
    phone: sanitize(body.phone),
    eventType: sanitize(body.eventType),
    eventDate: sanitize(body.eventDate),
    guests: sanitize(body.guests),
    notes: sanitize(body.notes),
    source: sanitize(body.source),
  };

  const missing = requiredFields.filter((field) => !inquiry[field]);
  if (missing.length > 0) {
    return json(res, 400, { error: "Missing required fields", missing });
  }

  const to = process.env.INQUIRY_TO_EMAIL || "tobisax@gmail.com";
  const from = process.env.RESEND_FROM_EMAIL || "Tobi Odeyemi Website <onboarding@resend.dev>";
  const subject = "New booking enquiry: " + inquiry.eventType + " on " + inquiry.eventDate;

  const resendResponse = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      reply_to: inquiry.email,
      html: buildEmailHtml(inquiry),
      text: buildEmailText(inquiry),
      tags: [{ name: "source", value: "website-inquiry-form" }],
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text().catch(() => "");
    console.error("Resend inquiry email failed", resendResponse.status, detail);
    return json(res, 502, { error: "Email delivery failed" });
  }

  const result = await resendResponse.json().catch(() => ({}));

  try {
    await sendTelegramAlert(inquiry);
  } catch (error) {
    console.error(error.message || "Telegram alert failed");
  }

  return json(res, 200, { success: true, id: result.id || null });
};

