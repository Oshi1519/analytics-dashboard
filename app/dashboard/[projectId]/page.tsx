'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

interface Project {
  id: string
  name: string
  domain: string | null
  createdAt: string
}

interface Stats {
  totalPageviews: number
  totalClicks: number
  uniquePages: number
  chartData: { date: string; events: number }[]
  topPages: { page: string; count: number }[]
  latestEvents: { type: string; page: string; createdAt: string }[]
}

export default function ProjectPage() {
  const { projectId } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'snippet' | 'events'>('overview')

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        const found = data.projects?.find((p: Project) => p.id === projectId)
        if (found) setProject(found)
      })

    fetch(`/api/stats?projectId=${projectId}`)
      .then(r => r.json())
      .then(data => setStats(data))
  }, [projectId])

  const snippet = `<!-- Insightly Analytics -->
<script>
  (function() {
    var projectId = "${projectId}";
    var apiUrl = "http://localhost:3000";
    function track(type, data) {
      fetch(apiUrl + '/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, type, page: window.location.pathname, ...data })
      }).catch(function() {});
    }
    track('pageview', { referrer: document.referrer });
    document.addEventListener('click', function(e) {
      var t = e.target;
      if (t.tagName === 'A' || t.tagName === 'BUTTON') {
        track('click', { element: t.tagName, text: t.innerText?.slice(0,50) });
      }
    });
  })();
</script>`

  function copySnippet() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabStyle = (tab: string) => ({
    padding: '0.6rem 1.25rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    background: activeTab === tab ? '#1A1714' : 'transparent',
    color: activeTab === tab ? '#F5F0E8' : '#8C8580',
    transition: 'all 0.2s'
  })

  if (!project) return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#8C8580' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        background: 'white', borderBottom: '1px solid rgba(26,23,20,0.1)',
        padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C8580', fontSize: '0.9rem' }}>
            ← Back
          </button>
          <span style={{ color: 'rgba(26,23,20,0.2)' }}>|</span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A1714' }}>
            {project.name}
          </span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A1714', marginBottom: '0.25rem' }}>
              {project.name}
            </h1>
            <p style={{ color: '#8C8580', fontSize: '0.875rem' }}>
              {project.domain || 'No domain'} · Created {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: '#F5F0E8', padding: '4px', borderRadius: '6px', border: '1px solid rgba(26,23,20,0.1)' }}>
            <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
            <button style={tabStyle('snippet')} onClick={() => setActiveTab('snippet')}>Snippet</button>
            <button style={tabStyle('events')} onClick={() => setActiveTab('events')}>Events</button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Pageviews', value: stats?.totalPageviews ?? '...', icon: '👁' },
                { label: 'Total Clicks', value: stats?.totalClicks ?? '...', icon: '🖱' },
                { label: 'Unique Pages', value: stats?.uniquePages ?? '...', icon: '📄' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'white', border: '1px solid rgba(26,23,20,0.1)',
                  borderRadius: '6px', padding: '1.5rem'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8C8580', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    {s.label}
                  </div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: '#1A1714' }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{
              background: 'white', border: '1px solid rgba(26,23,20,0.1)',
              borderRadius: '6px', padding: '1.5rem', marginBottom: '1.5rem'
            }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A1714', marginBottom: '1.5rem' }}>
                Events — Last 7 Days
              </h2>
              {stats?.chartData && stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,23,20,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8C8580' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#8C8580' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: '#1A1714', border: 'none', borderRadius: '4px', color: '#F5F0E8', fontSize: '12px' }}
                      cursor={{ fill: 'rgba(200,96,42,0.08)' }}
                    />
                    <Bar dataKey="events" fill="#C8602A" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8C8580', fontSize: '0.9rem' }}>
                  No events yet — paste the snippet on your website to start tracking
                </div>
              )}
            </div>

            {/* Top Pages + Recent Events */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

              {/* Top Pages */}
              <div style={{ background: 'white', border: '1px solid rgba(26,23,20,0.1)', borderRadius: '6px', padding: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A1714', marginBottom: '1rem' }}>
                  Top Pages
                </h2>
                {stats?.topPages && stats.topPages.length > 0 ? (
                  stats.topPages.map((p, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.6rem 0', borderBottom: i < stats.topPages.length - 1 ? '1px solid rgba(26,23,20,0.06)' : 'none'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#1A1714', fontFamily: 'monospace' }}>{p.page}</span>
                      <span style={{
                        fontSize: '0.75rem', background: '#F5F0E8', color: '#C8602A',
                        padding: '2px 8px', borderRadius: '99px', fontWeight: '600'
                      }}>{p.count}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#8C8580', fontSize: '0.875rem' }}>No page data yet</p>
                )}
              </div>

              {/* Recent Events */}
              <div style={{ background: 'white', border: '1px solid rgba(26,23,20,0.1)', borderRadius: '6px', padding: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A1714', marginBottom: '1rem' }}>
                  Recent Events
                </h2>
                {stats?.latestEvents && stats.latestEvents.length > 0 ? (
                  stats.latestEvents.slice(0, 6).map((e, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.6rem 0', borderBottom: i < 5 ? '1px solid rgba(26,23,20,0.06)' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.65rem', padding: '2px 7px', borderRadius: '99px', fontWeight: '500',
                          background: e.type === 'pageview' ? '#E6F1FB' : '#FAEEDA',
                          color: e.type === 'pageview' ? '#0C447C' : '#633806'
                        }}>{e.type}</span>
                        <span style={{ fontSize: '0.8rem', color: '#1A1714', fontFamily: 'monospace' }}>{e.page}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#8C8580' }}>
                        {new Date(e.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#8C8580', fontSize: '0.875rem' }}>No events yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* SNIPPET TAB */}
        {activeTab === 'snippet' && (
          <div style={{ background: 'white', border: '1px solid rgba(26,23,20,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,23,20,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A1714', marginBottom: '0.25rem' }}>
                  Tracking Snippet
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#8C8580' }}>
                  Paste before the &lt;/body&gt; tag on your website
                </p>
              </div>
              <button onClick={copySnippet} style={{
                background: copied ? '#065F46' : '#1A1714', color: '#F5F0E8',
                border: 'none', padding: '0.6rem 1.25rem', borderRadius: '4px',
                fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500',
                letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'background 0.2s'
              }}>
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
            <div style={{ background: '#1A1714', padding: '1.5rem', overflowX: 'auto' }}>
              <pre style={{ color: '#F5F0E8', fontSize: '0.78rem', lineHeight: '1.6', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap' }}>
                {snippet}
              </pre>
            </div>
            {/* Instructions */}
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A1714', marginBottom: '1rem' }}>How to install</h3>
              {[
                'Copy the tracking snippet above',
                'Open your website HTML file',
                'Paste just before the </body> closing tag',
                'Visit your website — events appear here automatically'
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '22px', height: '22px', background: '#C8602A', color: 'white',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: '600', flexShrink: 0
                  }}>{i + 1}</div>
                  <p style={{ fontSize: '0.875rem', color: '#1A1714', paddingTop: '2px' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div style={{ background: 'white', border: '1px solid rgba(26,23,20,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,23,20,0.1)' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A1714' }}>
                All Events
              </h2>
            </div>
            {stats?.latestEvents && stats.latestEvents.length > 0 ? (
              stats.latestEvents.map((e, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem 1.5rem', borderBottom: '1px solid rgba(26,23,20,0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.65rem', padding: '3px 9px', borderRadius: '99px', fontWeight: '500',
                      background: e.type === 'pageview' ? '#E6F1FB' : '#FAEEDA',
                      color: e.type === 'pageview' ? '#0C447C' : '#633806'
                    }}>{e.type}</span>
                    <span style={{ fontSize: '0.9rem', color: '#1A1714', fontFamily: 'monospace' }}>{e.page}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#8C8580' }}>
                    {new Date(e.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#8C8580' }}>
                No events yet. Paste the snippet on your website to start tracking.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
