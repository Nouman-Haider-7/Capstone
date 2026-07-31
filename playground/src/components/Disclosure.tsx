import { useState, useId } from 'react'

interface DisclosureProps {
  summary: string
  children: React.ReactNode
}

function Disclosure({ summary, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentId = useId()

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
      >
        {summary}
      </button>
      {isOpen && (
        <div id={contentId}>
          {children}
        </div>
      )}
    </div>
  )
}

export default Disclosure