'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { CastingDraftCard } from '../CastingDraftCard'
import { extractCastingDraft } from '../parseCastingDraft'

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
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

export default function ChatInterface() {
  const { messages, sendMessage, status, stop } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const timestamps = useRef<Map<string, string>>(new Map())

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

  const getTimestamp = (id: string) => {
    if (!timestamps.current.has(id)) {
      timestamps.current.set(id, formatTime())
    }
    return timestamps.current.get(id)
  }

  return (
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
        boxSizing: 'border-box',
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
                  {isUser ? (
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
                  ) : (
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
            <span
              style={{
                width: '12px',
                height: '12px',
                background: '#fff',
                borderRadius: '3px',
                display: 'block',
              }}
            />
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
              boxShadow:
                '0 4px 18px rgba(231,169,54,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <SendIcon />
          </button>
        )}
      </form>
    </div>
  )
}