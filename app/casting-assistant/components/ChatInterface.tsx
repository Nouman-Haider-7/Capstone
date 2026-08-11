'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { CastingDraftCard } from '../CastingDraftCard'
import { extractCastingDraft } from '../parseCastingDraft'

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
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
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxSizing: 'border-box',
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem' }}>
            Try: &quot;I need someone for a lead comedy role, age 25-35&quot;
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: '0.5rem',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: `1px solid ${message.role === 'user' ? 'var(--color-text-muted)' : 'var(--color-accent)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                flexShrink: 0,
                background: 'var(--color-surface)',
              }}
            >
              {message.role === 'user' ? '🎬' : '🎭'}
            </div>

            <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '16px',
                  backgroundColor: message.role === 'user' ? 'var(--color-user-bubble)' : 'var(--color-assistant-bubble)',
                  color: 'var(--color-text)',
                  boxSizing: 'border-box',
                  wordBreak: 'break-word',
                }}
              >
                {message.role === 'assistant' ? (
                  message.parts.map((part, i) => {
                    if (part.type !== 'text') return null
                    const { before, draft, after } = extractCastingDraft(part.text)

                    return (
                      <div key={i}>
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
                      return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part.text}</span>
                    }
                    return null
                  })
                )}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                {getTimestamp(message.id)}
              </span>
            </div>
          </div>
        ))}

        {status === 'submitted' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              aria-hidden="true"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                flexShrink: 0,
                background: 'var(--color-surface)',
              }}
            >
              🎭
            </div>
            <div style={{ padding: '0.6rem 1rem', borderRadius: '16px', backgroundColor: 'var(--color-assistant-bubble)', display: 'flex', gap: '0.3rem' }}>
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
            alignSelf: 'center',
            margin: '0.5rem 0',
            padding: '0.4rem 1.2rem',
            borderRadius: '20px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Jump to latest ↓
        </button>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', padding: '1rem 0', alignItems: 'center' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about roles, actors, auditions..."
          disabled={status !== 'ready'}
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
            borderRadius: '30px',
            border: '1px solid var(--color-accent)',
            fontSize: '1rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            boxSizing: 'border-box',
            boxShadow: '0 0 16px rgba(232,178,77,0.15)',
          }}
        />
        {status === 'streaming' || status === 'submitted' ? (
          <button
            type="button"
            onClick={stop}
            aria-label="Stop generating"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              background: '#c14953',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            ■
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Send message"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--color-accent)',
              color: '#1a1408',
              cursor: 'pointer',
              fontSize: '1.1rem',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(232,178,77,0.4)',
            }}
          >
            ➤
          </button>
        )}
      </form>
    </>
  )
}
