import { useState, type KeyboardEvent } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  max?: number
  placeholder?: string
  errorId?: string
}

export default function TagInput({ value, onChange, max = 10, placeholder = 'Type and press Enter', errorId }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim()
    if (!tag) return
    if (value.length >= max) return
    if (value.includes(tag)) return
    onChange([...value, tag])
    setInput('')
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-indigo-600 hover:text-indigo-900 font-bold leading-none"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      {value.length < max && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          aria-describedby={errorId}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      )}
      <p className="text-xs text-gray-500 mt-1">{value.length} / {max} skills</p>
    </div>
  )
}
