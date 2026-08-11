import ChatInterface from './components/ChatInterface'

export default function CastingAssistantPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: 'var(--color-bg)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '180px',
          height: '100vh',
          background: 'linear-gradient(90deg, #2a0f1a 0%, transparent 100%)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '180px',
          height: '100vh',
          background: 'linear-gradient(270deg, #2a0f1a 0%, transparent 100%)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box', position: 'relative' }}>
        <div style={{ textAlign: 'center', padding: '2.5rem 0 1.5rem', position: 'relative' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-3rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '320px',
              height: '220px',
              background: 'radial-gradient(ellipse, rgba(232,178,77,0.18), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem', position: 'relative' }}>🎭</div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.25rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              margin: 0,
              color: 'var(--color-accent)',
              position: 'relative',
            }}
          >
            Casting Assistant
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', position: 'relative' }}>
            AI chatbot for theater casting
          </p>
        </div>

        <ChatInterface />

        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem', letterSpacing: '0.03em', paddingBottom: '1rem' }}>
          ✦ Your backstage partner for perfect casting ✦
        </p>
      </div>
    </div>
  )
}
