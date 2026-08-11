import ChatInterface from './components/ChatInterface'

const THEATER_BG =
  'https://images.unsplash.com/photo-1514306191717-452ec28c7814?ixlib=rb-4.1.0&q=75&fm=jpg&crop=entropy&cs=srgb&w=1920'

const NAV_ITEMS = ['Casting Assistant', 'My Auditions', 'Messages', 'My Profile']

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
      {/* Cinematic theater stage background */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${THEATER_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(0.9) brightness(0.85)',
        }}
      />
      {/* Dark plum/charcoal overlay for readability */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(180deg, rgba(11,9,13,0.84) 0%, rgba(11,9,13,0.62) 35%, rgba(20,12,22,0.68) 60%, rgba(11,9,13,0.9) 100%)',
        }}
      />
      {/* Plum focus behind the chat area */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(ellipse at 50% 55%, rgba(36,24,39,0.42) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Curtain-like side gradients */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'min(180px, 22vw)',
          height: '100vh',
          zIndex: 2,
          background: 'linear-gradient(90deg, #2a0f1a 0%, transparent 100%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'min(180px, 22vw)',
          height: '100vh',
          zIndex: 2,
          background: 'linear-gradient(270deg, #2a0f1a 0%, transparent 100%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />
      {/* Soft vignette for depth */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Warm golden spotlight behind the header */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-7rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(620px, 92vw)',
          height: '260px',
          zIndex: 2,
          background: 'radial-gradient(ellipse, rgba(231,169,54,0.14), transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="app-shell"
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '1060px',
          margin: '0 auto',
          padding: '0.5rem 0 0',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <div className="app-layout">
          {/* Section navigation sidebar (decorative, no routing) */}
          <aside className="app-sidebar" aria-label="Main navigation">
            {NAV_ITEMS.map((item, i) => {
              const active = i === 0
              return (
                <span
                  key={item}
                  aria-disabled={!active}
                  title={active ? undefined : 'Coming soon'}
                  className={active ? 'sidebar-item is-active' : 'sidebar-item'}
                >
                  {item}
                </span>
              )
            })}
          </aside>

          <div className="app-main">
            {/* Compact header */}
            <header style={{ padding: '0.7rem 0 0.6rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #3a2340 0%, #1d1422 100%)',
                    border: '1px solid rgba(231,169,54,0.42)',
                    boxShadow:
                      '0 0 0 4px rgba(231,169,54,0.05), 0 4px 18px rgba(0,0,0,0.4), 0 0 18px rgba(231,169,54,0.16)',
                  }}
                >
                  🎭
                </div>
                <div style={{ minWidth: 0 }}>
                  <h1
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: 'clamp(1.25rem, 3.4vw, 1.6rem)',
                      letterSpacing: '0.02em',
                      lineHeight: 1.1,
                      margin: 0,
                      background: 'linear-gradient(180deg, #f6c96b 0%, #e7a936 55%, #c7852a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 1px 10px rgba(231,169,54,0.25))',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Casting Assistant
                  </h1>
                  <p
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      margin: '0.15rem 0 0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        color: 'rgba(231,169,54,0.9)',
                        fontSize: '0.55rem',
                        lineHeight: 1,
                        opacity: 0.95,
                        flexShrink: 0,
                      }}
                    >
                      ✦
                    </span>
                    <span
                      style={{
                        color: 'rgba(231,169,54,0.78)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        marginRight: '-0.32em',
                      }}
                    >
                      AI chatbot for theater casting
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        color: 'rgba(231,169,54,0.9)',
                        fontSize: '0.55rem',
                        lineHeight: 1,
                        opacity: 0.95,
                        flexShrink: 0,
                      }}
                    >
                      ✦
                    </span>
                  </p>
                </div>
              </div>

              {/* Hairline divider under the header */}
              <div
                aria-hidden="true"
                style={{
                  height: '1px',
                  marginTop: '0.7rem',
                  background: 'linear-gradient(90deg, transparent, rgba(231,169,54,0.35), transparent)',
                }}
              />
            </header>

            <ChatInterface />

            <p
              style={{
                textAlign: 'center',
                color: 'var(--color-text-faint)',
                fontSize: '0.72rem',
                letterSpacing: '0.05em',
                padding: '0.45rem 0 0.75rem',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'rgba(231,169,54,0.55)' }}>✦</span>
              &nbsp;Your backstage partner for perfect casting&nbsp;
              <span style={{ color: 'rgba(231,169,54,0.55)' }}>✦</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}