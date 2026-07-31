import { useState } from 'react'
import Disclosure from './components/Disclosure'
import Tabs from './components/Tabs'
import Modal from './components/Modal'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tabsData = [
    { id: 'one', label: 'Tab One', content: <p>Content for tab one.</p> },
    { id: 'two', label: 'Tab Two', content: <p>Content for tab two.</p> },
    { id: 'three', label: 'Tab Three', content: <p>Content for tab three.</p> },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Accessibility Playground</h1>

      <Disclosure summary="What is this playground for?">
        <p>This folder contains hand-built accessible components: a disclosure, tabs, and a modal.</p>
      </Disclosure>

      <hr style={{ margin: '2rem 0' }} />

      <Tabs tabs={tabsData} />

      <hr style={{ margin: '2rem 0' }} />

      <button type="button" onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Example Modal">
        <p>This is a modal dialog. Try pressing Tab to see focus stay trapped inside.</p>
        <input type="text" placeholder="Sample input" />
      </Modal>
    </div>
  )
}

export default App