interface CastingDraftCardProps {
  role: string
  ageRange: string
  genre: string
  requirements: string
  notes: string
}

export function CastingDraftCard({ role, ageRange, genre, requirements, notes }: CastingDraftCardProps) {
  return (
    <div
      style={{
        border: '1px solid rgba(231,169,54,0.22)',
        borderRadius: '12px',
        padding: '1rem',
        background: 'linear-gradient(135deg, #241827, #1a1220)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display), serif',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-accent)',
          fontWeight: 600,
          marginBottom: '0.75rem',
        }}
      >
        Casting Call Draft
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: '0.5rem', columnGap: '1rem', fontSize: '0.95rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Role</span>
        <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{role}</span>

        <span style={{ color: 'var(--color-text-muted)' }}>Age Range</span>
        <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{ageRange}</span>

        <span style={{ color: 'var(--color-text-muted)' }}>Genre</span>
        <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{genre}</span>

        <span style={{ color: 'var(--color-text-muted)' }}>Requirements</span>
        <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{requirements}</span>

        {notes && notes.toLowerCase() !== 'none' && (
          <>
            <span style={{ color: 'var(--color-text-muted)' }}>Notes</span>
            <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{notes}</span>
          </>
        )}
      </div>
    </div>
  )
}
