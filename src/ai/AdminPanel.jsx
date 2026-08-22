import React from "react";
import {
  ContentCalendar,
  LeadScorer,
  ResidencyPitchGenerator,
} from "./AIFeatures";

export default function AdminPanel() {
  const [tool, setTool] = React.useState("leads");
  const tools = [
    { id: "leads", label: "Lead Scorer", node: <LeadScorer /> },
    { id: "calendar", label: "Content Calendar", node: <ContentCalendar /> },
    { id: "pitch", label: "Residency Pitch", node: <ResidencyPitchGenerator /> },
  ];

  return (
    <main className="min-h-screen bg-[#021B16] text-ivory" style={{ padding: "3.5rem 1.5rem" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <p className="section-eyebrow section-eyebrow-dark">Backstage</p>
        <h1 className="section-title section-title-light" style={{ fontSize: "2.4rem", marginBottom: "2rem" }}>
          Tobi's AI Admin Tools
        </h1>
        <div className="ai-pill-row" style={{ marginBottom: "2.5rem" }}>
          {tools.map((t) => (
            <button
              className={`ai-pill ${tool === t.id ? "active" : ""}`}
              type="button"
              onClick={() => setTool(t.id)}
              key={t.id}
              style={{ borderColor: "rgba(200,169,107,0.4)", color: tool === t.id ? "#e6c27a" : "#cfc7b8" }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,107,0.2)", borderRadius: 16, padding: "2rem" }}>
          {tools.find((t) => t.id === tool)?.node}
        </div>
        <a href="#" onClick={() => window.history.pushState({}, "", "/")} className="luxury-outline light" style={{ marginTop: "2.5rem", display: "inline-flex" }}>
          Back to site
        </a>
      </div>
    </main>
  );
}
