export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ── Navigation ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1A2F]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#C9A227] rounded flex items-center justify-center text-[#0A1A2F] font-bold text-sm">F</div>
            <span className="text-white font-semibold text-sm tracking-tight">FamilyOffice AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Benefits", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-white/60 hover:text-white text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
          <a href="#contact" className="hidden md:inline-block bg-[#C9A227] text-[#0A1A2F] text-xs font-semibold px-5 py-2 rounded tracking-wide">
            Request Demo
          </a>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="bg-[#0A1A2F] pt-40 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#C9A227]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 bg-[#C9A227] rounded-full animate-pulse" />
            <span className="text-white/70 text-xs tracking-widest uppercase">AI-Native Wealth Coordination</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
            FamilyOffice AI
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-light mb-4">
            AI-Native Wealth Coordination Agent
          </p>
          <p className="text-lg text-[#C9A227] font-medium mb-10">
            for Multi-Generational Families
          </p>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-12">
            Unify portfolio data, estate documents, and family risk preferences into one
            autonomous AI agent that delivers real-time wealth intelligence and personalized
            recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary text-sm">Request Demo</a>
            <a href="#features" className="btn-secondary text-sm">Learn More</a>
          </div>
        </div>
      </section>

      {/* ── Metrics ─────────────────────────────── */}
      <section className="py-16 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-10">
            Trusted by leading family offices across international markets
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "$2.4B+", label: "Assets Coordinated" },
              { value: "340+", label: "Family Members Served" },
              { value: "18", label: "Countries of Operation" },
              { value: "99.9%", label: "Platform Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#0A1A2F] tracking-tight">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem Statement ─────────────────────── */}
      <section id="problem" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs text-[#C9A227] uppercase tracking-widest font-semibold mb-4">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] tracking-tight mb-6">
              Wealthy families face a<br />coordination crisis.
            </h2>
            <div className="w-10 h-0.5 bg-[#C9A227] mb-8" />
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {[
              { icon: "📄", title: "Documents Siloed", desc: "Legal documents stored with lawyers. Portfolio data held by banks. No unified view." },
              { icon: "👥", title: "Advisors Disconnected", desc: "Private bankers, lawyers, and portfolio managers work independently with slow communication." },
              { icon: "⏰", title: "Timing Gaps", desc: "Decisions are made using outdated information. Missed rebalancing and unnecessary tax events." },
              { icon: "⚠️", title: "Risk Blind Spots", desc: "Risk preferences documented separately. No family-wide visibility into portfolio exposure." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 border border-gray-200 rounded-lg hover-lift">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-[#0A1A2F] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution / Features ────────────────────── */}
      <section id="features" className="bg-[#0A1A2F] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#C9A227] uppercase tracking-widest font-semibold mb-4">Our Solution</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              One autonomous agent.<br />Your entire wealth, coordinated.
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              FamilyOffice AI acts as a centralized intelligence layer that continuously integrates
              all financial data — eliminating information asymmetry and enabling real-time,
              estate-aware financial decision-making.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              { icon: "🧠", title: "AI Wealth Assistant", desc: "Natural-language interface that answers complex wealth questions instantly." },
              { icon: "📊", title: "Portfolio Overview", desc: "Live consolidated view across all custodians, asset classes, and geographies." },
              { icon: "🛡️", title: "Risk Monitoring", desc: "Continuous risk profiling against family objectives with real-time alerts." },
              { icon: "📋", title: "Estate Analysis", desc: "AI-powered parsing of trust deeds, wills, and legal documents." },
              { icon: "👤", title: "Family Profiles", desc: "Individual risk preferences and financial goals for each family member." },
              { icon: "🔔", title: "Alerts & Recommendations", desc: "Personalized recommendations with human advisor approval workflow." },
            ].map((card) => (
              <div key={card.title} className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-lg hover:border-[#C9A227]/30 transition-colors">
                <span className="text-2xl mb-4 block">{card.icon}</span>
                <h3 className="font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#C9A227] uppercase tracking-widest font-semibold mb-4">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] tracking-tight">
              From data to decisions in three steps.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect", desc: "Link custodians, upload estate documents, and define family profiles. FamilyOffice AI ingests and structures all data automatically." },
              { step: "02", title: "Monitor", desc: "The AI continuously tracks portfolio positions, market conditions, risk exposure, and estate deadlines across all assets." },
              { step: "03", title: "Recommend", desc: "FamilyOffice AI drafts recommendations based on real-time data. A human advisor reviews and approves every decision." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-[#C9A227]/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────── */}
      <section id="benefits" className="py-24 px-6 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#C9A227] uppercase tracking-widest font-semibold mb-4">Benefits</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] tracking-tight">
              Why leading families choose FamilyOffice AI.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Consolidated Wealth Dashboard", desc: "One view across all assets — public equities, private equity, real estate, trusts, and more." },
              { title: "Real-Time Risk Monitoring", desc: "Continuous risk modeling against family objectives with automatic alerts on threshold breaches." },
              { title: "Estate-Aware AI Recommendations", desc: "Recommendations account for estate tax implications, trust structures, and inheritance goals." },
              { title: "Multi-Generational Coordination", desc: "Manage wealth across generations with individual profiles and unified family strategy." },
              { title: "Fiduciary Timing Intelligence", desc: "AI surfaces time-sensitive opportunities before they become costly problems." },
              { title: "Human Advisor Integration", desc: "Every AI recommendation is reviewed and approved by qualified human advisors." },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-lg border border-gray-100 hover-lift">
                <div className="w-8 h-8 bg-[#C9A227]/10 rounded flex items-center justify-center mb-4">
                  <div className="w-2 h-2 bg-[#C9A227] rounded-full" />
                </div>
                <h3 className="font-semibold text-[#0A1A2F] mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why It Matters ────────────────────────── */}
      <section className="bg-[#0A1A2F] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs text-[#C9A227] uppercase tracking-widest font-semibold mb-4">Why It Matters in International Finance</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                Information asymmetry and fiduciary timing are everything.
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                In high-net-worth wealth management, delays in synthesizing information cause
                significant financial losses. Traditional advisory models — where lawyers, bankers,
                and portfolio managers communicate manually — cannot achieve the speed and
                coordination that AI-native orchestration enables.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                FamilyOffice AI provides real-time, estate-aware financial decision-making that
                aligns every family member, every advisor, and every asset toward shared objectives.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Traditional Advisory", value: "Manual, slow, siloed", highlight: false },
                { label: "FamilyOffice AI", value: "Autonomous, real-time, unified", highlight: true },
              ].map((item) => (
                <div key={item.label} className={`p-6 rounded-lg border ${item.highlight ? "border-[#C9A227]/30 bg-[#C9A227]/5" : "border-white/10"}`}>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={`font-medium ${item.highlight ? "text-[#C9A227]" : "text-white/70"}`}>{item.value}</p>
                </div>
              ))}
              <div className="p-6 rounded-lg border border-[#C9A227]/30 bg-[#C9A227]/5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Result</p>
                <p className="font-medium text-[#C9A227]">Estate-aware wealth that breathes — even when you sleep.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ─────────────────────────── */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] tracking-tight mb-4">
            Ready to coordinate your family&apos;s wealth?
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Join leading multi-generational families who trust FamilyOffice AI to manage
            their most complex financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:demo@familyofficeai.com" className="btn-primary text-sm">Request Demo</a>
            <a href="mailto:hello@familyofficeai.com" className="border border-gray-300 text-[#0A1A2F] font-medium text-sm px-8 py-3 rounded hover:border-[#C9A227] transition-colors">Get in Touch</a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="bg-[#0A1A2F] py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#C9A227] rounded flex items-center justify-center text-[#0A1A2F] font-bold text-sm">F</div>
              <span className="text-white font-semibold text-sm">FamilyOffice AI</span>
            </div>
            <div className="flex flex-wrap gap-6">
              {["Privacy Policy", "Terms of Service", "Security", "Contact"].map((item) => (
                <a key={item} href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              &copy; 2026 FamilyOffice AI. All rights reserved.
            </p>
            <p className="text-white/30 text-xs">
              AI Native Enterprise · 2026
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
