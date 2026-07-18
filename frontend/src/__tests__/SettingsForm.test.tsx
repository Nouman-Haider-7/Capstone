import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import SettingsForm from '../components/SettingsForm'

vi.mock('../lib/api', () => ({
  default: {
    put: vi.fn().mockRejectedValue(new Error('Network error')),
    interceptors: {
      request: { use: vi.fn() },
    },
  },
}))

beforeEach(() => {
  vi.stubGlobal('importMetaEnv', { VITE_MOCK_TOKEN: 'mock-token' })
})

function renderForm() {
  return render(
    <BrowserRouter>
      <SettingsForm />
    </BrowserRouter>
  )
}

describe('SettingsForm', () => {
  test('shows a validation error when Full Name is left empty', async () => {
    const user = userEvent.setup()
    renderForm()

    const saveButton = screen.getByRole('button', { name: /save settings/i })
    await user.click(saveButton)

    const nameError = await screen.findByText(/full name must be at least 2 characters/i)
    expect(nameError).toBeInTheDocument()
    expect(nameError).toHaveAttribute('id', 'fullName-error')
    expect(screen.getByRole('textbox', { name: /full name/i })).toBeInvalid()
  })
})
