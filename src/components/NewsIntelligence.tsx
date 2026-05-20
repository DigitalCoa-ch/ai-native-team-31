'use client';

import { useState, useEffect } from 'react';

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: 'BBC' | 'CNN' | 'Reuters' | 'AP';
  imageUrl?: string;
}

export interface ArticleContent {
  title: string;
  source: string;
  url: string;
  content: string;
}

async function fetchBBCNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://feeds.bbci.co.uk/news/world/rss.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const items = doc.querySelectorAll('item');
    const news: NewsItem[] = [];
    items.forEach((item) => {
      if (news.length >= 10) return;
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const description = item.querySelector('description')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      const thumbnail = item.querySelector('thumbnail')?.getAttribute('url') || undefined;
      if (title && link) {
        news.push({ title, description, link, pubDate, source: 'BBC', imageUrl: thumbnail });
      }
    });
    return news;
  } catch {
    return [];
  }
}

const FALLBACK_ARTICLES: NewsItem[] = [
  {
    title: "Ukraine launches one of largest drone attacks on Moscow in over a year",
    description: "Ukraine launched one of its largest drone attacks on Moscow in more than a year, Russian state media reported.",
    link: "https://www.cnn.com/2026/05/17/europe/russia-ukraine-moscow-attack-intl-hnk",
    pubDate: "Sun, 17 May 2026",
    source: 'CNN',
  },
  {
    title: "US and Iranian militaries trade shots as Strait of Hormuz ceasefire under pressure",
    description: "The fragile ceasefire between the US and Iran is being tested after both sides fired shots in the Strait of Hormuz.",
    link: "https://www.cnn.com/2026/05/04/world/live-news/iran-war-hormuz-trump",
    pubDate: "Mon, 04 May 2026",
    source: 'CNN',
  },
  {
    title: "Ebola outbreak in DRC is largest in over a year, WHO warns numbers will rise",
    description: "WHO says there have been 139 suspected deaths and 600 cases in DRC, warning the numbers will rise further.",
    link: "https://www.bbc.com/news/articles/cwy2g197dp8o",
    pubDate: "Wed, 20 May 2026",
    source: 'BBC',
  },
  {
    title: "Trump exerts iron grip on Republican Party with Massie defeated in Kentucky primary",
    description: "Victory over a Republican rebel in Kentucky shows the president's strength but risks for midterms.",
    link: "https://www.bbc.com/news/articles/cdjpng88d2vo",
    pubDate: "Wed, 20 May 2026",
    source: 'BBC',
  },
  {
    title: "Lithuania's leaders take shelter during drone air alert near Belarus border",
    description: "Flights suspended and people urged to take shelter after a suspected drone was detected near the Belarus border.",
    link: "https://www.bbc.com/news/articles/c9d3vpqqqpeo",
    pubDate: "Wed, 20 May 2026",
    source: 'BBC',
  },
  {
    title: "Nigeria arrests former power minister hiding after 75-year corruption conviction",
    description: "The former power minister was sentenced to 75 years in jail in absentia and found hiding in Abuja.",
    link: "https://www.bbc.com/news/articles/cdjpn378mvvo",
    pubDate: "Wed, 20 May 2026",
    source: 'BBC',
  },
];

