'use client';

import { useState, useEffect } from 'react';

export default function LandingPage() {
  interface TickerItem {
  name: string;
  symbol: string;
  price: number | null;
  changePercent: number | null;
  positive: boolean;
}

const TICKERS = [
  { name: 'S&P 500', symbol: '^GSPC' },
  { name: 'NASDAQ', symbol: '^IXIC' },
  { name: 'Gold', symbol: 'GC=F' },
  { name: 'EUR/USD', symbol: 'EURUSD=X' },
  { name: 'GBP/CHF', symbol: 'GBPCHF=X' },
];

async function fetchTickerData() {
  try {
    const results = await Promise.all(
      TICKERS.map(async (ticker) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker.symbol)}?interval=1m&range=1d`;
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        if (!meta) throw new Error('No meta');
        const price = meta.regularMarketPrice ?? null;
        const prev = meta.chartPreviousClose ?? meta.previousClose ?? null;
        const positive = prev !== null ? price >= prev : true;
        const changePercent =
          price !== null && prev !== null && prev !== 0
            ? ((price - prev) / prev) * 100
            : null;
        return { name: ticker.name, symbol: ticker.symbol, price, positive, changePercent };
      })
    );
    return results;
  } catch {
    return TICKERS.map((t) => ({ name: t.name, symbol: t.symbol, price: null, positive: true, changePercent: null }));
  }
}

  const [tickerData, setTickerData] = useState<TickerItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    async function load() {
      const data = await fetchTickerData();
      setTickerData(data);
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      background: '#031427',
      color: '#F5F7FA',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      scrollBehavior: 'smooth',
    }}>
      <style>{`
        :root {
          --bg: #031427;
          --card: #0B1C30;
          --accent: #00D2FF;
          --text: #F5F7FA;
          --muted: #94A3B8;
          --border: rgba(0,210,255,0.15);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); }
        a { text-decoration: none; color: inherit; }
        @keyframes pulseCyan {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease-out forwards; }
        .ticker-pill { display:flex; align-items:center; gap:6px; padding:4px 14px; border-radius:20px; border:1px solid; white-space:nowrap; flex-shrink:0; }
        .ticker-pill.positive { border-color:rgba(34,197,94,0.3); background:rgba(34,197,94,0.08); }
        .ticker-pill.negative { border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.08); }

      `}</style>

      {/* ── Sticky Nav ─────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(3,20,39,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,210,255,0.08)',
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '6px',
            background: 'rgba(0,210,255,0.15)', border: '1px solid rgba(0,210,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#00D2FF', fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: 700 }}>F</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', color: '#F5F7FA', letterSpacing: '0.02em' }}>
            FamilyOffice Algorithmically Coordinated
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['Features', 'Security', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 400, transition: 'color 0.2s' }}
            >
              {item}
            </a>
          ))}
          <a
            href="/login"
            style={{
              color: '#00D2FF', fontSize: '13px', fontWeight: 500,
              padding: '8px 18px', borderRadius: '4px',
              border: '1px solid rgba(0,210,255,0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            Login
          </a>
        </div>
      </nav>

      {/* ── Market Ticker Bar ─────────────────────── */}
      <div style={{
        position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
        background: 'rgba(11,28,48,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,210,255,0.06)',
        padding: '0 2rem', height: '40px',
        display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto',
      }}>
        {tickerData.map((item) => (
          <div key={item.symbol} className={`ticker-pill ${item.positive ? 'positive' : 'negative'}`}>
            <span style={{ fontSize: '11px', fontWeight: 500, opacity: 0.8 }}>{item.name}</span>
            <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono',monospace", fontWeight: 600, color: '#F5F7FA' }}>
              {item.price !== null
                ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '—'}
            </span>
            <span style={{ fontSize: '11px', fontFamily: "'Roboto Mono',monospace", color: item.positive ? '#22C55E' : '#EF4444' }}>
              {item.changePercent !== null
                ? `${item.positive ? '+' : ''}${item.changePercent.toFixed(2)}%`
                : '—'}
            </span>
          </div>
        ))}
        {lastUpdated && (
          <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94A3B8', flexShrink: 0, fontFamily: "'Roboto Mono',monospace" }}>
            Updated {lastUpdated}
          </span>
        )}
      </div>

      {/* ── Hero Section ────────────────────────────── */}
      <section id="hero" style={{
        paddingTop: '140px', paddingBottom: '80px', paddingLeft: '2rem', paddingRight: '2rem',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,210,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px', pointerEvents: 'none',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px', background: 'rgba(0,210,255,0.06)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 48px)',
            color: '#F5F7FA', lineHeight: 1.2, marginBottom: '1.5rem', fontWeight: 600,
          }}>
            The Autonomous Wealth<br />Intelligence Agent
          </h1>
          <p style={{
            fontSize: '18px', color: '#94A3B8', lineHeight: 1.7,
            maxWidth: '560px', margin: '0 auto 2.5rem',
          }}>
            Monitor, analyze, and protect complex family wealth structures with institutional-grade AI.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <a
              href="/login"
              style={{
                background: '#00D2FF', color: '#031427',
                fontWeight: 600, fontSize: '14px', padding: '14px 32px',
                borderRadius: '4px', display: 'inline-block',
              }}
            >
              Request Private Access
            </a>
            <a
              href="#hero"
              style={{
                color: '#00D2FF', fontSize: '14px', fontWeight: 500, padding: '14px 32px',
                borderRadius: '4px', border: '1px solid rgba(0,210,255,0.3)',
                display: 'inline-block',
              }}
            >
              Watch Demo
            </a>
          </div>

          {/* Metrics Card */}
          <div style={{
            background: 'rgba(11,28,48,0.85)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,210,255,0.12)', borderRadius: '12px',
            padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem', maxWidth: '640px', margin: '0 auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            {[
              { label: 'Portfolio Value', value: '$847.3M' },
              { label: 'Risk Score', value: 'LOW' },
              { label: 'Active Alerts', value: '3' },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#00D2FF', display: 'inline-block',
                    animation: 'pulseCyan 2s ease-in-out infinite',
                  }} />
                  <span style={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {m.label}
                  </span>
                </div>
                <span style={{ color: '#F5F7FA', fontSize: '22px', fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ─────────────────────────────── */}
      <section style={{
        padding: '24px 2rem',
        borderTop: '1px solid rgba(0,210,255,0.08)',
        borderBottom: '1px solid rgba(0,210,255,0.08)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {['Multi-Generational Families', 'Private Offices', 'Wealth Advisors', 'Institutional Partners'].map((item, i, arr) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: '#94A3B8', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {item}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: 'rgba(0,210,255,0.25)', fontSize: '12px' }}>·</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* ── Core Capabilities ─────────────────────── */}
      <section id="features" style={{ padding: '80px 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#F5F7FA', textAlign: 'center', marginBottom: '3rem', fontWeight: 600,
          }}>
            Core Capabilities
          </h2>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { icon: '◈', title: 'Consolidated Wealth Dashboard', desc: 'Unified view across all asset classes, custodians, and geographies in real time.' },
              { icon: '◉', title: 'AI Risk Monitoring', desc: 'Continuous risk modeling with automated alerts on threshold breaches and market events.' },
              { icon: '◇', title: 'Investment Intelligence', desc: 'Deep analysis of performance, attribution, and opportunity identification powered by ML.' },
              { icon: '◐', title: 'Succession Planning', desc: 'Estate-aware wealth transfer intelligence across trust structures and inheritance goals.' },
              { icon: '▢', title: 'Document Intelligence', desc: 'AI-parsed trust deeds, wills, and legal instruments. Versioned and searchable.' },
              { icon: '▽', title: 'Private Collaboration', desc: 'Secure communication between family members, advisors, and custodians with full audit trails.' },
            ].map((card) => (
              <div key={card.title} style={{
                background: 'rgba(11,28,48,0.8)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,210,255,0.15)', borderRadius: '12px',
                padding: '1.5rem', transition: 'all 0.3s ease',
              }}>
                <span style={{ color: '#00D2FF', fontSize: '18px', display: 'block', marginBottom: '12px' }}>{card.icon}</span>
                <h3 style={{ color: '#F5F7FA', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>{card.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ─────────────────────────────── */}
      <section id="security" style={{
        padding: '80px 2rem', background: 'rgba(11,28,48,0.4)',
        borderTop: '1px solid rgba(0,210,255,0.06)',
        borderBottom: '1px solid rgba(0,210,255,0.06)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#F5F7FA', textAlign: 'center', marginBottom: '3rem', fontWeight: 600,
          }}>
            Built for Confidential Capital
          </h2>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { title: 'End-to-End Encryption', desc: 'AES-256 encryption for data in transit and at rest.' },
              { title: 'Role-Based Access', desc: 'Granular permissions for family members, advisors, and custodians.' },
              { title: 'Audit Trails', desc: 'Complete logging of all access and actions for compliance.' },
              { title: 'Swiss-Grade Privacy', desc: 'Hosted in Swiss data centers with strict privacy regulations.' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#00D2FF', fontSize: '16px', marginTop: '2px', flexShrink: 0 }}>✓</span>
                <div>
                  <h3 style={{ color: '#F5F7FA', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '12px', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────── */}
      <section id="about" style={{ padding: '80px 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 3.5vw, 36px)',
            color: '#F5F7FA', marginBottom: '1.5rem', fontWeight: 600,
          }}>
            About FamilyOffice AI
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.8 }}>
            FamilyOffice AI is an autonomous intelligence platform designed to help ultra-high-net-worth families
            manage wealth, governance, and legacy with precision. We combine institutional-grade technology with
            deep expertise in family wealth structures to deliver real-time intelligence across portfolios,
            estate plans, and family governance.
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer style={{
        padding: '32px 2rem', borderTop: '1px solid rgba(0,210,255,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '4px',
            background: 'rgba(0,210,255,0.15)', border: '1px solid rgba(0,210,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#00D2FF', fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 700 }}>F</span>
          </div>
          <span style={{ color: '#F5F7FA', fontFamily: "'Playfair Display', serif", fontSize: '12px' }}>FamilyOffice AI</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <a key={item} href="#" style={{ color: '#94A3B8', fontSize: '12px' }}>{item}</a>
          ))}
        </div>
        <span style={{ color: '#94A3B8', fontSize: '12px' }}>© 2026 FamilyOffice AI</span>
      </footer>
    </div>
  );
}
