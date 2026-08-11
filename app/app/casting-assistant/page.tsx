'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { CastingDraftCard } from './CastingDraftCard'
import { extractCastingDraft } from './parseCastingDraft'

const THEATER_BG =
  'https://images.unsplash.com/photo-1514306191717-452ec28c7814?ixlib=rb-4.1.0&q=75&fm=jpg&crop=entropy&cs=srgb&w=1920'

const NAV_ITEMS = ['Casting Assistant', 'My Auditions', 'Messages', 'My Profile']

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const messageTimestamps = new Map<string, string>()

function getTimestamp(id: string) {
  if (!messageTimestamps.has(id)) {
    messageTimestamps.set(id, formatTime())
  }
  return messageTimestamps.get(id)
}

function Avatar({ role }: { role: 'user' | 'assistant' | 'system' }) {
  const isUser = role === 'user'
  return (
    <div
      aria-hidden="true"
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        lineHeight: 1,
        background: isUser
          ? 'linear-gradient(135deg, #2a222e, #1c1720)'
          : 'linear-gradient(135deg, #3a2340 0%, #241827 100%)',
        border: isUser
          ? '1px solid rgba(155, 140, 160, 0.3)'
          : '1px solid rgba(231, 169, 54, 0.45)',
        boxShadow: isUser
          ? 'inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 0 12px rgba(231, 169, 54, 0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {isUser ? '🎬' : '🎭'}
    </div>
  )
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginLeft: '2px' }}
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  )
}

export default function CastingAssistantPage() {
  const { messages, sendMessage, status, stop } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom])

  const handleScroll = () => {
    const container = containerRef.current
    if (!container) return
    const threshold = 50
    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    setIsAtBottom(atBottom)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput('')
    }
  }

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
      {/* Warm golden spotlight behind the compact header */}
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
        {/* Section navigation sidebar (horizontal pill row on mobile, vertical list on desktop) */}
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
          {/* Compact horizontal header */}
          <header style={{ padding: '0.7rem 0 0.6rem', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.9rem 1.25rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Brand: icon + title/subtitle group */}
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

        {/* Chat workspace */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: 'rgba(15, 10, 18, 0.42)',
            border: '1px solid rgba(231,169,54,0.12)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="chat-scroll"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '1rem 0.9rem 0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
              boxSizing: 'border-box',
              overscrollBehavior: 'contain',
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  maxWidth: '360px',
                  margin: '2.5rem auto 0',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  padding: '0.7rem 1rem',
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  background: 'rgba(23, 16, 27, 0.45)',
                }}
              >
                Try: &quot;I need someone for a lead comedy role, age 25-35&quot;
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === 'user'
              return (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    width: '100%',
                  }}
                >
                  <Avatar role={message.role} />

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: 'min(80%, 34rem)',
                        padding: '0.65rem 1rem',
                        borderRadius: '18px',
                        backgroundColor: isUser
                          ? 'var(--color-user-bubble)'
                          : 'var(--color-assistant-bubble)',
                        backgroundImage: isUser
                          ? 'none'
                          : 'linear-gradient(135deg, #2b1d30 0%, #241827 100%)',
                        color: 'var(--color-text)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        border: isUser
                          ? '1px solid rgba(255,255,255,0.06)'
                          : '1px solid rgba(231,169,54,0.14)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                        boxSizing: 'border-box',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.role === 'assistant' ? (
                        message.parts.map((part, i) => {
                          if (part.type !== 'text') return null
                          const { before, draft, after } = extractCastingDraft(part.text)

                          return (
                            <div className="markdown" key={i}>
                              {before && <ReactMarkdown>{before}</ReactMarkdown>}
                              {draft && (
                                <CastingDraftCard
                                  role={draft.role}
                                  ageRange={draft.ageRange}
                                  genre={draft.genre}
                                  requirements={draft.requirements}
                                  notes={draft.notes}
                                />
                              )}
                              {after && <ReactMarkdown>{after}</ReactMarkdown>}
                            </div>
                          )
                        })
                      ) : (
                        message.parts.map((part, i) => {
                          if (part.type === 'text') {
                            return (
                              <span key={i} style={{ whiteSpace: 'pre-wrap' }}>
                                {part.text}
                              </span>
                            )
                          }
                          return null
                        })
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color: 'rgba(231,169,54,0.55)',
                        marginTop: '0.3rem',
                        padding: '0 0.2rem',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {getTimestamp(message.id)}
                    </span>
                  </div>
                </div>
              )
            })}

            {status === 'submitted' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', width: '100%' }}>
                <Avatar role="assistant" />
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '18px',
                    backgroundColor: 'var(--color-assistant-bubble)',
                    backgroundImage: 'linear-gradient(135deg, #2b1d30 0%, #241827 100%)',
                    border: '1px solid rgba(231,169,54,0.14)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                    display: 'flex',
                    gap: '0.35rem',
                  }}
                >
                  <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                  <span className="typing-dot" style={{ animationDelay: '150ms' }} />
                  <span className="typing-dot" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {!isAtBottom && (
            <button
              onClick={() => {
                setIsAtBottom(true)
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                position: 'absolute',
                bottom: '5.25rem',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                border: '1px solid rgba(231,169,54,0.35)',
                background: 'rgba(23, 16, 27, 0.7)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                zIndex: 1,
              }}
            >
              Jump to latest ↓
            </button>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: '0.6rem',
              padding: '0.65rem 0.8rem 0.8rem',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about roles, actors, auditions..."
              disabled={status !== 'ready'}
              className="chat-input"
              style={{
                flex: 1,
                minWidth: 0,
                padding: '0.9rem 1.5rem',
                borderRadius: '999px',
                border: '1px solid rgba(231,169,54,0.4)',
                fontSize: '0.95rem',
                background: 'rgba(24, 17, 26, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: 'var(--color-text)',
                boxSizing: 'border-box',
                boxShadow:
                  '0 0 0 1px rgba(231,169,54,0.04), 0 4px 24px rgba(231,169,54,0.13), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            />
            {status === 'streaming' || status === 'submitted' ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop generating"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: '1px solid rgba(193,73,83,0.6)',
                  background: 'rgba(193,73,83,0.9)',
                  color: 'white',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(193,73,83,0.3)',
                }}
              >
                <span style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '3px', display: 'block' }} />
              </button>
            ) : (
              <button
                type="submit"
                aria-label="Send message"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f3c45b 0%, #e7a936 55%, #c7852a 100%)',
                  color: '#1a1408',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(231,169,54,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                }}
              >
                <SendIcon />
              </button>
            )}
          </form>
        </div>

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