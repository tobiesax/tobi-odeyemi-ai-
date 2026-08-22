import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

const defaultFocus = "increase qualified saxophone booking enquiries across South Africa";

function AgentOutput({ item }) {
  return (
    <article className="ai-result-card">
      <span className="ai-result-label">{item.agent}</span>
      <p className="ai-quote-note">{item.priority}</p>
      <div className="ai-quote-lines">
        {(item.actions || []).map((action) => (
          <span key={action}><strong><CheckCircle2 size={15} /></strong>{action}</span>
        ))}
      </div>
    </article>
  );
}

export default function MarketingOps() {
  const [focus, setFocus] = React.useState(defaultFocus);
  const [segments, setSegments] = React.useState("corporate events, weddings, private functions, hotels, restaurants, exclusive venues");
  const [notes, setNotes] = React.useState("Prioritize actions that can lead to enquiries through the website booking form or direct Gmail follow-up.");
  const [secret, setSecret] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState(null);

  async function runAgents() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/marketing-run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret ? { "x-marketing-secret": secret } : {}),
        },
        body: JSON.stringify({
          runType: "manual-admin",
          focus,
          bookingSegments: segments,
          notes,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Marketing run failed");
      setResult(data);
    } catch (err) {
      setError(err.message || "Marketing run failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-panel marketing-ops-panel">
      <span className="ai-badge"><Sparkles size={13} /> Autonomous Marketing Agents</span>
      <p className="ai-quote-note">
        Runs the marketing team, creates a booking-growth report, applies quality control, and emails the report to you. Sending outreach, ads and website changes still require approval.
      </p>

      <label className="marketing-field">
        <span>Booking focus</span>
        <textarea className="ai-textarea" value={focus} onChange={(event) => setFocus(event.target.value)} />
      </label>

      <label className="marketing-field">
        <span>Target segments</span>
        <input className="ai-input" value={segments} onChange={(event) => setSegments(event.target.value)} />
      </label>

      <label className="marketing-field">
        <span>Extra notes</span>
        <textarea className="ai-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} />
      </label>

      <label className="marketing-field">
        <span>Admin secret, if configured</span>
        <input className="ai-input" value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="MARKETING_ADMIN_SECRET" type="password" />
      </label>

      <button className="book-button" type="button" onClick={runAgents} disabled={loading || !focus.trim()}>
        {loading ? "Running agents..." : "Run Marketing Agents"}
        <ArrowRight size={16} />
      </button>

      {error && <p className="form-error">{error}</p>}

      {result && (
        <div className="marketing-report-view">
          <div className="ai-result-card">
            <span className="ai-result-label">Report Summary</span>
            <strong className="ai-result-genre">{result.report.bookingFocus}</strong>
            <p>{result.report.summary}</p>
            <p className="ai-quote-note">AI used: {result.aiUsed ? "Yes" : "Fallback plan"}. Email report sent.</p>
          </div>

          {(result.report.agentOutputs || []).map((item) => <AgentOutput item={item} key={item.agent} />)}

          <div className="ai-result-card">
            <span className="ai-result-label"><ShieldCheck size={14} /> Approval Queue</span>
            <div className="ai-quote-lines">
              {(result.report.approvalQueue || []).map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>

          <div className="ai-result-card">
            <span className="ai-result-label">Quality Control</span>
            <div className="ai-quote-lines">
              {(result.report.qcNotes || []).map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
