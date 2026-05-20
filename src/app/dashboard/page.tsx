// FamilyOffice AI — v1.1.8 — force redeploy now
'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const TaxStrategyView = dynamic(() => import('./TaxStrategyView'), { ssr: true });

interface TickerItem {
  name: string;
  symbol: string;
  price: number | null;
  changePercent: number | null;
  positive: boolean;
}

async function fetchTickerData(): Promise<TickerItem[]> {
  try {
    const res = await fetch('/api/market', { cache: 'no-store' });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch {
    return [];
  }
}

function TickerBar() {
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
      position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 98,
      background: 'rgba(11,28,48,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,210,255,0.06)',
      padding: '0 2rem', height: '40px',
      display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto',
    }}>
      {tickerData.map((item) => (
        <div key={item.symbol} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', border: '1px solid', borderColor: item.positive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)', background: item.positive ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', fontWeight: 500, opacity: 0.8, color: '#F5F7FA' }}>{item.name}</span>
          <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono',monospace", fontWeight: 600, color: '#F5F7FA' }}>
            {item.price !== null ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
          </span>
          <span style={{ fontSize: '11px', fontFamily: "'Roboto Mono',monospace", color: item.positive ? '#22C55E' : '#EF4444' }}>
            {item.changePercent !== null ? `${item.positive ? '+' : ''}${item.changePercent.toFixed(2)}%` : '—'}
          </span>
        </div>
      ))}
      {lastUpdated && (
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94A3B8', flexShrink: 0, fontFamily: "'Roboto Mono',monospace" }}>Updated {lastUpdated}</span>
      )}
    </div>
  );
}

const PORTFOLIO = [
  { name: 'Public Equities', value: 42, color: '#00D2FF' },
  { name: 'Private Equity',  value: 18, color: '#22C55E' },
  { name: 'Fixed Income',   value: 22, color: '#F59E0B' },
  { name: 'Real Estate',   value: 11, color: '#A855F7' },
  { name: 'Cash',          value:  7, color: '#94A3B8' },
];

const MONTHLY_AUM = [
  { month:'Jun', aum:712 }, { month:'Jul', aum:728 }, { month:'Aug', aum:745 },
  { month:'Sep', aum:731 }, { month:'Oct', aum:763 }, { month:'Nov', aum:779 },
  { month:'Dec', aum:795 }, { month:'Jan', aum:808 }, { month:'Feb', aum:821 },
  { month:'Mar', aum:835 }, { month:'Apr', aum:841 }, { month:'May', aum:847 },
];

const MONTHLY_RETURNS = [
  { month:'Dec', return: 2.1 }, { month:'Jan', return: 1.4 },
  { month:'Feb', return:-0.8 }, { month:'Mar', return: 1.9 },
  { month:'Apr', return: 0.7 }, { month:'May', return: 1.2 },
];

const DOCUMENTS = [
  { name:'Trust Deed 2024.pdf',        status:'Parsed',   date:'2026-05-15' },
  { name:'K-1 Fund Apollo.pdf',        status:'Pending',  date:'2026-05-18' },
  { name:'Estate Plan v3.pdf',         status:'Reviewed', date:'2026-05-10' },
  { name:'Schwab Reconciliation.pdf',  status:'Parsed',   date:'2026-05-19' },
];

const ADVISORS = [
  { initials:'JW', name:'J. Whitmore', role:'Principal',              status:'Active', color:'#00D2FF' },
  { initials:'AC', name:'A. Chen',    role:'Private Wealth Advisor',  status:'Active', color:'#22C55E' },
];

const NAV_ITEMS = [
  { icon:'*', label:'Overview',   view:'overview'   },
  { icon:'<>', label:'Portfolio',  view:'portfolio'  },
  { icon:'V',  label:'Analytics',  view:'analytics'  },
  { icon:'[]', label:'Documents', view:'documents'  },
  { icon:'O',  label:'Advisors',    view:'advisors'   },
  { icon:'%',  label: "Tax Strategy ✦", view: 'tax' },
  { icon:'▶', label:'Simulate',   view:'simulate'   },
];

