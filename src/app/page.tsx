'use client';

import { useState, useEffect } from 'react';

interface MetricSatellite {
  label: string;
  value: string;
  status: 'live' | 'synced' | 'alert';
}

interface AssetRow {
  class: string;
  exposure: string;
  target: string;
  variance: string;
  status: 'on-track' | 'drift' | 'alert';
}

interface LogEntry {
  time: string;
  type: 'success' | 'info' | 'alert';
  message: string;
}

const METRICS: MetricSatellite[] = [
  { label: 'Total AUM', value: '$847.3M', status: 'live' },
  { label: 'Custodian Sync', value: '100%', status: 'synced' },
  { label: 'Active Positions', value: '142', status: 'live' },
  { label: 'Risk Score', value: 'LOW', status: 'synced' },
];

const ASSETS: AssetRow[] = [
  { class: 'Public Equities', exposure: '42.1%', target: '40.0%', variance: '+2.1%', status: 'drift' },
  { class: 'Private Equity', exposure: '18.7%', target: '20.0%', variance: '-1.3%', status: 'drift' },
  { class: 'Fixed Income', exposure: '22.4%', target: '25.0%', variance: '-2.6%', status: 'alert' },
  { class: 'Real Estate', exposure: '11.2%', target: '10.0%', variance: '+1.2%', status: 'on-track' },
  { class: 'Commodities & FX', exposure: '5.6%', target: '5.0%', variance: '+0.6%', status: 'on-track' },
];

const LOGS: LogEntry[] = [
  { time: '09:41:02', type: 'success', message: 'Capital Call v2026-Q2 Executed — $12.4M' },
  { time: '09:38:17', type: 'info', message: 'K-1 Parsed: Fund 09-K (Apollo) — 847 lines' },
  { time: '09:30:00', type: 'success', message: 'Custodian Reconciliation: Schwab' },
  { time: '09:15:44', type: 'alert', message: 'Rebalancing Threshold: Fixed Income -2.6%' },
  { time: '08:55:21', type: 'info', message: 'Estate Doc Indexed: 2024 Trust Amendment' },
  { time: '08:42:09', type: 'success', message: 'Risk Model Refresh — Q2 2026 Baseline' },
];

function Sidebar({ active }: { active: string }) {
  const nav = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'portfolio', label: 'Portfolio', icon: '◇' },
    { id: 'analytics', label: 'Analytics', icon: '▽' },
    { id: 'documents', label: 'Documents', icon: '▢' },
    { id: 'advisors', label: 'Advisors', icon: '◐' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-surface-container border-r border-border-muted flex flex-col z-40">
      <div className="px-6 py-5 border-b border-border-muted">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal/20 border border-teal/40 flex items-center justify-center">
            <span className="text-teal text-sm font-mono font-bold">F</span>
          </div>
          <div>
            <span className="text-text-primary font-serif text-sm tracking-wide">FamilyOffice</span>
            <span className="block text-[10px] text-text-muted tracking-widest uppercase">AI Platform</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
              active === item.id
                ? 'bg-teal/10 text-teal border border-teal/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            <span className="text-xs opacity-60">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border-muted">
        <div className="text-[10px] text-text-muted uppercase tracking-widest mb-3">System Status</div>
        <div className="flex items-center gap-2">
          <span className="status-pip success animate-pulse" />
          <span className="text-xs text-text-secondary font-mono">All Systems Nominal</span>
        </div>
      </div>
    </aside>
  );
}

