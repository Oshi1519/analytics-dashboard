import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh' }}>
      {/* Top navbar */}
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

      {/* Main content */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '2rem',
            color: '#1A1714',
            marginBottom: '0.5rem'
          }}>
            Welcome to your dashboard 👋
          </h1>
          <p style={{ color: '#8C8580', fontSize: '0.95rem' }}>
            Your analytics overview. Start by creating your first project.
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Visitors', value: '0', change: 'No data yet' },
            { label: 'Total Events', value: '0', change: 'No data yet' },
            { label: 'Active Projects', value: '0', change: 'Create one below' },
            { label: 'Avg Session', value: '0s', change: 'No data yet' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white',
              border: '1px solid rgba(26,23,20,0.1)',
              borderRadius: '6px',
              padding: '1.5rem',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#8C8580', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A1714', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8C8580' }}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Create project card */}
        <div style={{
          background: 'white',
          border: '2px dashed rgba(200,96,42,0.3)',
          borderRadius: '6px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.4rem',
            color: '#1A1714',
            marginBottom: '0.75rem'
          }}>
            Create your first project
          </h2>
          <p style={{ color: '#8C8580', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            A project represents one website you want to track. Each project gets a unique tracking snippet.
          </p>
          <button style={{
            background: '#1A1714',
            color: '#F5F0E8',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: '500',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}>
            + New Project
          </button>
        </div>

      </div>
    </div>
  )
}