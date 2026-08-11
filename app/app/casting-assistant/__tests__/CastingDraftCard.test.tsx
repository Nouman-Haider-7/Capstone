import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CastingDraftCard } from '../CastingDraftCard'

describe('CastingDraftCard', () => {
  it('renders all provided casting details', () => {
    render(
      <CastingDraftCard
        role="Lead"
        ageRange="25-35"
        genre="Comedy"
        requirements="Strong improv skills"
        notes="None"
      />
    )

    expect(screen.getByText('Casting Call Draft')).toBeInTheDocument()
    expect(screen.getByText('Lead')).toBeInTheDocument()
    expect(screen.getByText('25-35')).toBeInTheDocument()
    expect(screen.getByText('Comedy')).toBeInTheDocument()
    expect(screen.getByText('Strong improv skills')).toBeInTheDocument()
  })

  it('does not render a Notes row when notes is "None"', () => {
    render(
      <CastingDraftCard
        role="Supporting"
        ageRange="18-25"
        genre="Drama"
        requirements="Fluent in Urdu"
        notes="None"
      />
    )

    expect(screen.queryByText('Notes')).not.toBeInTheDocument()
  })

  it('renders a Notes row when notes has real content', () => {
    render(
      <CastingDraftCard
        role="Extra"
        ageRange="30-40"
        genre="Action"
        requirements="Stunt experience"
        notes="Must be available on weekends"
      />
    )

    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(screen.getByText('Must be available on weekends')).toBeInTheDocument()
  })
})
