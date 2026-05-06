import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cream: #F5F0E8;
          --ink: #1A1714;
          --warm-gray: #8C8580;
          --accent: #C8602A;
          --accent-light: #E8976A;
          --border: rgba(26,23,20,0.10);
        }
        body {
          background: var(--cream);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          overflow-x: hidden;
        }
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          background: rgba(245,240,232,0.85);
          backdrop-filter: blur(12px);
          z-index: 100;
        }
        .nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: var(--ink);
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .nav-logo span { color: var(--accent); font-style: italic; }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-links a {
          font-size: 0.875rem;
          color: var(--warm-gray);
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.02em;
        }
        .nav-links a:hover { color: var(--ink); }
        .nav-cta {
          background: var(--ink) !important;
          color: var(--cream) !important;
          padding: 0.5rem 1.25rem !important;
          border-radius: 2px !important;
          font-size: 0.8rem !important;
          font-weight: 500 !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          transition: background 0.2s !important;
        }
        .nav-cta:hover { background: var(--accent) !important; }
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 73px);
          border-bottom: 1px solid var(--border);
        }
        .hero-left {
          padding: 5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid var(--border);
        }
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .eyebrow-line { width: 2rem; height: 1px; background: var(--accent); }
        .eyebrow-text {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 500;
        }
        h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3rem, 5vw, 4.5rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--ink);
          margin-bottom: 1.75rem;
        }
        h1 em { font-style: italic; color: var(--accent); }
        .hero-desc {
          font-size: 1.05rem;
          color: var(--warm-gray);
          line-height: 1.7;
          max-width: 28rem;
          margin-bottom: 3rem;
        }
        .hero-actions { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
        .btn-primary {
          background: var(--ink);
          color: var(--cream);
          padding: 0.85rem 2rem;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 2px;
          transition: background 0.25s, transform 0.2s;
          display: inline-block;
        }
        .btn-primary:hover { background: var(--accent); transform: translateY(-1px); }
        .btn-ghost {
          color: var(--ink);
          text-decoration: none;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .btn-ghost:hover { color: var(--accent); border-color: var(--accent); }
        .hero-right {
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(26,23,20,0.02);
          overflow: hidden;
        }
        .dashboard-preview {
          background: white;
          border: 1px solid var(--border);
          border-radius: 6px;
          box-shadow: 0 24px 64px rgba(26,23,20,0.12);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .preview-bar {
          background: var(--ink);
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-r { background: #FF5F57; }
        .dot-y { background: #FFBD2E; }
        .dot-g { background: #28C840; }
        .preview-url { margin-left: auto; font-size: 0.7rem; color: rgba(255,255,255,0.4); font-family: monospace; }
        .preview-body { padding: 1.25rem; }
        .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .preview-title { font-size: 0.9rem; font-weight: 500; color: var(--ink); }
        .preview-badge { font-size: 0.65rem; background: #ECFDF5; color: #065F46; padding: 2px 8px; border-radius: 99px; font-weight: 500; }
        .preview-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
        .preview-stat { background: var(--cream); border-radius: 4px; padding: 0.75rem; }
        .ps-label { font-size: 0.6rem; color: var(--warm-gray); margin-bottom: 4px; letter-spacing: 0.05em; text-transform: uppercase; }
        .ps-value { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: var(--ink); }
        .ps-change { font-size: 0.6rem; color: #065F46; margin-top: 2px; }
        .preview-chart { background: var(--cream); border-radius: 4px; padding: 0.75rem; margin-bottom: 0.75rem; height: 80px; display: flex; align-items: flex-end; gap: 4px; overflow: hidden; }
        .bar { flex: 1; border-radius: 2px 2px 0 0; background: var(--ink); opacity: 0.15; }
        .bar.active { background: var(--accent); opacity: 1; }
        .preview-ai-box { background: linear-gradient(135deg, rgba(200,96,42,0.08), rgba(200,96,42,0.04)); border: 1px solid rgba(200,96,42,0.2); border-radius: 4px; padding: 0.75rem; }
        .ai-question { font-size: 0.7rem; color: var(--warm-gray); margin-bottom: 4px; }
        .ai-answer { font-size: 0.75rem; color: var(--ink); font-weight: 500; }
        .ai-tag { font-size: 0.6rem; color: var(--accent); margin-top: 4px; font-weight: 500; }
        .stats-section { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--border); }
        .stat-item { padding: 3rem; border-right: 1px solid var(--border); }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-family: 'DM Serif Display', serif; font-size: clamp(2.5rem, 4vw, 3.5rem); color: var(--ink); line-height: 1; margin-bottom: 0.5rem; }
        .stat-num span { color: var(--accent); font-style: italic; }
        .stat-desc { font-size: 0.875rem; color: var(--warm-gray); line-height: 1.5; }
        .features-section { padding: 6rem 3rem; border-bottom: 1px solid var(--border); }
        .section-label { font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); font-weight: 500; margin-bottom: 1rem; }
        h2 { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 3.5vw, 3rem); line-height: 1.1; letter-spacing: -0.02em; color: var(--ink); margin-bottom: 3rem; }
        h2 em { font-style: italic; color: var(--accent); }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--border); }
        .feature-card { padding: 2.5rem; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); transition: background 0.3s; }
        .feature-card:hover { background: white; }
        .feature-card:nth-child(3n) { border-right: none; }
        .feature-icon { width: 40px; height: 40px; border: 1px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; font-size: 1.1rem; background: white; }
        .feature-title { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: var(--ink); margin-bottom: 0.75rem; }
        .feature-desc { font-size: 0.875rem; color: var(--warm-gray); line-height: 1.7; }
        .cta-section { padding: 7rem 3rem; display: flex; flex-direction: column; align-items: center; text-align: center; background: var(--ink); color: var(--cream); position: relative; overflow: hidden; }
        .cta-eyebrow { color: var(--accent-light); font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; margin-bottom: 1.5rem; }
        .cta-section h2 { color: var(--cream); font-size: clamp(2.5rem, 4vw, 3.5rem); margin-bottom: 1.5rem; }
        .cta-section h2 em { color: var(--accent-light); }
        .cta-desc { color: rgba(245,240,232,0.6); font-size: 1rem; max-width: 30rem; margin-bottom: 2.5rem; line-height: 1.7; }
        .btn-light { background: var(--cream); color: var(--ink); padding: 1rem 2.5rem; text-decoration: none; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 2px; transition: background 0.25s, transform 0.2s; display: inline-block; }
        .btn-light:hover { background: var(--accent-light); transform: translateY(-2px); }
        .cta-note { margin-top: 1.25rem; font-size: 0.8rem; color: rgba(245,240,232,0.4); }
        footer { padding: 2rem 3rem; border-top: 1px solid rgba(245,240,232,0.1); background: var(--ink); display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--cream); opacity: 0.6; }
        .footer-logo span { font-style: italic; color: var(--accent-light); }
        .footer-copy { font-size: 0.75rem; color: rgba(245,240,232,0.3); }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.5rem; }
          .hero { grid-template-columns: 1fr; }
          .hero-left { padding: 3rem 1.5rem; border-right: none; border-bottom: 1px solid var(--border); }
          .hero-right { padding: 2rem 1.5rem; }
          .stats-section { grid-template-columns: 1fr; }
          .stat-item { border-right: none; border-bottom: 1px solid var(--border); }
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { border-right: none; }
          footer { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      <div>
        <nav>
          <a href="/" className="nav-logo">Insight<span>ly</span></a>
          <div className="nav-links">
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Docs</a>
            <Link href="/sign-in" style={{color:'var(--warm-gray)', textDecoration:'none', fontSize:'0.875rem'}}>Sign in</Link>
            <Link href="/sign-up" className="nav-cta">Get started</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <div className="eyebrow-line"></div>
              <span className="eyebrow-text">Web analytics, reimagined</span>
            </div>
            <h1>Your data,<br /><em>finally</em><br />making sense.</h1>
            <p className="hero-desc">Track every visitor, understand every click, and ask your analytics anything — in plain English. Built for people who ship, not spreadsheet specialists.</p>
            <div className="hero-actions">
              <Link href="/sign-up" className="btn-primary">Start for free</Link>
              <Link href="/sign-in" className="btn-ghost">Sign in <span>→</span></Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="dashboard-preview">
              <div className="preview-bar">
                <div className="dot dot-r"></div>
                <div className="dot dot-y"></div>
                <div className="dot dot-g"></div>
                <span className="preview-url">app.insightly.io/dashboard</span>
              </div>
              <div className="preview-body">
                <div className="preview-header">
                  <span className="preview-title">Overview — May 2026</span>
                  <span className="preview-badge">● Live</span>
                </div>
                <div className="preview-stats">
                  <div className="preview-stat"><div className="ps-label">Visitors</div><div className="ps-value">24.8k</div><div className="ps-change">↑ 12.4%</div></div>
                  <div className="preview-stat"><div className="ps-label">Sessions</div><div className="ps-value">41.2k</div><div className="ps-change">↑ 8.1%</div></div>
                  <div className="preview-stat"><div className="ps-label">Bounce</div><div className="ps-value">38%</div><div className="ps-change">↓ 3.2%</div></div>
                </div>
                <div className="preview-chart">
                  {[35,55,40,70,60,80,50,90,75,85,65,95,70,100,80].map((h, i) => (
                    <div key={i} className={`bar ${i === 14 ? 'active' : ''}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="preview-ai-box">
                  <div className="ai-question">💬 Which page has the highest drop-off rate?</div>
                  <div className="ai-answer">Your /pricing page loses 64% of visitors. Most leave within 8 seconds.</div>
                  <div className="ai-tag">✦ AI insight</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-item"><div className="stat-num">2.4M<span>+</span></div><div className="stat-desc">Events tracked every single day</div></div>
          <div className="stat-item"><div className="stat-num">4.8k<span>+</span></div><div className="stat-desc">Developers trust Insightly with their data</div></div>
          <div className="stat-item"><div className="stat-num">99<span>.9%</span></div><div className="stat-desc">Uptime — your tracking never misses a beat</div></div>
        </section>

        <section className="features-section">
          <div className="section-label">What you get</div>
          <h2>Everything you need,<br /><em>nothing you don't.</em></h2>
          <div className="features-grid">
            {[
              { icon: '⚡', title: 'Real-time tracking', desc: 'See visitors arrive on your site as it happens. No 24-hour delays, no sampling. Every event, instantly.' },
              { icon: '🤖', title: 'Ask AI anything', desc: 'Type a question in plain English. Get an answer backed by your actual data. No SQL. No analyst needed.' },
              { icon: '📊', title: 'Beautiful charts', desc: 'Line charts, funnels, heatmaps. Your data visualised so clearly that the insight is obvious at a glance.' },
              { icon: '🔒', title: 'Privacy first', desc: 'No cookies. No fingerprinting. GDPR-compliant by design. Your users privacy is respected, always.' },
              { icon: '🚀', title: 'One-line setup', desc: 'Paste one script tag. You will see your first visitor within seconds, not days.' },
              { icon: '💳', title: 'Simple pricing', desc: 'Free up to 10k events per month. Upgrade only when you are ready. No hidden charges, ever.' },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-eyebrow">Get started today</div>
          <h2>Your analytics should<br /><em>work for you.</em></h2>
          <p className="cta-desc">Join thousands of developers who stopped drowning in data and started understanding it.</p>
          <Link href="/sign-up" className="btn-light">Create free account</Link>
          <p className="cta-note">No credit card required · Free up to 10k events/month</p>
        </section>

        <footer>
          <div className="footer-logo">Insight<span>ly</span></div>
          <div className="footer-copy">© 2026 Insightly. Built with care.</div>
        </footer>
      </div>
    </>
  )
}
