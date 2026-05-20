// FamilyOffice AI — TaxStrategyView — step 1: form inputs only
'use client';

import React, { useState } from 'react';

export default function TaxStrategyView() {
  const [form, setForm] = useState({
    clientName: "J. Whitmore",
    jurisdiction: "Switzerland",
    aum: "8,000,000",
    equities: "80",
    realEstate: "0",
    cash: "20",
    taxYear: "2026",
    concerns: "Capital preservation, minimizing inheritance tax for children under 35",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const cs: React.CSSProperties = {
    background: "rgba(11,28,48,0.85)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(0,210,255,0.12)",
    borderRadius: "12px",
    padding: "20px 24px",
    marginBottom: "14px"
  };
  const ls: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    color: "#94A3B8",
    fontFamily: "'Roboto Mono',monospace",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px"
  };
  const ib: React.CSSProperties = {
    background: "rgba(3,20,39,0.6)",
    border: "1px solid rgba(0,210,255,0.15)",
    borderRadius: "6px",
    color: "#F5F7FA",
    fontSize: "13px",
    fontFamily: "'Roboto Mono',monospace",
    padding: "9px 12px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as "border-box"
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontFamily: "'Playfair Display',serif", color: "#F5F7FA", marginBottom: "4px" }}>Tax Strategy</h2>
        <p style={{ fontSize: "14px", color: "#94A3B8" }}>AI-Powered Tax Optimization</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <div style={{ ...cs }}>
            <label style={ls}>Client Name</label>
            <input
              value={form.clientName}
              onChange={(e) => update("clientName", e.target.value)}
              style={ib}
            />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Jurisdiction</label>
            <select
              value={form.jurisdiction}
              onChange={(e) => update("jurisdiction", e.target.value)}
              style={{ ...ib, appearance: "none", cursor: "pointer" }}
            >
              {["Switzerland", "USA", "UK", "Singapore"].map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Total AUM (USD)</label>
            <input
              value={form.aum}
              onChange={(e) => update("aum", e.target.value)}
              style={ib}
            />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Any Specific Concerns?</label>
            <textarea
              value={form.concerns}
              onChange={(e) => update("concerns", e.target.value)}
              rows={3}
              style={{ ...ib, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>
        </div>
        <div>
          <div style={{ ...cs }}>
            <label style={ls}>Percentage in Equities (%)</label>
            <input
              type="number"
              value={form.equities}
              onChange={(e) => update("equities", e.target.value)}
              style={ib}
            />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Percentage in Real Estate (%)</label>
            <input
              type="number"
              value={form.realEstate}
              onChange={(e) => update("realEstate", e.target.value)}
              style={ib}
            />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Percentage in Cash (%)</label>
            <input
              type="number"
              value={form.cash}
              onChange={(e) => update("cash", e.target.value)}
              style={ib}
            />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Current Tax Year</label>
            <input
              type="number"
              value={form.taxYear}
              onChange={(e) => update("taxYear", e.target.value)}
              style={ib}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            padding: "10px 28px",
            background: "rgba(0,210,255,0.15)",
            border: "1px solid rgba(0,210,255,0.35)",
            color: "#00D2FF",
            fontSize: "13px",
            fontFamily: "'Roboto Mono',monospace",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}
        >
          Generate Strategy
        </button>
      </div>
    </div>
  );
}