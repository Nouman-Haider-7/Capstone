import { useState, useId, useRef } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const idPrefix = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index

    if (event.key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length
    } else if (event.key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      newIndex = 0
    } else if (event.key === 'End') {
      newIndex = tabs.length - 1
    } else {
      return
    }

    event.preventDefault()
    setActiveIndex(newIndex)
    tabRefs.current[newIndex]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Example Tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el }}
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${idPrefix}-panel-${tab.id}`}
          aria-labelledby={`${idPrefix}-tab-${tab.id}`}
          hidden={activeIndex !== index}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}

export default Tabs