export default function NewsIntelligence() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [articleContent, setArticleContent] = useState<ArticleContent | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const bbcNews = await fetchBBCNews();
      if (bbcNews.length > 0) {
        const titles = new Set(bbcNews.map((n) => n.title));
        const extra = FALLBACK_ARTICLES.filter((a) => !titles.has(a.title)).slice(0, 4);
        setNews([...bbcNews.slice(0, 8), ...extra]);
      } else {
        setNews(FALLBACK_ARTICLES);
      }
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }));
      setLoading(false);
    }
    load();
  }, []);

  async function openArticle(article: NewsItem) {
    setSelectedArticle(article);
    setArticleContent(null);
    setArticleLoading(true);
    try {
      const data = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(article.link)}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const text = await data.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const bodyEl =
        doc.querySelector('[data-component="body"]') ||
        doc.querySelector('.article-body') ||
        doc.querySelector('article') ||
        doc.querySelector('main');
      const paragraphs = bodyEl ? bodyEl.querySelectorAll('p') : doc.querySelectorAll('p');
      const content = Array.from(paragraphs)
        .slice(0, 20)
        .map((p) => p.textContent?.trim())
        .filter(Boolean)
        .join('\n\n');
      setArticleContent({
        title: article.title,
        source: article.source,
        url: article.link,
        content: content || 'Full article content could not be extracted. Click the source link.',
      });
    } catch {
      setArticleContent({
        title: article.title,
        source: article.source,
        url: article.link,
        content: 'Could not load article content. Please click the source link to read the full article.',
      });
    }
    setArticleLoading(false);
  }

  function closeArticle() {
    setSelectedArticle(null);
    setArticleContent(null);
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  const sourceColors: Record<string, string> = {
    BBC: '#BB1919',
    CNN: '#CC0000',
    Reuters: '#FF8000',
    AP: '#000000',
  };

  return (
    <>
      <div style={{
        background: 'rgba(11,28,48,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0,210,255,0.12)',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: '#F5F7FA', marginBottom: '4px', fontFamily: "'Playfair Display', serif" }}>
              Global Intelligence — Last 24h
            </h3>
            {lastUpdated && (
              <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: "'Roboto Mono', monospace" }}>
                Updated {lastUpdated} UTC
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['BBC', 'CNN', 'Reuters', 'AP'].map((s) => (
              <span key={s} style={{
                fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em',
                color: sourceColors[s] || '#94A3B8',
                background: `${sourceColors[s] || '#94A3B8'}18`,
                border: `1px solid ${sourceColors[s] || '#94A3B8'}40`,
                borderRadius: '4px', padding: '2px 6px', textTransform: 'uppercase',
              }}>{s}</span>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                height: '60px', borderRadius: '8px',
                background: 'rgba(0,210,255,0.05)',
                animation: 'pulse 2s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {news.slice(0, 8).map((item, idx) => (
              <button
                key={idx}
                onClick={() => openArticle(item)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '12px', borderRadius: '8px', border: 'none',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.2s ease', width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,210,255,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    style={{
                      width: '56px', height: '38px', borderRadius: '4px',
                      objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(0,210,255,0.1)',
                    }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                      color: sourceColors[item.source] || '#94A3B8',
                      textTransform: 'uppercase',
                    }}>{item.source}</span>
                    <span style={{ color: 'rgba(0,210,255,0.2)', fontSize: '8px' }}>·</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: "'Roboto Mono', monospace" }}>
                      {formatDate(item.pubDate)}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px', color: '#F5F7FA', lineHeight: 1.4,
                    margin: 0, overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {item.title}
                  </p>
                </div>
                <span style={{ color: '#00D2FF', fontSize: '10px', flexShrink: 0, marginTop: '2px' }}>↗</span>
              </button>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '16px', paddingTop: '12px',
          borderTop: '1px solid rgba(0,210,255,0.06)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <span style={{ fontSize: '10px', color: '#94A3B8', fontStyle: 'italic' }}>
            Click any headline to read the full article
          </span>
        </div>
      </div>

      {selectedArticle && (
        <div
          onClick={closeArticle}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(3,20,39,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0B1C30', border: '1px solid rgba(0,210,255,0.2)',
              borderRadius: '16px', maxWidth: '720px', width: '100%',
              maxHeight: '85vh', overflow: 'auto',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{
              padding: '24px 28px 0',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              position: 'sticky', top: 0, background: '#0B1C30', zIndex: 1,
              borderBottom: '1px solid rgba(0,210,255,0.08)',
              paddingBottom: '16px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                    color: sourceColors[selectedArticle.source] || '#00D2FF',
                    textTransform: 'uppercase',
                  }}>{selectedArticle.source}</span>
                  <span style={{ color: 'rgba(0,210,255,0.3)', fontSize: '10px' }}>·</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: "'Roboto Mono', monospace" }}>
                    {formatDate(selectedArticle.pubDate)}
                  </span>
                </div>
                <h2 style={{
                  fontSize: '18px', color: '#F5F7FA', lineHeight: 1.4,
                  fontFamily: "'Playfair Display', serif", fontWeight: 600,
                }}>
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={closeArticle}
                style={{
                  background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.2)',
                  borderRadius: '50%', width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#00D2FF', fontSize: '14px', flexShrink: 0,
                }}
              >
                X
              </button>
            </div>

            <div style={{ padding: '24px 28px 32px' }}>
              {articleLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{
                      height: '16px', borderRadius: '4px',
                      background: 'rgba(0,210,255,0.05)',
                      animation: 'pulse 2s ease-in-out infinite',
                      animationDelay: `${i * 0.15}s`,
                      width: `${100 - i * 5}%`,
                    }} />
                  ))}
                </div>
              ) : articleContent ? (
                <>
                  <p style={{
                    fontSize: '13px', color: '#94A3B8', lineHeight: 1.7,
                    marginBottom: '20px', borderLeft: '2px solid rgba(0,210,255,0.3)',
                    paddingLeft: '12px', fontStyle: 'italic',
                  }}>
                    {selectedArticle.description}
                  </p>
                  <div style={{
                    fontSize: '14px', color: '#F5F7FA', lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {articleContent.content}
                  </div>
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0,210,255,0.08)' }}>
                    <a
                      href={selectedArticle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        color: '#00D2FF', fontSize: '12px', fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      Read full article on {selectedArticle.source}.com
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
