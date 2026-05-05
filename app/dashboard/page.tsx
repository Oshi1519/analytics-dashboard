'use client'
import { UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  name: string
  domain: string | null
  createdAt: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data.projects || [])
  }

  async function createProject() {
    if (!name) return
    setLoading(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, domain })
    })
    const data = await res.json()
    if (data.project) {
      setProjects([...projects, data.project])
      setName('')
      setDomain('')
      setShowForm(false)
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid rgba(26,23,20,0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#1A1714'
        }}>
          Insight<span style={{ color: '#C8602A', fontStyle: 'italic' }}>ly</span>
        </span>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A1714', marginBottom: '0.5rem' }}>
              Dashboard
            </h1>
            <p style={{ color: '#8C8580', fontSize: '0.95rem' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} active
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: '#1A1714', color: '#F5F0E8', border: 'none',
              padding: '0.75rem 1.5rem', borderRadius: '4px', fontSize: '0.85rem',
              fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase',
              cursor: 'pointer'
            }}>
            + New Project
          </button>
        </div>

        {/* Create Project Modal */}
        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{
              background: 'white', borderRadius: '8px', padding: '2rem',
              width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A1714', marginBottom: '0.5rem' }}>
                New Project
              </h2>
              <p style={{ color: '#8C8580', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Create a project to get your tracking snippet.
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#1A1714', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="My Website"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid rgba(26,23,20,0.2)',
                    borderRadius: '4px', fontSize: '0.95rem', outline: 'none',
                    fontFamily: 'inherit', background: '#FAFAFA'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#1A1714', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Domain (optional)
                </label>
                <input
                  type="text"
                  placeholder="mywebsite.com"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid rgba(26,23,20,0.2)',
                    borderRadius: '4px', fontSize: '0.95rem', outline: 'none',
                    fontFamily: 'inherit', background: '#FAFAFA'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={createProject}
                  disabled={loading || !name}
                  style={{
                    flex: 1, background: loading ? '#8C8580' : '#1A1714',
                    color: '#F5F0E8', border: 'none', padding: '0.75rem',
                    borderRadius: '4px', fontSize: '0.875rem', fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '0.75rem 1.25rem', background: 'transparent',
                    border: '1px solid rgba(26,23,20,0.2)', borderRadius: '4px',
                    fontSize: '0.875rem', cursor: 'pointer', color: '#8C8580'
                  }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div style={{
            background: 'white', border: '2px dashed rgba(200,96,42,0.3)',
            borderRadius: '6px', padding: '3rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A1714', marginBottom: '0.75rem' }}>
              Create your first project
            </h2>
            <p style={{ color: '#8C8580', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              A project represents one website you want to track.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: '#1A1714', color: '#F5F0E8', border: 'none',
                padding: '0.75rem 2rem', borderRadius: '4px', fontSize: '0.85rem',
                fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer'
              }}>
              + New Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => router.push(`/dashboard/${project.id}`)}
                style={{
                  background: 'white', border: '1px solid rgba(26,23,20,0.1)',
                  borderRadius: '6px', padding: '1.5rem',
                  cursor: 'pointer', transition: 'box-shadow 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,23,20,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '36px', height: '36px', background: '#F5F0E8',
                    borderRadius: '6px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.1rem'
                  }}>📊</div>
                  <span style={{
                    fontSize: '0.7rem', background: '#ECFDF5', color: '#065F46',
                    padding: '2px 8px', borderRadius: '99px', fontWeight: '500'
                  }}>Active</span>
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A1714', marginBottom: '0.25rem' }}>
                  {project.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#8C8580', marginBottom: '1rem' }}>
                  {project.domain || 'No domain set'}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#8C8580', borderTop: '1px solid rgba(26,23,20,0.08)', paddingTop: '0.75rem' }}>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
