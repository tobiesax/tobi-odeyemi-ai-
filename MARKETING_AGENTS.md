# Marketing Agent System

This project includes a first-version autonomous marketing agent system for increasing Tobi Odeyemi booking enquiries.

## Platform

- Website hosting: Vercel
- Scheduled automation: Vercel Cron
- Agent API: `/api/marketing-run`
- Admin UI: `/admin` -> `Marketing Agents`
- Email reports: Resend
- AI generation: OpenAI Responses API, with a deterministic fallback plan if no API key is configured

## Agents

- Marketing Director: coordinates weekly booking-growth focus
- SEO Growth Agent: organic search and local SEO opportunities
- Instagram Content Agent: reels, captions, content calendar ideas
- Venue Partnership Agent: hotel, restaurant, venue and planner outreach drafts
- Paid Ads Agent: Google/Meta ad angles and copy drafts
- Lead Nurture Agent: enquiry follow-up drafts
- Quality Control Agent: brand, accuracy and approval checks

## Approval Rules

The system may draft ideas and email reports automatically. It should not automatically send outreach, launch paid ads, edit the live website, or reply to high-value leads without approval.

## Environment Variables

Required for AI-generated reports:

- `OPENAI_API_KEY`

Already used by the website and reused for reports:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `INQUIRY_TO_EMAIL`

Recommended for marketing automation:

- `MARKETING_REPORT_EMAIL` - where marketing reports should be sent. Falls back to `INQUIRY_TO_EMAIL`.
- `MARKETING_ADMIN_SECRET` - protects manual runs from the admin UI.
- `CRON_SECRET` - protects scheduled Vercel Cron runs.
- `OPENAI_MODEL` - optional. Defaults to `gpt-5-mini`.

## Schedule

`vercel.json` runs `/api/marketing-run` every Monday at `07:00 UTC`.

For South Africa, this is usually Monday morning after 09:00 depending on daylight-saving differences elsewhere. Vercel cron schedules use UTC.

## Manual Run

Open `/admin`, choose `Marketing Agents`, set the booking focus, and run the agents. If `MARKETING_ADMIN_SECRET` is configured, enter it in the admin secret field.