function TopHeader() {
  const [time, setTime] = useState('09:41:22');
  
  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <header className="fixed top-0 left-56 right-0 h-14 bg-surface-container/95 backdrop-blur border-b border-border-muted flex items-center justify-between px-6 z-30">
      <div className="flex items-center gap-6">
        <h1 className="text-sm font-serif text-text-primary tracking-wide">Command Center</h1>
        <span className="text-xs text-text-muted font-mono">|</span>
        <div className="live-indicator">
          <span className="text-xs text-text-secondary font-mono">{time}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded hover:bg-white/5 transition-colors">
          <span className="text-text-secondary text-sm">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-alert rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border-muted">
          <div className="text-right">
            <div className="text-xs text-text-primary">J. Whitmore</div>
            <div className="text-[10px] text-text-muted">Principal</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
            <span className="text-gold text-xs font-serif">JW</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function AINodeGraphic() {
  return (
    <div className="relative w-40 h-40 mx-auto">
      <div className="absolute inset-0 rounded-full border border-teal/20 animate-spin-slow" 
           style={{ animationDuration: '20s', animationIterationCount: 'infinite' }} />
      <div className="absolute inset-4 rounded-full border border-gold/20 animate-spin-reverse"
           style={{ animationDuration: '15s' }} />
      <div className="absolute inset-8 rounded-full bg-teal/10 border border-teal/40 glow-teal flex items-center justify-center">
        <span className="text-teal text-xl font-mono">AI</span>
      </div>

      {[
        { label: 'AUM', value: '$847M', angle: 0 },
        { label: 'Sync', value: '100%', angle: 90 },
        { label: 'Risk', value: 'LOW', angle: 180 },
        { label: 'Pos', value: '142', angle: 270 },
      ].map((sat) => {
        const rad = (sat.angle - 90) * (Math.PI / 180);
        const x = 50 + 42 * Math.cos(rad);
        const y = 50 + 42 * Math.sin(rad);
        return (
          <div
            key={sat.label}
            className="absolute w-12 h-12 bg-surface-container border border-border-muted rounded-lg flex flex-col items-center justify-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <span className="text-[9px] text-text-muted">{sat.label}</span>
            <span className="text-xs text-teal font-mono font-medium">{sat.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 px-8 text-center overflow-hidden grid-bg">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-teal/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-teal/5 border border-teal/20 rounded-full px-4 py-1.5 mb-8">
          <span className="status-pip teal animate-pulse" />
          <span className="text-teal text-xs tracking-widest uppercase font-mono">Sovereign Intelligence</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-text-primary tracking-wide mb-4 leading-tight">
          Family Wealth,
          <br />
          <span className="text-gold">Algorithmicallly Coordinated</span>
        </h1>

        <div className="my-12">
          <AINodeGraphic />
        </div>

        <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed mb-8">
          Real-time wealth intelligence across $847M in assets. Autonomous coordination of 
          portfolio, estate, and risk — with human advisor oversight at every decision.
        </p>

        <div className="flex gap-4 justify-center">
          <a href="#contact" className="btn-primary text-sm">Secure Portal</a>
          <a href="#features" className="btn-secondary text-sm">Request Demo</a>
        </div>
      </div>
    </section>
  );
}

function MetricCards() {
  return (
    <section className="px-8 py-8 border-b border-border-muted">
      <div className="grid grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-surface-container border border-border-muted rounded-lg p-4 card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-text-muted uppercase tracking-widest">{m.label}</span>
              <span className={`status-pip ${m.status === 'live' ? 'teal' : m.status === 'alert' ? 'alert' : 'success'} ${m.status === 'live' ? 'animate-pulse' : ''}`} />
            </div>
            <span className="text-xl text-text-primary font-mono font-medium">{m.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DataTerminal() {
  const getVarianceColor = (_v: string, status: string) => {
    if (status === 'alert') return 'text-alert';
    if (status === 'drift') return 'text-gold';
    return 'text-success';
  };

  return (
    <section className="px-8 py-8 border-b border-border-muted">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-gold text-sm">▣</span>
          <h2 className="text-sm font-serif text-text-primary tracking-wide">Asset Class Exposure</h2>
        </div>
        <div className="live-indicator">
          <span className="text-xs text-text-muted font-mono">Last sync: 09:41:22</span>
        </div>
      </div>

      <div className="bg-surface-container border border-border-muted rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-muted">
              <th className="text-left px-4 py-3 text-[10px] text-text-muted uppercase tracking-widest font-normal">Asset Class</th>
              <th className="text-right px-4 py-3 text-[10px] text-text-muted uppercase tracking-widest font-normal">Exposure</th>
              <th className="text-right px-4 py-3 text-[10px] text-text-muted uppercase tracking-widest font-normal">Target</th>
              <th className="text-right px-4 py-3 text-[10px] text-text-muted uppercase tracking-widest font-normal">Variance</th>
              <th className="text-center px-4 py-3 text-[10px] text-text-muted uppercase tracking-widest font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {ASSETS.map((row) => (
              <tr key={row.class} className="border-b border-border-muted/50 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3.5 text-sm text-text-primary">{row.class}</td>
                <td className="px-4 py-3.5 text-sm text-text-primary font-mono text-right">{row.exposure}</td>
                <td className="px-4 py-3.5 text-sm text-text-secondary font-mono text-right">{row.target}</td>
                <td className={`px-4 py-3.5 text-sm font-mono text-right ${getVarianceColor(row.variance, row.status)}`}>
                  {row.variance}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`status-pip ${row.status === 'on-track' ? 'success' : row.status === 'drift' ? 'gold' : 'alert'}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActivityLog() {
  return (
    <section className="px-8 py-8 border-b border-border-muted">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-gold text-sm">◈</span>
        <h2 className="text-sm font-serif text-text-primary tracking-wide">System Log</h2>
      </div>

      <div className="bg-surface-container border border-border-muted rounded-lg p-4 space-y-3 font-mono text-xs">
        {LOGS.map((log, i) => (
          <div key={i} className="flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="text-text-muted shrink-0">{log.time}</span>
            <span className={`status-pip shrink-0 mt-1.5 ${log.type === 'success' ? 'success' : log.type === 'alert' ? 'alert' : 'teal'}`} />
            <span className="text-text-secondary">{log.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCards() {
  const features = [
    { icon: '📋', title: 'Documents', desc: 'AI-parsed trust deeds, wills, and legal instruments. Versioned, searchable, accessible.', metric: '247 docs' },
    { icon: '👥', title: 'Advisors', desc: 'Coordinated counsel across private banking, legal, and tax — unified communication thread.', metric: '12 advisors' },
    { icon: '⚠️', title: 'Risk', desc: 'Continuous portfolio exposure monitoring against family-level risk parameters.', metric: '3 alerts' },
  ];

  return (
    <section id="features" className="px-8 py-8 border-b border-border-muted">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-gold text-sm">◈</span>
        <h2 className="text-sm font-serif text-text-primary tracking-wide">Coordination Pillars</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 stagger-children">
        {features.map((f) => (
          <div key={f.title} className="bg-surface-container border border-border-muted rounded-lg p-5 card-hover teal-border-hover">
            <span className="text-2xl mb-3 block">{f.icon}</span>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-serif text-text-primary">{f.title}</h3>
              <span className="text-[10px] text-teal font-mono">{f.metric}</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contact" className="px-8 py-16 text-center">
      <h2 className="text-2xl md:text-3xl font-serif text-text-primary tracking-wide mb-3">
        Ready to coordinate your family wealth?
      </h2>
      <p className="text-text-muted text-sm mb-8 max-w-lg mx-auto">
        Join leading multi-generational families who trust FamilyOffice AI to manage their most complex financial decisions.
      </p>
      <div className="flex gap-4 justify-center">
        <a href="mailto:demo@familyofficeai.com" className="btn-primary text-sm">Secure Portal</a>
        <a href="mailto:hello@familyofficeai.com" className="btn-secondary text-sm">Request Demo</a>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-deep">
      <Sidebar active="overview" />
      <TopHeader />
      
      <div className="ml-56 pt-14">
        <HeroSection />
        <MetricCards />
        <DataTerminal />
        <ActivityLog />
        <FeatureCards />
        <CTASection />
        
        <footer className="px-8 py-8 border-t border-border-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-teal/20 border border-teal/30 flex items-center justify-center">
                <span className="text-teal text-xs font-mono font-bold">F</span>
              </div>
              <span className="text-text-muted text-xs">FamilyOffice AI</span>
            </div>
            <div className="flex gap-4">
              <span className="text-text-muted text-xs">Privacy</span>
              <span className="text-text-muted text-xs">Terms</span>
              <span className="text-text-muted text-xs">Security</span>
            </div>
            <span className="text-text-muted text-xs">© 2026 FamilyOffice AI</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
