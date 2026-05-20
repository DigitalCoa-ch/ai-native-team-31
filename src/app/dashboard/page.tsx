'use client';

import { useState, useEffect } from 'react';

const METRICS = [
  { label: 'Total AUM', value: '$847.3M', status: 'live' as const },
  { label: 'Risk Score', value: 'LOW', status: 'synced' as const },
  { label: 'Active Positions', value: '142', status: 'live' as const },
  { label: 'Custodian Sync', value: '100%', status: 'synced' as const },
];

const NAV_ITEMS = [
  { icon: '◈', label: 'Overview', active: true },
  { icon: '◇', label: 'Portfolio', active: false },
  { icon: '▽', label: 'Analytics', active: false },
  { icon: '▢', label: 'Documents', active: false },
  { icon: '◐', label: 'Advisors', active: false },
];

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [now, setNow] = useState('');

  useEffect(() => {
    // In a real app this would come from auth context/session
    setUserEmail('j.whitmore@familyoffice.com');
    const tick = () => {
      setNow(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#031427', color: '#F5F7FA', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
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
        body { background: var(--bg); }
        .status-pip { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .status-pip.live { background: #00D2FF; animation: pulse 2s ease-in-out infinite; }
        .status-pip.synced { background: #22C55E; }
        .status-pip.alert { background: #EF4444; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { border-color: rgba(0,210,255,0.3); transform: translateY(-1px); }
      `}</style>

      {/* ── Sidebar ──────────────────────────────── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '224px',
        background: 'rgba(11,28,48,0.85)', backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(0,210,255,0.08)',
        display: 'flex', flexDirection: 'column', zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,210,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '6px',
              background: 'rgba(0,210,255,0.15)', border: '1px solid rgba(0,210,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#00D2FF', fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: 700 }}>F</span>
            </div>
            <div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', color: '#F5F7FA' }}>FamilyOffice</span>
              <span style={{ display: 'block', fontSize: '10px', color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Platform</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '6px',
                border: item.active ? '1px solid rgba(0,210,255,0.2)' : '1px solid transparent',
                background: item.active ? 'rgba(0,210,255,0.1)' : 'transparent',
                color: item.active ? '#00D2FF' : '#94A3B8',
                fontSize: '13px', fontWeight: 400, transition: 'all 0.2s',
                cursor: 'pointer', width: '100%', textAlign: 'left',
              }}
            >
              <span style={{ opacity: 0.6, fontSize: '11px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* System Status */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,210,255,0.08)' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>System Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="status-pip synced"></span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Roboto Mono', monospace" }}>All Systems Nominal</span>
          </div>
        </div>
      </aside>

      {/* ── Header ──────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: '224px', right: 0, height: '56px',
        background: 'rgba(11,28,48,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,210,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '14px', fontFamily: "'Playfair Display', serif", color: '#F5F7FA' }}>Command Center</h1>
          <span style={{ color: '#94A3B8', fontSize: '12px' }}>|</span>
          <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Roboto Mono', monospace" }}>{now}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ padding: '8px', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <span style={{ fontSize: '14px' }}>🔔</span>
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid rgba(0,210,255,0.1)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#F5F7FA' }}>{userEmail}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Principal</div>
            </div>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(0,210,255,0.15)', border: '1px solid rgba(0,210,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#00D2FF', fontSize: '11px', fontFamily: "'Playfair Display', serif" }}>JW</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────── */}
      <main style={{ marginLeft: '224px', paddingTop: '56px' }}>
        {/* Welcome Header */}
        <div style={{ padding: '40px 32px 24px', borderBottom: '1px solid rgba(0,210,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="status-pip live"></span>
            <span style={{ fontSize: '11px', color: '#00D2FF', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Roboto Mono', monospace" }}>Authenticated</span>
          </div>
          <h2 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", color: '#F5F7FA', marginBottom: '4px' }}>
            Welcome back, {userEmail}
          </h2>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>Here is your wealth intelligence overview for today.</p>
        </div>

        {/* Metric Cards */}
        <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {METRICS.map((m) => (
            <div key={m.label} style={{
              background: 'rgba(11,28,48,0.85)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,210,255,0.12)', borderRadius: '12px',
              padding: '20px', transition: 'all 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.label}</span>
                <span className={`status-pip ${m.status}`}></span>
              </div>
              <span style={{
                fontSize: '24px', color: '#F5F7FA',
                fontFamily: "'Roboto Mono', monospace", fontWeight: 600,
              }}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Placeholder Content Area */}
        <div style={{ padding: '0 32px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div style={{
            background: 'rgba(11,28,48,0.85)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,210,255,0.12)', borderRadius: '12px',
            padding: '24px',
          }}>
            <h3 style={{ fontSize: '14px', color: '#F5F7FA', marginBottom: '16px', fontFamily: "'Playfair Display', serif" }}>Portfolio Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Public Equities', 'Private Equity', 'Fixed Income', 'Real Estate'].map((asset, i, arr) => (
                <div key={asset} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#F5F7FA' }}>{asset}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '120px', height: '4px', background: 'rgba(0,210,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${[42, 18, 22, 11][i]}%`,
                        height: '100%',
                        background: '#00D2FF',
                        borderRadius: '2px',
                      }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Roboto Mono', monospace", minWidth: '40px', textAlign: 'right' }}>{[42, 18, 22, 11][i]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'rgba(11,28,48,0.85)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,210,255,0.12)', borderRadius: '12px',
            padding: '24px',
          }}>
            <h3 style={{ fontSize: '14px', color: '#F5F7FA', marginBottom: '16px', fontFamily: "'Playfair Display', serif" }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { time: '09:41', msg: 'Capital Call v2026-Q2 Executed', type: 'success' },
                { time: '09:38', msg: 'K-1 Parsed: Fund 09-K (Apollo)', type: 'info' },
                { time: '09:30', msg: 'Custodian Reconciliation: Schwab', type: 'success' },
                { time: '09:15', msg: 'Rebalancing Threshold: Fixed Income', type: 'alert' },
              ].map((log) => (
                <div key={log.msg} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: "'Roboto Mono', monospace", marginTop: '2px' }}>{log.time}</span>
                  <span style={{
                    fontSize: '12px', color: log.type === 'alert' ? '#EF4444' : log.type === 'success' ? '#22C55E' : '#94A3B8',
                  }}>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}