// FamilyOffice AI — TaxStrategyView — lazy loaded
'use client';

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
  const [phase, setPhase] = useState<"idle"|"loading"|"done">("idle");
  const [visibleSections, setVisibleSections] = useState(0);
  const [output, setOutput] = useState<{summary:string; liability:string; recommendations:{title:string; explanation:string; saving:string}[]; riskLevel:"High"|"Medium"|"Low"; note:string} | null>(null);

  function update(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); }
  function parseNum(v: string) { return parseFloat(v.replace(/,/g, "")); }
  function riskLevel(equitiesPct: number) {
    if (equitiesPct > 70) return "High";
    if (equitiesPct >= 40) return "Medium";
    return "Low";
  }
  function estimateTax(j: string, aum: number) {
    if (j === "Switzerland") { const c = aum * 0.001; const f = aum * 0.00015; return `$${(c+f).toLocaleString("en-US",{maximumFractionDigits:0})}–$${(c*1.8+f*1.8).toLocaleString("en-US",{maximumFractionDigits:0})}`; }
    if (j === "USA") { const cg = aum * 0.18; const e = aum > 13_610_000 ? aum * 0.40 : 0; return `$${cg.toLocaleString("en-US",{maximumFractionDigits:0})}–$${(cg*1.5+e).toLocaleString("en-US",{maximumFractionDigits:0})}`; }
    if (j === "UK") { const iht = aum > 325_000 ? aum * 0.38 : 0; return `£${iht.toLocaleString("en-US",{maximumFractionDigits:0})}–£${(iht*1.4).toLocaleString("en-US",{maximumFractionDigits:0})}`; }
    if (j === "Singapore") return "$0 (no wealth or capital gains tax under MAS regulations)";
    return "Contact local tax authority";
  }
  function buildRecs(j: string, eqPct: number, aum: number, cashPct: number, name: string) {
    const recs: {title:string; explanation:string; saving:string}[] = [];
    if (j === "Switzerland") {
      recs.push({ title: "Lump-Sum Taxation (Forfait Fiscal) Evaluation", explanation: `Given ${name}'s AUM and Swiss residency, a lump-sum taxation election replaces ordinary income tax with a fixed annual charge, particularly advantageous for capital-derived income. Requires cantonal approval.`, saving: `$${Math.round(aum*0.008).toLocaleString("en-US")}–$${Math.round(aum*0.012).toLocaleString("en-US")} per annum` });
      if (eqPct > 60) recs.push({ title: "Vested Securities Relief via BVET", explanation: `With ${eqPct}% equities, Beteiligungsabzug (partial exemption) on dividends and capital gains from qualifying Swiss equities reduces effective equity income tax rate.`, saving: `$${Math.round(aum*eqPct*0.001).toLocaleString("en-US")}–$${Math.round(aum*eqPct*0.002).toLocaleString("en-US")} annual reduction` });
      recs.push({ title: "Pillar 3a Retirement Savings Optimization", explanation: `Maximizing Pillar 3a (CHF 25,320 for 2026) provides immediate tax relief. With ${cashPct}% cash, redirecting part of the cash position reduces taxable ordinary income.`, saving: `$${Math.round(Math.min(aum*0.03,25000)).toLocaleString("en-US")}–$${Math.round(Math.min(aum*0.06,50000)).toLocaleString("en-US")}` });
    } else if (j === "USA") {
      recs.push({ title: "GRAT for Concentrated Equity Position", explanation: `With ${eqPct}% in equities, a zeroed-out GRAT transfers future appreciation to heirs at zero gift-tax cost, removing it from the taxable estate.`, saving: `$${Math.round(aum*0.05).toLocaleString("en-US")}–$${Math.round(aum*0.15).toLocaleString("en-US")} in estate tax reduction` });
      if (eqPct > 50) recs.push({ title: "Qualified Opportunity Zone Reinvestment", explanation: `Selling appreciated equity triggers capital gains. A QOF investment allows deferral and potential exclusion of new appreciation from the taxable base.`, saving: `$${Math.round(aum*0.12*0.23).toLocaleString("en-US")} in deferred capital gains tax` });
      recs.push({ title: "Backdoor Roth IRA Conversion", explanation: `With ${cashPct}% in cash, a non-deductible traditional IRA contribution converted immediately to Roth provides tax-free compounding.`, saving: `$${Math.round(Math.min(aum*0.04,50000)).toLocaleString("en-US")} in tax-free compounding` });
    } else if (j === "UK") {
      recs.push({ title: "IHT Business Property Relief (BPR) Reallocation", explanation: `With ${eqPct}% equities, certain AIM-listed or unlisted trading company shares may qualify for 100% BPR exemption, removing them entirely from the IHT net.`, saving: `£${Math.round(aum*0.38*0.5).toLocaleString("en-US")}–£${Math.round(aum*0.38*0.9).toLocaleString("en-US")} IHT reduction` });
      recs.push({ title: "ISA Allowance Maximization (£20,000/yr)", explanation: `Fully utilizing the £20,000 annual ISA allowance removes future investment returns from CGT and IHT scope. Maximizing for a spouse doubles benefit to £40,000/yr combined.`, saving: `£${(20000*0.18*20).toLocaleString("en-US")}–£${(40000*0.18*20).toLocaleString("en-US")} CGT savings over 20 years` });
      recs.push({ title: "Gifting from Excess Cash (£3,000 Annual Exemption)", explanation: `With ${cashPct}% in cash, the £3,000 annual IHT exemption removes that amount immediately from the estate. Married couples can use £6,000/yr combined.`, saving: `£6,000 per year removed from IHT estate = £2,400 saved annually` });
    } else if (j === "Singapore") {
      recs.push({ title: "Family Office Structure (13O/13U Scheme)", explanation: `With S$${aum.toLocaleString("en-US")} AUM, a Singaporean Family Office under 13O (S$10M min) or 13U (S$50M min) enables tax-exempt investment income. No capital gains or wealth tax.`, saving: `S$${Math.round(aum*0.18*0.17).toLocaleString("en-US")}–S$${Math.round(aum*0.23*0.17).toLocaleString("en-US")} annually avoided` });
      if (eqPct > 50) recs.push({ title: "VCC Restructuring for CRS Efficiency", explanation: `CRS reporting creates inefficiencies on cross-border investments. Structuring equities through a Singapore VCC reduces CRS exposure while maintaining tax transparency.`, saving: `S$${Math.round(aum*0.005).toLocaleString("en-US")}–S$${Math.round(aum*0.01).toLocaleString("en-US")} per annum in compliance savings` });
      recs.push({ title: "Endowment Life Insurance for Estate Planning", explanation: `Singapore has no estate duty, but for USA and Switzerland holdings, a survivorship life insurance policy covers foreign estate tax obligations.`, saving: `S$${Math.round(aum*0.01).toLocaleString("en-US")}–S$${Math.round(aum*0.02).toLocaleString("en-US")} estate settlement reduction` });
    }
    return recs;
  }

  async function generate() {
    setPhase("loading"); setVisibleSections(0); setOutput(null);
    await new Promise((r) => setTimeout(r, 1800));
    const eqPct = parseNum(form.equities);
    const rePct = parseNum(form.realEstate);
    const cashPct = parseNum(form.cash);
    const aum = parseNum(form.aum);
    const rl = riskLevel(eqPct);
    const liability = estimateTax(form.jurisdiction, aum);
    const recs = buildRecs(form.jurisdiction, eqPct, aum, cashPct, form.clientName);
    setOutput({ summary: `${form.clientName} is a high-net-worth individual with total assets of $${aum.toLocaleString("en-US")}, resident in ${form.jurisdiction}. Portfolio: ${eqPct}% equities, ${rePct}% real estate, ${cashPct}% cash. Tax year ${form.taxYear}. Concerns: ${form.concerns}. ${eqPct > 70 ? "Growth-oriented" : eqPct > 40 ? "Balanced" : "Conservative"} strategy with ${rl.toLowerCase()} risk.`, liability, recommendations: recs, riskLevel: rl, note: `Strategy tailored to ${form.clientName}'s current allocation and estate structure as of ${form.taxYear}.` });
    setPhase("done");
    for (let i = 1; i <= recs.length + 2; i++) { await new Promise((r) => setTimeout(r, 400)); setVisibleSections(i); }
  }

  const rb: Record<string,{bg:string;border:string;color:string}> = { High: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", color: "#EF4444" }, Medium: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", color: "#F59E0B" }, Low: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", color: "#22C55E" } };
  const cs: React.CSSProperties = { background: "rgba(11,28,48,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(0,210,255,0.12)", borderRadius: "12px", padding: "20px 24px", marginBottom: "14px" };
  const ls: React.CSSProperties = { display: "block", fontSize: "11px", color: "#94A3B8", fontFamily: "'Roboto Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" };
  const ib: React.CSSProperties = { background: "rgba(3,20,39,0.6)", border: "1px solid rgba(0,210,255,0.15)", borderRadius: "6px", color: "#F5F7FA", fontSize: "13px", fontFamily: "'Roboto Mono',monospace", padding: "9px 12px", outline: "none", width: "100%", boxSizing: "border-box" as "border-box" };

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
            <input value={form.clientName} onChange={(e) => update("clientName", e.target.value)} style={ib} />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Jurisdiction</label>
            <select value={form.jurisdiction} onChange={(e) => update("jurisdiction", e.target.value)} style={{ ...ib, appearance: "none", cursor: "pointer" }}>
              {["Switzerland","USA","UK","Singapore"].map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Total AUM (USD)</label>
            <input value={form.aum} onChange={(e) => update("aum", e.target.value)} style={ib} />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Any Specific Concerns?</label>
            <textarea value={form.concerns} onChange={(e) => update("concerns", e.target.value)} rows={3} style={{ ...ib, resize: "vertical", lineHeight: 1.5 }} />
          </div>
        </div>
        <div>
          <div style={{ ...cs }}>
            <label style={ls}>Percentage in Equities (%)</label>
            <input type="number" value={form.equities} onChange={(e) => update("equities", e.target.value)} style={ib} />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Percentage in Real Estate (%)</label>
            <input type="number" value={form.realEstate} onChange={(e) => update("realEstate", e.target.value)} style={ib} />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Percentage in Cash (%)</label>
            <input type="number" value={form.cash} onChange={(e) => update("cash", e.target.value)} style={ib} />
          </div>
          <div style={{ ...cs }}>
            <label style={ls}>Current Tax Year</label>
            <input type="number" value={form.taxYear} onChange={(e) => update("taxYear", e.target.value)} style={ib} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={generate} disabled={phase === "loading"}
          style={{ padding: "10px 28px", background: "rgba(0,210,255,0.15)", border: "1px solid rgba(0,210,255,0.35)", color: "#00D2FF", fontSize: "13px", fontFamily: "'Roboto Mono',monospace", borderRadius: "6px", cursor: phase === "loading" ? "not-allowed" : "pointer", opacity: phase === "loading" ? 0.7 : 1, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {phase === "loading" ? `AI is analyzing ${form.clientName}'s tax profile across ${form.jurisdiction} regulations...` : "Generate Strategy"}
        </button>
      </div>

      {phase === "done" && output && (
        <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {visibleSections >= 1 && (
            <div style={{ ...cs, borderLeft: "3px solid #00D2FF" }}>
              <div style={{ fontSize: "11px", color: "#00D2FF", fontFamily: "'Roboto Mono',monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Client Summary</div>
              <p style={{ fontSize: "13px", color: "#F5F7FA", lineHeight: 1.7 }}>{output.summary}</p>
            </div>
          )}
          {visibleSections >= 2 && (
            <div style={{ ...cs, borderLeft: "3px solid #00D2FF" }}>
              <div style={{ fontSize: "11px", color: "#00D2FF", fontFamily: "'Roboto Mono',monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Estimated Tax Liability ({form.jurisdiction})</div>
              <div style={{ fontSize: "22px", fontFamily: "'Roboto Mono',monospace", fontWeight: 700, color: "#F5F7FA" }}>{output.liability}</div>
            </div>
          )}
          {output.recommendations.map((rec, i) => {
            if (i + 3 > visibleSections) return null;
            return (
              <div key={i} style={{ ...cs, borderLeft: "3px solid #00D2FF" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontSize: "12px", color: "#00D2FF", fontFamily: "'Roboto Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Recommendation {i + 1}</div>
                  <div style={{ fontSize: "11px", fontFamily: "'Roboto Mono',monospace", color: "#22C55E", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "4px", padding: "2px 8px" }}>{rec.saving}</div>
                </div>
                <div style={{ fontSize: "14px", color: "#F5F7FA", fontWeight: 600, marginBottom: "6px", fontFamily: "'Playfair Display',serif" }}>{rec.title}</div>
                <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.6 }}>{rec.explanation}</p>
              </div>
            );
          })}
          {visibleSections >= output.recommendations.length + 3 && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "'Roboto Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "8px" }}>Risk Level</div>
              <span style={{ padding: "4px 12px", borderRadius: "12px", background: rb[output.riskLevel].bg, border: `1px solid ${rb[output.riskLevel].border}`, color: rb[output.riskLevel].color, fontFamily: "'Roboto Mono',monospace", fontWeight: 600, fontSize: "11px" }}>{output.riskLevel}</span>
            </div>
          )}
          {visibleSections >= output.recommendations.length + 4 && (
            <div style={{ fontSize: "12px", color: "#94A3B8", fontStyle: "italic" }}>{output.note}</div>
          )}
          {visibleSections >= output.recommendations.length + 5 && (
            <div style={{ fontSize: "10px", color: "#64748B", fontFamily: "'Roboto Mono',monospace", borderTop: "1px solid rgba(0,210,255,0.06)", paddingTop: "10px" }}>AI-generated suggestion only. No action should be taken without consulting a qualified tax advisor.</div>
          )}
        </div>
      )}
    </div>
  );
}