// SVG Donut Chart
function DonutChart() {
  const total = PORTFOLIO.reduce((s, p) => s + p.value, 0);
  const cx = 130, cy = 120, r = 90, innerR = 55;
  let startAngle = -90;

  const paths = PORTFOLIO.map((p) => {
    const angle = (p.value / total) * 360;
    const start = startAngle;
    const end = startAngle + angle;
    startAngle = end;
    const toRad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const x3 = cx + innerR * Math.cos(toRad(end));
    const y3 = cy + innerR * Math.sin(toRad(end));
    const x4 = cx + innerR * Math.cos(toRad(start));
    const y4 = cy + innerR * Math.sin(toRad(start));
    const large = angle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`;
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <svg width="260" height="240" viewBox="0 0 260 240">
        {paths.map((d, i) => (
          <path key={i} d={d} fill={PORTFOLIO[i].color} stroke="#031427" strokeWidth="2" />
        ))}
        <text x="130" y="112" textAnchor="middle" fill="#F5F7FA" fontSize="22" fontFamily="'Roboto Mono',monospace" fontWeight="700">847</text>
        <text x="130" y="130" textAnchor="middle" fill="#94A3B8" fontSize="10" letterSpacing="0.1em">TOTAL AUM</text>
      </svg>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 16px', justifyContent:'center', maxWidth:280 }}>
        {PORTFOLIO.map((p) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:p.color, flexShrink:0 }} />
            <span style={{ fontSize:11, color:'#94A3B8' }}>{p.name} {p.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AUMChart({ range, onRange }: { range: string; onRange: (r: string) => void }) {
  // Live portfolio value ≈ $847.3M (NVDA 2.23M + AAPL 2.57M + TSLA 1.74M + BX 0.36M + MSFT 1.18M + BND 0.36M + GLD 0.50M + cash 0.19M)
  const LIVE = 847.3;

  // Seeded pseudo-random to keep data stable across re-renders
  function seeded(seed: number, len: number, start: number, end: number, labels: string[]) {
    let s = seed;
    return Array.from({ length: len }, (_, i) => {
      s = (s * 16807) % 2147483647;
      const t = len === 1 ? 0.5 : i / (len - 1);
      const base = start + (end - start) * t;
      const noise = (s / 2147483647 - 0.5) * (end - start) * 0.18;
      return { label: labels[i] ?? String(i + 1), aum: parseFloat((base + noise).toFixed(2)) };
    });
  }

  const ALL_DATA = [
    // 1D — 7 hourly intraday points (9:30am–4pm), small noise around LIVE
    { data: (() => {
      const opens = [843.1, 844.3, 846.8, 845.2, 847.9, 846.5, 847.3];
      const lbls  = ['09:30','10:30','11:30','12:30','13:30','14:30','15:30'];
      return opens.map((v,i) => ({ label: lbls[i], aum: v }));
    })() },
    // 1W — 7 daily points, moderate ups and downs around LIVE
    { data: (() => {
      const vals = [838.4, 841.9, 839.7, 843.2, 840.1, 845.8, 847.3];
      const dys  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      return vals.map((v,i) => ({ label: dys[i], aum: v }));
    })() },
    // 1M — 30 daily points, visible upward trend with noise
    { data: (() => {
      let s = 9871;
      const pts: { label: string; aum: number }[] = [];
      for (let i = 0; i < 30; i++) {
        s = (s * 16807) % 2147483647;
        const t = i / 29;
        const trend = 818 + 29.3 * t;
        const noise = (s / 2147483647 - 0.5) * 8;
        const d = new Date(2026, 3, 21 - (29 - i)); // April 21 → May 20
        const lbl = `${d.getMonth()+1}/${d.getDate()}`;
        pts.push({ label: lbl, aum: parseFloat((trend + noise).toFixed(2)) });
      }
      pts[pts.length - 1].aum = LIVE; // anchor last point to live
      return pts;
    })() },
    // 3M — 13 weekly points (≈ 13 weeks in 3 months)
    { data: seeded(54321, 13, 808, LIVE, ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12','W13']) },
    // 6M — 26 bi-weekly points, clear growth curve
    { data: (() => {
      let s = 77777;
      return Array.from({ length: 26 }, (_, i) => {
        s = (s * 16807) % 2147483647;
        const t = i / 25;
        const base = 750 + 97.3 * t;
        const noise = (s / 2147483647 - 0.5) * 12;
        return { label: `W${i*2+1}`, aum: parseFloat((base + noise).toFixed(2)) };
      });
    })() },
    // 1Y — 12 monthly points (Jun 2025 → May 2026)
    { data: MONTHLY_AUM },
    // YTD — 5 monthly points Jan–May 2026
    { data: [
      { label:'Jan', aum:808.0 },{ label:'Feb', aum:821.4 },
      { label:'Mar', aum:834.9 },{ label:'Apr', aum:841.2 },
      { label:'May', aum:LIVE },
    ] },
    // All — 5 yearly points 2021–2025, clear long-term growth
    { data: [
      { label:'2021', aum:602.3 },{ label:'2022', aum:641.8 },
      { label:'2023', aum:705.4 },{ label:'2024', aum:778.6 },
      { label:'2025', aum:LIVE },
    ] },
  ];

  const RANGES = ['1D','1W','1M','3M','6M','1Y','YTD','All'];
  const idx = RANGES.indexOf(range);
  const data = idx >= 0 ? ALL_DATA[idx].data : ALL_DATA[5].data;

  const w = 520, h = 180, pad = { top:10, right:20, bottom:30, left:55 };
  const iw = w - pad.left - pad.right, ih = h - pad.top - pad.bottom;
  const minV = Math.min(...data.map(d => d.aum)) * 0.97;
  const maxV = Math.max(...data.map(d => d.aum)) * 1.03;
  const xOf = (i: number) => pad.left + (data.length === 1 ? iw / 2 : i / (data.length - 1)) * iw;
  const yOf = (v: number) => pad.top + ih - ((v - minV) / (maxV - minV)) * ih;
  const pts = data.map((d, i) => `${xOf(i)},${yOf(d.aum)}`).join(' ');
  const area = [pts, `${xOf(data.length-1)},${pad.top+ih}`, `${xOf(0)},${pad.top+ih}`].join(' ');

  return (
    <div>
      <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
        {RANGES.map((r) => (
          <button key={r} onClick={() => onRange(r)}
            style={{ background: r === range ? 'rgba(0,210,255,0.15)' : 'transparent', border: `1px solid ${r === range ? 'rgba(0,210,255,0.4)' : 'rgba(0,210,255,0.1)'}`, color: r === range ? '#00D2FF' : '#94A3B8', fontSize: '11px', fontFamily: "'Roboto Mono',monospace", padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: r === range ? 600 : 400, letterSpacing:'0.04em', transition:'all 0.15s' }}>
            {r}
          </button>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow:'visible' }}>
        <defs>
          <linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polyline points={area} fill="url(#aumGrad)" />
        <polyline points={pts} fill="none" stroke="#00D2FF" strokeWidth="2" strokeLinejoin="round" />
        {data.map((d, i) => {
          const fontSize = data.length > 20 ? '8' : data.length > 10 ? '9' : '10';
          return (
            <g key={i}>
              <circle cx={xOf(i)} cy={yOf(d.aum)} r="3" fill="#00D2FF" />
              <text x={xOf(i)} y={h-4} textAnchor="middle" fill="#94A3B8" fontSize={fontSize} fontFamily="'Roboto Mono',monospace">{d.label}</text>
            </g>
          );
        })}
        <text x={pad.left-4} y={pad.top} textAnchor="end" fill="#94A3B8" fontSize="10" fontFamily="'Roboto Mono',monospace">${maxV.toFixed(0)}M</text>
        <text x={pad.left-4} y={pad.top+ih} textAnchor="end" fill="#94A3B8" fontSize="10" fontFamily="'Roboto Mono',monospace">${minV.toFixed(0)}M</text>
      </svg>
    </div>
  );
}

function ReturnsBarChart() {
  const w = 440, h = 200, pad = { top:10, right:20, bottom:35, left:45 };
  const iw = w - pad.left - pad.right, ih = h - pad.top - pad.bottom;
  const data = MONTHLY_RETURNS;
  const minV = Math.min(...data.map(d => d.return)) - 0.5;
  const maxV = Math.max(...data.map(d => d.return)) + 0.5;
  const bw = iw / data.length * 0.6;
  const y0 = pad.top + ih - ((0 - minV) / (maxV - minV)) * ih;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow:'visible' }}>
      <line x1={pad.left} y1={y0} x2={pad.left+iw} y2={y0} stroke="rgba(0,210,255,0.15)" strokeDasharray="4 4" />
      {data.map((d, i) => {
        const x = pad.left + (i + 0.2) / data.length * iw;
        const bh = Math.abs(d.return / (maxV - minV)) * ih;
        const y = d.return >= 0 ? y0 - bh : y0;
        const color = d.return >= 0 ? '#22C55E' : '#EF4444';
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} fill={color} rx="3" opacity="0.85" />
            <text x={x + bw/2} y={h-5} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Roboto Mono',monospace">{d.month}</text>
            <text x={x + bw/2} y={d.return >= 0 ? y-4 : y+bh+14} textAnchor="middle" fill={color} fontSize="10" fontFamily="'Roboto Mono',monospace">{d.return > 0 ? '+' : ''}{d.return}%</text>
          </g>
        );
      })}
    </svg>
  );
}

function RiskGauge({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score));
  const color = score < 40 ? '#22C55E' : score < 70 ? '#F59E0B' : '#EF4444';
  const c = 2 * Math.PI * 54;
  const offset = c * (1 - clamped / 100);
  return (
    <div style={{ position:'relative', width:140, height:140, margin:'0 auto', textAlign:'center' }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(0,210,255,0.08)" strokeWidth="10" />
        <circle cx="70" cy="70" r="54" fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={String(c)} strokeDashoffset={String(offset)} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:'26px', fontFamily:"'Roboto Mono',monospace", fontWeight:700, color:'#F5F7FA' }}>{clamped}</span>
        <span style={{ fontSize:'10px', color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.1em' }}>Risk</span>
      </div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active:'badge-green', Parsed:'badge-blue', Pending:'badge-amber', Reviewed:'badge-green',
  };
  return <span className={`badge ${map[status] ?? 'badge-blue'}`}>{status}</span>;
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background:'rgba(11,28,48,0.85)', backdropFilter:'blur(12px)', border:'1px solid rgba(0,210,255,0.12)', borderRadius:'12px', padding:'20px', ...style }}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ color:'#F5F7FA', fontSize:'15px', fontFamily:"'Playfair Display',serif", marginBottom:'16px' }}>{children}</h3>;
}

function MetricCard({ label, value, status }: { label:string; value:string; status:string }) {
  return (
    <div style={{ background:'rgba(11,28,48,0.85)', backdropFilter:'blur(12px)', border:'1px solid rgba(0,210,255,0.12)', borderRadius:'12px', padding:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <span style={{ fontSize:'11px', color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</span>
        <span className={`status-pip ${status}`} />
      </div>
      <span style={{ fontSize:'24px', color:'#F5F7FA', fontFamily:"'Roboto Mono',monospace", fontWeight:600 }}>{value}</span>
    </div>
  );
}

function Overview({ userEmail, chartRange, onChartRange }: { userEmail: string; chartRange: string; onChartRange: (r: string) => void }) {
  return (
    <>
      <div style={{ padding:'40px 32px 24px', borderBottom:'1px solid rgba(0,210,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
          <span className="status-pip live" />
          <span style={{ fontSize:'11px', color:'#00D2FF', textTransform:'uppercase', letterSpacing:'0.15em', fontFamily:"'Roboto Mono',monospace" }}>Authenticated</span>
        </div>
        <h2 style={{ fontSize:'28px', fontFamily:"'Playfair Display',serif", color:'#F5F7FA', marginBottom:'4px' }}>Welcome back, {userEmail}</h2>
        <p style={{ fontSize:'14px', color:'#94A3B8' }}>Your wealth intelligence overview — May 2026.</p>
      </div>
      <div style={{ padding:'0 32px 24px' }}>
        <Card><SectionTitle>Portfolio Performance — 12 Months</SectionTitle><AUMChart range={chartRange} onRange={onChartRange} /></Card>
      </div>
      <div style={{ padding:'0 32px 24px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
        <MetricCard label="Total AUM" value="$847.3M" status="live" />
        <MetricCard label="Risk Score" value="LOW" status="synced" />
        <MetricCard label="Active Positions" value="142" status="live" />
        <MetricCard label="Custodian Sync" value="100%" status="synced" />
      </div>
    </>
  );
}

interface Holding {
  name: string;
  ticker: string;
  shares: number;
  avgBuy: number;
}

interface Quote {
  ticker: string;
  price: number | null;
  change: number | null;
}

const HOLDINGS: Holding[] = [
  { name: 'NVIDIA',            ticker: 'NVDA', shares: 10000, avgBuy: 45   },
  { name: 'Apple',             ticker: 'AAPL', shares: 8500,  avgBuy: 142  },
  { name: 'Tesla',             ticker: 'TSLA', shares: 4200,  avgBuy: 210  },
  { name: 'Blackstone',        ticker: 'BX',   shares: 3100,  avgBuy: 88   },
  { name: 'Microsoft',         ticker: 'MSFT', shares: 2800,  avgBuy: 310  },
  { name: 'Vanguard Bond ETF', ticker: 'BND',  shares: 5000,  avgBuy: 72   },
  { name: 'Gold ETF',          ticker: 'GLD',  shares: 1200,  avgBuy: 168  },
];
const CASH_USD = 191100;

function fmt(v: number | null, dec = 2) {
  if (v === null) return '—';
  return v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function green(v: number | null) { return v !== null && v >= 0; }
function red(v: number | null)   { return v !== null && v < 0; }

function TradeRow({ type, date, asset, ticker, shares, price, total, status }: { type: 'Buy'|'Sell'; date: string; asset: string; ticker: string; shares: number; price: number; total: number; status: 'Filled'|'Pending' }) {
  const tc = type === 'Buy' ? '#22C55E' : '#F59E0B';
  const sc = status === 'Filled' ? '#94A3B8' : '#F59E0B';
  return (
    <tr style={{ borderBottom: '1px solid rgba(0,210,255,0.05)' }}>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#94A3B8', fontFamily: "'Roboto Mono',monospace" }}>{date}</td>
      <td style={{ padding: '9px 14px', fontSize: '12px', fontWeight: 600, color: tc }}>{type}</td>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#F5F7FA' }}>{asset}</td>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#94A3B8', fontFamily: "'Roboto Mono',monospace" }}>{ticker}</td>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#F5F7FA', fontFamily: "'Roboto Mono',monospace", textAlign: 'right' }}>{shares.toLocaleString()}</td>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#00D2FF', fontFamily: "'Roboto Mono',monospace", textAlign: 'right' }}>${price.toFixed(2)}</td>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#F5F7FA', fontFamily: "'Roboto Mono',monospace", textAlign: 'right' }}>${total.toLocaleString()}</td>
      <td style={{ padding: '9px 14px', fontSize: '11px', color: sc, fontFamily: "'Roboto Mono',monospace" }}>{status}</td>
    </tr>
  );
}

function DecisionRow({ date, suggestion, asset, reasoning, risk, decision }: { date: string; suggestion: string; asset: string; reasoning: string; risk: 'Low'|'Medium'|'High'; decision: 'Approved'|'Declined' }) {
  const rc = risk === 'High' ? '#EF4444' : risk === 'Medium' ? '#F59E0B' : '#22C55E';
  const dc = decision === 'Approved' ? '#22C55E' : '#EF4444';
  return (
    <tr style={{ borderBottom: '1px solid rgba(0,210,255,0.05)' }}>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#94A3B8', fontFamily: "'Roboto Mono',monospace" }}>{date}</td>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#F5F7FA', maxWidth: '200px' }}>{suggestion}</td>
      <td style={{ padding: '9px 14px', fontSize: '12px', color: '#00D2FF' }}>{asset}</td>
      <td style={{ padding: '9px 14px', fontSize: '11px', color: '#94A3B8', maxWidth: '180px' }}>{reasoning}</td>
      <td style={{ padding: '9px 14px', fontSize: '11px', fontWeight: 600, color: rc }}>{risk}</td>
      <td style={{ padding: '9px 14px', fontSize: '11px', fontWeight: 600 }}>
        <span style={{ padding: '2px 8px', borderRadius: '12px', background: `${dc}18`, border: `1px solid ${dc}44`, color: dc }}>{decision}</span>
      </td>
    </tr>
  );
}

function PortfolioView({ chartRange, onChartRange }: { chartRange: string; onChartRange: (r: string) => void }) {
  const [tab, setTab] = useState<'holdings' | 'trade' | 'decisions'>('holdings');
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [stale, setStale] = useState(false);
  const [search, setSearch] = useState('');
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  useEffect(() => {
    async function load() {
      setStale(false);
      try {
        const r = await fetch('/api/stocks', { cache: 'no-store' });
        if (!r.ok) throw new Error();
        const data: Record<string, Quote> = await r.json();
        setQuotes(data);
        setStale(false);
        setLastFetch(new Date());
      } catch {
        setStale(true);
      }
    }
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  const rows = HOLDINGS.map((h) => {
    const q = quotes[h.ticker] ?? { ticker: h.ticker, price: null, change: null };
    const price = q.price;
    const value = price !== null ? price * h.shares : null;
    const pnl = price !== null ? (price - h.avgBuy) * h.shares : null;
    const pnlPct = price !== null ? ((price - h.avgBuy) / h.avgBuy) * 100 : null;
    return { ...h, price, value, pnl, pnlPct, dayChange: q.change };
  });

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name.toLowerCase().includes(q) || r.ticker.toLowerCase().includes(q);
  });

  const cashRow = { name: 'Cash (USD)', ticker: '—', shares: '—', avgBuy: '—', price: null, value: CASH_USD, pnl: 0, pnlPct: 0, dayChange: null };
  const allRows = [...filtered, cashRow];

  const totalValue = rows.reduce((s, r) => s + (r.value ?? 0), 0) + CASH_USD;
  const totalPnL   = rows.reduce((s, r) => s + (r.pnl ?? 0), 0);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(3,20,39,0.6)', border: '1px solid rgba(0,210,255,0.15)',
    borderRadius: '6px', color: '#F5F7FA', fontSize: '13px',
    fontFamily: "'Roboto Mono',monospace", padding: '8px 12px', outline: 'none', width: '240px',
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontFamily: "'Playfair Display',serif", color: '#F5F7FA', marginBottom: '4px' }}>Portfolio</h2>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>Asset class breakdown and performance history.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ticker..."
            style={inputStyle}
          />
        </div>
      </div>

      {/* ── Tab bar ─────────────────────── */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '16px', borderBottom: '1px solid rgba(0,210,255,0.1)' }}>
        {(['holdings','trade','decisions'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 18px', fontSize: '12px', fontFamily: "'Roboto Mono',monospace", fontWeight: t === tab ? 600 : 400, color: t === tab ? '#00D2FF' : '#94A3B8', background: 'transparent', border: 'none', borderBottom: t === tab ? '2px solid #00D2FF' : '2px solid transparent', cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.04em', marginBottom: '-1px', transition: 'all 0.15s' }}>
            {t === 'trade' ? 'Trade History' : t === 'decisions' ? 'Decision History' : 'Holdings'}
          </button>
        ))}
      </div>

      {/* ── Holdings table ─────────────── */}
      {tab === 'holdings' && (
        <>
          {stale && (
            <div style={{ marginBottom: '12px', padding: '8px 12px', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '6px', fontSize: '11px', color: '#94A3B8', fontFamily: "'Roboto Mono',monospace" }}>
              Live prices unavailable — showing last known data
            </div>
          )}
          <div style={{ background: 'rgba(11,28,48,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,210,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,210,255,0.1)' }}>
                    {['Asset', 'Ticker', 'Shares', 'Avg Buy', 'Live Price', 'Total Value', 'P&L ($)', 'P&L (%)', '1D Change'].map((h) => (
                      <th key={h} style={{ textAlign: 'right', padding: '10px 14px', fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allRows.map((r, i) => {
                    const isCash = r.ticker === '—';
                    const p = green(r.pnl) ? '#22C55E' : red(r.pnl) ? '#EF4444' : '#F5F7FA';
                    const d = green(r.dayChange) ? '#22C55E' : red(r.dayChange) ? '#EF4444' : '#F5F7FA';
                    return (
                      <tr key={r.ticker} style={{ borderBottom: i < allRows.length - 1 ? '1px solid rgba(0,210,255,0.05)' : 'none', background: isCash ? 'rgba(0,210,255,0.03)' : 'transparent' }}>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: '#F5F7FA', fontWeight: isCash ? 600 : 400 }}>{r.name}</td>
                        <td style={{ padding: '10px 14px', fontSize: '12px', color: '#94A3B8', fontFamily: "'Roboto Mono',monospace" }}>{r.ticker}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: '#F5F7FA', fontFamily: "'Roboto Mono',monospace", textAlign: 'right' }}>{r.shares === '—' ? '—' : Number(r.shares).toLocaleString()}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: '#94A3B8', fontFamily: "'Roboto Mono',monospace", textAlign: 'right' }}>{r.avgBuy === '—' ? '—' : `$${Number(r.avgBuy).toLocaleString()}`}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: '#00D2FF', fontFamily: "'Roboto Mono',monospace", textAlign: 'right', fontWeight: 600 }}>{r.price !== null ? `$${fmt(r.price)}` : <span style={{ color: '#94A3B8' }}>—</span>}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: '#F5F7FA', fontFamily: "'Roboto Mono',monospace", textAlign: 'right' }}>{r.value !== null ? `$${fmt(r.value)}` : <span style={{ color: '#94A3B8' }}>—</span>}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: p, fontFamily: "'Roboto Mono',monospace", textAlign: 'right', fontWeight: 600 }}>{r.pnl !== null ? `${r.pnl >= 0 ? '+' : ''}$${fmt(r.pnl)}` : <span style={{ color: '#94A3B8' }}>—</span>}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: p, fontFamily: "'Roboto Mono',monospace", textAlign: 'right', fontWeight: 600 }}>{r.pnlPct !== null ? `${r.pnlPct >= 0 ? '+' : ''}${fmt(r.pnlPct)}%` : <span style={{ color: '#94A3B8' }}>—</span>}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: d, fontFamily: "'Roboto Mono',monospace", textAlign: 'right', fontWeight: 600 }}>{r.dayChange !== null ? `${r.dayChange >= 0 ? '+' : ''}${fmt(r.dayChange)}%` : <span style={{ color: '#94A3B8' }}>—</span>}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ borderTop: '2px solid rgba(0,210,255,0.2)', background: 'rgba(0,210,255,0.04)' }}>
                    <td colSpan={5} style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: '#F5F7FA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Portfolio</td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: '#00D2FF', fontFamily: "'Roboto Mono',monospace", textAlign: 'right', fontWeight: 700 }}>${fmt(totalValue)}</td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: totalPnL >= 0 ? '#22C55E' : '#EF4444', fontFamily: "'Roboto Mono',monospace", textAlign: 'right', fontWeight: 700 }}>{totalPnL >= 0 ? '+' : ''}$${fmt(totalPnL)}</td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Trade History table ────────── */}
      {tab === 'trade' && (
        <div style={{ background: 'rgba(11,28,48,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,210,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,210,255,0.1)' }}>
                {['Date','Type','Asset','Ticker','Shares','Price','Total Value','Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'right', padding: '10px 14px', fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <TradeRow type="Buy"  date="2026-05-19" asset="NVIDIA"           ticker="NVDA" shares={200}  price={221.85} total={44_370}   status="Filled" />
              <TradeRow type="Sell" date="2026-05-17" asset="Apple"            ticker="AAPL" shares={500}  price={300.42} total={150_210} status="Filled" />
              <TradeRow type="Buy"  date="2026-05-14" asset="Tesla"           ticker="TSLA" shares={150}  price={408.10} total={61_215}   status="Filled" />
              <TradeRow type="Buy"  date="2026-05-10" asset="Vanguard Bond ETF" ticker="BND"  shares={1000} price={72.34}  total={72_340}   status="Filled" />
              <TradeRow type="Sell" date="2026-05-08" asset="Gold ETF"         ticker="GLD"  shares={80}   price={415.60} total={33_248}   status="Filled" />
              <TradeRow type="Buy"  date="2026-05-05" asset="NVIDIA"           ticker="NVDA" shares={300}  price={198.40} total={59_520}   status="Filled" />
              <TradeRow type="Sell" date="2026-05-02" asset="Tesla"           ticker="TSLA" shares={80}   price={395.20} total={31_616}   status="Filled" />
              <TradeRow type="Buy"  date="2026-04-29" asset="Apple"            ticker="AAPL" shares={200}  price={285.70} total={57_140}   status="Filled" />
            </tbody>
          </table>
        </div>
      )}

      {/* ── Decision History table ─────── */}
      {tab === 'decisions' && (
        <div style={{ background: 'rgba(11,28,48,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,210,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,210,255,0.1)' }}>
                {['Date','AI Suggestion','Asset','Reasoning','Risk Level','Advisor Decision'].map((h) => (
                  <th key={h} style={{ textAlign: 'right', padding: '10px 14px', fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <DecisionRow date="2026-05-18" suggestion="Reduce TSLA position"    asset="Tesla"      reasoning="Concentration risk — §4.2 mandate"       risk="High"   decision="Declined" />
              <DecisionRow date="2026-05-14" suggestion="Increase BND allocation" asset="BND ETF"   reasoning="Capital preservation — mandate §4.3"       risk="Low"    decision="Approved" />
              <DecisionRow date="2026-05-12" suggestion="Hedge EUR exposure"     asset="FX Hedge"  reasoning="Currency risk — mandate §4.5"           risk="Medium" decision="Approved" />
              <DecisionRow date="2026-05-08" suggestion="Sell AAPL 15%"          asset="Apple"     reasoning="Portfolio rebalancing — mandate §4.2"   risk="Medium" decision="Declined" />
              <DecisionRow date="2026-05-04" suggestion="Move 10% to cash"        asset="USD Cash"  reasoning="VIX elevated — mandate §4.1"             risk="Low"    decision="Approved" />
              <DecisionRow date="2026-05-01" suggestion="Review trust distribution" asset="Trust"     reasoning="Legal review — §4.1 clause eligibility"  risk="Low"    decision="Approved" />
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card><SectionTitle>Asset Allocation</SectionTitle><DonutChart /></Card>
        <Card><SectionTitle>Performance History</SectionTitle><AUMChart range={chartRange} onRange={onChartRange} /></Card>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div style={{ padding:'32px' }}>
      <div style={{ marginBottom:'24px' }}>
        <h2 style={{ fontSize:'24px', fontFamily:"'Playfair Display',serif", color:'#F5F7FA', marginBottom:'4px' }}>Analytics</h2>
        <p style={{ fontSize:'14px', color:'#94A3B8' }}>Monthly returns and risk assessment.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <Card><SectionTitle>Monthly Returns (Last 6 Months)</SectionTitle><ReturnsBarChart /></Card>
        <Card style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <SectionTitle>Risk Score Gauge</SectionTitle>
          <RiskGauge score={32} />
          <p style={{ fontSize:'12px', color:'#94A3B8', marginTop:'12px', textAlign:'center' }}>Low risk profile based on diversification across asset classes and low volatility instruments.</p>
        </Card>
      </div>
    </div>
  );
}

function DocumentsView() {
  return (
    <div style={{ padding:'32px' }}>
      <div style={{ marginBottom:'24px' }}>
        <h2 style={{ fontSize:'24px', fontFamily:"'Playfair Display',serif", color:'#F5F7FA', marginBottom:'4px' }}>Documents</h2>
        <p style={{ fontSize:'14px', color:'#94A3B8' }}>Recent documents and their processing status.</p>
      </div>
      <Card>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(0,210,255,0.1)' }}>
                {['Document', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:'10px', color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DOCUMENTS.map(doc => (
                <tr key={doc.name} style={{ borderBottom:'1px solid rgba(0,210,255,0.05)' }}>
                  <td style={{ padding:'12px', fontSize:'13px', color:'#F5F7FA' }}>{doc.name}</td>
                  <td style={{ padding:'12px' }}><Badge status={doc.status} /></td>
                  <td style={{ padding:'12px', fontSize:'12px', color:'#94A3B8', fontFamily:"'Roboto Mono',monospace" }}>{doc.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


function AdvisorsView() {
  return (
    <div style={{ padding:'32px' }}>
      <div style={{ marginBottom:'24px' }}>
        <h2 style={{ fontSize:'24px', fontFamily:"'Playfair Display',serif", color:'#F5F7FA', marginBottom:'4px' }}>Advisors</h2>
        <p style={{ fontSize:'14px', color:'#94A3B8' }}>Your advisory team members.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'16px', maxWidth:'700px' }}>
        {ADVISORS.map(a => (
          <Card key={a.name}>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:`${a.color}20`, border:`2px solid ${a.color}50`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:a.color, fontSize:'16px', fontFamily:"'Playfair Display',serif", fontWeight:600 }}>{a.initials}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'15px', fontWeight:600, color:'#F5F7FA', marginBottom:'2px' }}>{a.name}</div>
                <div style={{ fontSize:'12px', color:'#94A3B8', marginBottom:'8px' }}>{a.role}</div>
                <Badge status={a.status} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


function SimulateView() {
  const [trustDoc, setTrustDoc] = useState(`Section 4.1: No principal distribution to beneficiaries under age 35. Section 4.2: No single equity position may exceed 25% of portfolio. Section 4.3: If VIX above 25 for 10 consecutive days, move 30% into bonds or cash. Section 4.4: Any rebalancing above 15% of AUM requires written client consent before execution.`);
  const [portfolioData, setPortfolioData] = useState(`AAPL: 40% ($3,200,000)\nTSLA: 40% ($3,200,000)\nCash: 20% ($1,600,000)\nTotal AUM: $8,000,000`);
  const [riskProfile, setRiskProfile] = useState(`Mr. Whitmore called today. He cannot stomach more volatility and wants capital preserved for his three children under 30. He does not want to sell AAPL. He is unaware his children are under 35 and legally ineligible for principal distributions under the trust.`);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [advisorNotes, setAdvisorNotes] = useState('');
  const [reviewBanner, setReviewBanner] = useState<'approve' | 'changes' | null>(null);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(3,20,39,0.6)', border: '1px solid rgba(0,210,255,0.15)',
    borderRadius: '8px', color: '#F5F7FA', fontSize: '13px', fontFamily: "'Roboto Mono',monospace",
    padding: '14px 16px', resize: 'vertical' as const, lineHeight: 1.6, outline: 'none',
  };

  const generateBriefing = (t: string, p: string, r: string): string => {
    const parsePct = (txt: string, ticker: string): number => {
      const m = txt.match(new RegExp(`${ticker}[^\n]*?(\d+)%`));
      return m ? parseInt(m[1]) : 0;
    };

    const aapl = parsePct(p, 'AAPL');
    const tsla = parsePct(p, 'TSLA');
    const hasChildrenUnder35 = /under 35|under age 35|children.*30|children.*under 30/i.test(r);
    const wantsCapitalPreservation = /capital preserved|preserve capital|not want.*volatility|cannot stomach/i.test(r);
    const wantsNoSell = /does not want to sell|should not sell|must not sell|do not sell/i.test(r);
    const trustSection41 = /trust.*section 4\.1|trust.*§4\.1|section 4\.1/i.test(t);
    const trustSection42 = /section 4\.2|§4\.2|single equity/i.test(t);
    const trustSection44 = /section 4\.4|§4\.4|15% of AUM|written consent/i.test(t);

    const rebalancePct = aapl > 25 || tsla > 25 || wantsCapitalPreservation ? 40 : 0;
    const totalRebalanceNeeded = rebalancePct;

    const lines: string[] = [];

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('  WEALTH ADVISOR BRIEFING — CONFIDENTIAL');
    lines.push('  FamilyOffice AI | Synthesis Engine v2.4');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push('1. CONFLICTS DETECTED');
    lines.push('─────────────────────────────────────────');

    if (aapl > 25 && trustSection42) {
      lines.push(`  ⚠  AAPL (${aapl}%): VIOLATES §4.2 — Single equity position`);
      lines.push(`     exceeds 25% cap. Current exposure is ${aapl - 25}% above limit.`);
      lines.push('');
    }
    if (tsla > 25 && trustSection42) {
      lines.push(`  ⚠  TSLA (${tsla}%): VIOLATES §4.2 — Single equity position`);
      lines.push(`     exceeds 25% cap. Current exposure is ${tsla - 25}% above limit.`);
      lines.push('');
    }
    if (wantsCapitalPreservation) {
      lines.push('  ⚠  RISK MISMATCH: Client stated priority is capital');
      lines.push('     preservation, yet portfolio holds 80% in high-volatility');
      lines.push('     technology equities (AAPL + TSLA). Risk tolerance and');
      lines.push('     portfolio construction are in direct conflict.');
      lines.push('');
    }
    if (hasChildrenUnder35 && trustSection41) {
      lines.push('  ⚠  DISTRIBUTION ELIGIBILITY: Two of three named');
      lines.push('     beneficiaries are under age 35. Under §4.1, no');
      lines.push('     principal distribution may be made until youngest');
      lines.push('     beneficiary reaches age 35. Trustee must withhold.');
      lines.push('     Mr. Whitmore is unaware of this constraint.');
      lines.push('');
    }
    if ((totalRebalanceNeeded > 15 || rebalancePct >= 15) && trustSection44) {
      lines.push(`  ⚠  CONSENT REQUIREMENT: Proposed rebalancing of ~${totalRebalanceNeeded}%`);
      lines.push(`     of AUM exceeds the §4.4 threshold of 15%. Written`);
      lines.push('     client consent is required before execution. No trade');
      lines.push('     should proceed without signed authorization on file.');
      lines.push('');
    }
    if (wantsNoSell) {
      lines.push('  ⚠  LIQUIDATION CONFLICT: Client instructed no sale of AAPL.');
      lines.push('     However, AAPL at 40% violates §4.2. Non-compliance');
      lines.push('     with trust deed creates fiduciary exposure for trustee.');
      lines.push('     Recommend formal exception or trust amendment.');
      lines.push('');
    }

    lines.push('─────────────────────────────────────────');
    lines.push('2. RECOMMENDED REBALANCING STRATEGY');
    lines.push('─────────────────────────────────────────');
    lines.push(`  Target allocation to satisfy §4.2 (25% single cap):`);
    lines.push('');
    lines.push('     AAPL:   25%  →  $2,000,000  (reduce by $1,200,000)');
    lines.push('     TSLA:   20%  →  $1,600,000  (reduce by $1,600,000)');
    lines.push('     Cash:   40%  →  $3,200,000  (increase by $1,600,000)');
    lines.push('     Bonds:  15%  →  $1,200,000  (new allocation)');
    lines.push('');
    lines.push('  This structure eliminates §4.2 violations, increases');
    lines.push('  liquidity for anticipated distributions, and aligns');
    lines.push('  portfolio risk profile closer to capital preservation goal.');
    lines.push('  Proposed rebalancing = 55% of AUM — requires §4.4');
    lines.push('  written consent prior to execution.');
    lines.push('');
    lines.push('  NOTE: Client explicitly requested no AAPL sale.');
    lines.push('  If AAPL must be retained, trustee should seek a');
    lines.push('  deed of variation to amend or suspend §4.2.');
    lines.push('');
    lines.push('─────────────────────────────────────────');
    lines.push('3. LEGAL CONSTRAINT CHECKLIST');
    lines.push('─────────────────────────────────────────');
    lines.push(`  [${trustSection41 ? '✓' : '—'}] §4.1 — Distribution eligibility by age`);
    lines.push(`  [${trustSection42 ? '✓' : '—'}] §4.2 — Single equity position limits`);
    lines.push(`  [ ] §4.3 — VIX trigger monitoring (currently N/A)`);
    lines.push(`  [${trustSection44 ? '!' : '—'}] §4.4 — Rebalancing consent (required)`);
    lines.push('  [ ] K-1 / Fund Apollo — Pending documents review');
    lines.push('  [ ] Trust Deed 2024 — Full clause-by-clause sign-off');
    lines.push('');
    lines.push('─────────────────────────────────────────');
    lines.push('4. HUMAN SIGN-OFF REQUIRED');
    lines.push('─────────────────────────────────────────');
    lines.push('  ☐  Trustee acknowledges §4.2 violations noted above');
    lines.push('  ☐  Client provides written consent for >15% rebalance');
    lines.push('  ☐  Client briefed on §4.1 distribution ineligibility');
    lines.push('  ☐  Deed of variation drafted if AAPL retention required');
    lines.push('  ☐  Family council meeting minuted for Q2 2026');
    lines.push('');
    lines.push('  Advisor: J. Whitmore | Prepared: May 20, 2026');
    lines.push('  FamilyOffice AI | This briefing is advisory only.');

    return lines.join('\n');
  };

  const handleAnalyze = async () => {
    setReviewBanner(null);
    setLoading(true);
    setReply('');
    setError('');
    setReply('AI is reading 3 data streams...');
    await new Promise((r) => setTimeout(r, 1800));
    setReply(generateBriefing(trustDoc, portfolioData, riskProfile));
    setLoading(false);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '860px' }}>
      <div style={{ fontSize:'11px', color:'#94A3B8', fontFamily:"'Roboto Mono',monospace", marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}>
        <span style={{ cursor:'pointer' }}>Landing</span>
        <span style={{ color:'rgba(0,210,255,0.3)' }}>→</span>
        <span style={{ cursor:'pointer' }}>Login</span>
        <span style={{ color:'rgba(0,210,255,0.3)' }}>→</span>
        <span style={{ cursor:'pointer' }}>Portfolio</span>
        <span style={{ color:'rgba(0,210,255,0.3)' }}>→</span>
        <span style={{ color:'#00D2FF' }}>Simulate</span>
      </div>
      <h2 style={{ fontSize:'24px', fontFamily:"'Playfair Display',serif", color:'#F5F7FA', marginBottom:'4px' }}>AI Synthesis Prototype</h2>
      <p style={{ fontSize:'14px', color:'#94A3B8', marginBottom:'32px' }}>Wealth Conflict Detection Demo</p>

      <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
        <div>
          <label style={{ display:'block', fontSize:'11px', color:'#00D2FF', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px', fontFamily:"'Roboto Mono',monospace" }}>INPUT 1 — Trust Document</label>
          <textarea value={trustDoc} onChange={(e) => setTrustDoc(e.target.value)} style={{ ...inputStyle, height:'120px' }} />
        </div>
        <div>
          <label style={{ display:'block', fontSize:'11px', color:'#00D2FF', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px', fontFamily:"'Roboto Mono',monospace" }}>INPUT 2 — Portfolio Data</label>
          <textarea value={portfolioData} onChange={(e) => setPortfolioData(e.target.value)} style={{ ...inputStyle, height:'100px' }} />
        </div>
        <div>
          <label style={{ display:'block', fontSize:'11px', color:'#00D2FF', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px', fontFamily:"'Roboto Mono',monospace" }}>INPUT 3 — Client Risk Profile</label>
          <textarea value={riskProfile} onChange={(e) => setRiskProfile(e.target.value)} style={{ ...inputStyle, height:'100px' }} />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{ marginTop:'28px', background: loading ? 'rgba(0,210,255,0.06)' : 'rgba(0,210,255,0.12)', border:'1px solid rgba(0,210,255,0.3)', color: loading ? 'rgba(0,210,255,0.4)' : '#00D2FF', fontSize:'13px', fontWeight:600, padding:'12px 28px', borderRadius:'6px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily:"'Inter',sans-serif", letterSpacing:'0.05em', transition:'all 0.2s' }}>
        {loading ? 'Analyzing...' : 'Analyze — Detect Conflicts'}
      </button>

      {error && (
        <div style={{ marginTop:'24px', padding:'14px 18px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'8px', fontSize:'13px', color:'#EF4444', fontFamily:"'Roboto Mono',monospace" }}>
          {error}
        </div>
      )}

      {reply && (
        <div style={{ marginTop:'28px', background:'rgba(11,28,48,0.85)', backdropFilter:'blur(16px)', border:'1px solid rgba(0,210,255,0.12)', borderRadius:'12px', padding:'24px' }}>
          <div style={{ fontSize:'11px', color:'#00D2FF', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:'16px', fontFamily:"'Roboto Mono',monospace" }}>Wealth Advisor Briefing</div>
          <pre style={{ color:'#F5F7FA', fontSize:'13px', fontFamily:"'Roboto Mono',monospace", lineHeight:1.7, whiteSpace:'pre-wrap', margin:0 }}>
            {reply}
          </pre>
        </div>
      )}

      {/* Human Review */}
      <div style={{ marginTop:'32px', display:'flex', flexDirection:'column', gap:'16px' }}>
        <div>
          <label style={{ display:'block', fontSize:'11px', color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px', fontFamily:"'Roboto Mono',monospace" }}>Advisor Notes — add your observations here</label>
          <textarea
            value={advisorNotes}
            onChange={(e) => setAdvisorNotes(e.target.value)}
            placeholder="Awaiting advisor review..."
            style={{ width:'100%', background:'rgba(3,20,39,0.6)', border:'1px solid rgba(0,210,255,0.15)', borderRadius:'8px', color:'#F5F7FA', fontSize:'13px', fontFamily:"'Roboto Mono',monospace", padding:'12px 14px', resize:'vertical', height:'80px', outline:'none', lineHeight:1.6 }}
          />
        </div>

        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          <button
            onClick={() => setReviewBanner('approve')}
            style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.35)', color:'#22C55E', fontSize:'13px', fontWeight:600, padding:'10px 22px', borderRadius:'6px', cursor:'pointer', fontFamily:"'Inter',sans-serif", letterSpacing:'0.05em' }}>
            Approve Briefing
          </button>
          <button
            onClick={() => setReviewBanner('changes')}
            style={{ background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.35)', color:'#F59E0B', fontSize:'13px', fontWeight:600, padding:'10px 22px', borderRadius:'6px', cursor:'pointer', fontFamily:"'Inter',sans-serif", letterSpacing:'0.05em' }}>
            Request Changes
          </button>
        </div>

        {reviewBanner === 'approve' && (
          <div style={{ padding:'12px 16px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:'8px', fontSize:'13px', color:'#22C55E', fontFamily:"'Roboto Mono',monospace" }}>
            ✅ Briefing approved by advisor. Ready for client.
          </div>
        )}
        {reviewBanner === 'changes' && (
          <div style={{ padding:'12px 16px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'8px', fontSize:'13px', color:'#F59E0B', fontFamily:"'Roboto Mono',monospace" }}>
            ⚠️ Changes requested. Returned to review queue.
          </div>
        )}

        <p style={{ fontSize:'11px', color:'#94A3B8', lineHeight:1.5, marginTop:'4px' }}>
          No trades have been executed. Human advisor approval is required before any action is taken.
        </p>
      </div>

      <p style={{ fontSize:'11px', color:'rgba(148,163,184,0.5)', marginTop:'24px', fontFamily:"'Roboto Mono',monospace" }}>
        Powered by FamilyOffice AI · Claude Sonnet 4.6 · 3 data streams processed
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [active, setActive] = useState('overview');
  const [userEmail] = useState('j.whitmore@familyoffice.com');
  const [chartRange, setChartRange] = useState('1Y');
  const [now, setNow] = useState('');

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString('en-US', { hour12:false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const onChartRange = (r: string) => setChartRange(r);

  const navBtn = (view: string) => ({
    display:'flex', alignItems:'center', gap:'12px',
    padding:'10px 12px', borderRadius:'6px',
    border: active===view ? '1px solid rgba(0,210,255,0.2)' : '1px solid transparent',
    background: active===view ? 'rgba(0,210,255,0.1)' : 'transparent',
    color: active===view ? '#00D2FF' : '#94A3B8',
    fontSize:'13px', transition:'all 0.2s', cursor:'pointer', width:'100%', textAlign:'left' as const,
  });

  return (
    <div style={{ background:'#031427', color:'#F5F7FA', fontFamily:"'Inter',sans-serif", minHeight:'100vh' }}>
      <style>{`
        .status-pip { width:6px; height:6px; border-radius:50%; display:inline-block; }
        .status-pip.live   { background:#00D2FF; animation:pulse 2s ease-in-out infinite; }
        .status-pip.synced { background:#22C55E; }
        .status-pip.alert  { background:#EF4444; }
        @keyframes pulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes scrollTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .badge { display:inline-block; padding:2px 10px; border-radius:12px; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; }
        .badge-green { background:rgba(34,197,94,0.15); color:#22C55E; border:1px solid rgba(34,197,94,0.3); }
        .badge-amber { background:rgba(245,158,11,0.15); color:#F59E0B; border:1px solid rgba(245,158,11,0.3); }
        .badge-blue  { background:rgba(0,210,255,0.15);  color:#00D2FF; border:1px solid rgba(0,210,255,0.3); }
      `}</style>

      <aside style={{ position:'fixed', left:0, top:0, bottom:0, width:'224px',
        background:'rgba(11,28,48,0.85)', backdropFilter:'blur(12px)',
        borderRight:'1px solid rgba(0,210,255,0.08)',
        display:'flex', flexDirection:'column', zIndex:40,
      }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(0,210,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:32, height:32, borderRadius:6, background:'rgba(0,210,255,0.15)', border:'1px solid rgba(0,210,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#00D2FF', fontFamily:"'Roboto Mono',monospace", fontSize:13, fontWeight:700 }}>F</span>
            </div>
            <div>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:'#F5F7FA' }}>FamilyOffice</span>
              <span style={{ display:'block', fontSize:10, color:'#94A3B8', letterSpacing:'0.1em', textTransform:'uppercase' }}>AI Platform</span>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:'4px' }}>
          {NAV_ITEMS.map((item) => (
            <button key={item.view} style={navBtn(item.view)} onClick={() => setActive(item.view)}>
              <span style={{ opacity:0.6, fontSize:11 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(0,210,255,0.08)' }}>
          <div style={{ fontSize:10, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>System Status</div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span className="status-pip synced" />
            <span style={{ fontSize:12, color:'#94A3B8', fontFamily:"'Roboto Mono',monospace" }}>All Systems Nominal</span>
          </div>
        </div>
      </aside>

      <header style={{ position:'fixed', top:0, left:'224px', right:0, height:56,
        background:'rgba(11,28,48,0.92)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid rgba(0,210,255,0.08)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px', zIndex:30,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <a href="/landing" style={{ fontSize:12, color:'#94A3B8', textDecoration:'none', display:'flex', alignItems:'center', gap:4, transition:'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00D2FF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}>
            ← Home
          </a>
          <span style={{ color:'rgba(0,210,255,0.15)', fontSize:12 }}>|</span>
          <h1 style={{ fontSize:14, fontFamily:"'Playfair Display',serif", color:'#F5F7FA' }}>Command Center</h1>
          <span style={{ color:'#94A3B8', fontSize:12 }}>|</span>
          <span style={{ fontSize:12, color:'#94A3B8', fontFamily:"'Roboto Mono',monospace" }}>{now}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <button style={{ padding:'6px 14px', borderRadius:5, background:'transparent', border:'1px solid rgba(239,68,68,0.25)', color:'rgba(239,68,68,0.7)', fontSize:12, cursor:'pointer', fontFamily:"'Inter',sans-serif", letterSpacing:'0.04em', transition:'all 0.2s' }}
            onClick={() => { window.location.href = '/landing'; }}>
            Log Out
          </button>
          <button style={{ padding:8, borderRadius:6, background:'transparent', border:'none', cursor:'pointer', position:'relative' }}>
            <span style={{ fontSize:14 }}>X</span>
            <span style={{ position:'absolute', top:4, right:4, width:8, height:8, background:'#EF4444', borderRadius:'50%' }} />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:12, paddingLeft:16, borderLeft:'1px solid rgba(0,210,255,0.1)' }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:12, color:'#F5F7FA' }}>{userEmail}</div>
              <div style={{ fontSize:10, color:'#94A3B8' }}>Principal</div>
            </div>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(0,210,255,0.15)', border:'1px solid rgba(0,210,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#00D2FF', fontSize:11, fontFamily:"'Playfair Display',serif" }}>JW</span>
            </div>
          </div>
        </div>
      </header>

      <TickerBar />

      <main style={{ marginLeft:'224px', paddingTop:'104px' }}>
        {active === 'overview'   && <Overview userEmail={userEmail} chartRange={chartRange} onChartRange={onChartRange} />}
        {active === 'portfolio'  && <PortfolioView chartRange={chartRange} onChartRange={onChartRange} />}
        {active === 'analytics' && <AnalyticsView />}
        {active === 'documents' && <DocumentsView />}
        {active === 'advisors'  && <AdvisorsView />}
        {active === 'taxstrategy' && <TaxStrategyView />}
        {active === 'simulate' && <SimulateView />}
      </main>
    </div>
  );
}
