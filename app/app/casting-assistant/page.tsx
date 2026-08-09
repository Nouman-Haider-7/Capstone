'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

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
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', height: '100vh', boxSizing: 'border-box' }}>
      <div style={{ padding: '1rem 0' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Casting Assistant</h1>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Describe the role you're casting for, and I'll help you refine it.</p>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxSizing: 'border-box',
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: '#666', textAlign: 'center', marginTop: '2rem' }}>
            Try: "I need someone for a lead comedy role, age 25-35"
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              width: 'fit-content',
              padding: '0.6rem 1rem',
              borderRadius: '16px',
              backgroundColor: message.role === 'user' ? '#0070f3' : '#2a2a2a',
              color: message.role === 'user' ? 'white' : '#eee',
              boxSizing: 'border-box',
              wordBreak: 'break-word',
            }}
          >
            {message.role === 'assistant' ? (
              <div className="markdown-content">
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return <ReactMarkdown key={i}>{part.text}</ReactMarkdown>
                  }
                  return null
                })}
              </div>
            ) : (
              message.parts.map((part, i) => {
                if (part.type === 'text') {
                  return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part.text}</span>
                }
                return null
              })
            )}
          </div>
        ))}

        {status === 'submitted' && (
          <div style={{ alignSelf: 'flex-start', color: '#666', padding: '0.6rem 1rem' }}>
            Thinking...
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
            border: '1px solid #444',
            background: '#1a1a1a',
            color: '#eee',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Jump to latest ↓
        </button>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', padding: '1rem 0' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your casting need..."
          disabled={status !== 'ready'}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '24px', border: '1px solid #444', fontSize: '1rem', background: '#1a1a1a', color: 'white', boxSizing: 'border-box' }}
        />
        {status === 'streaming' || status === 'submitted' ? (
          <button type="button" onClick={stop} style={{ padding: '0.75rem 1.5rem', borderRadius: '24px', border: 'none', background: '#e00', color: 'white', cursor: 'pointer' }}>
            Stop
          </button>
        ) : (
          <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '24px', border: 'none', background: '#0070f3', color: 'white', cursor: 'pointer' }}>
            Send
          </button>
        )}
      </form>
    </div>
  )
}
