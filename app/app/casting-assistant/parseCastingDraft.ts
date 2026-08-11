export interface ParsedCastingDraft {
  role: string
  ageRange: string
  genre: string
  requirements: string
  notes: string
}

export function extractCastingDraft(text: string): { before: string; draft: ParsedCastingDraft | null; after: string } {
  const match = text.match(/\[CASTING_DRAFT\]([\s\S]*?)\[\/CASTING_DRAFT\]/)

  if (!match) {
    return { before: text, draft: null, after: '' }
  }

  const before = text.slice(0, match.index)
  const after = text.slice((match.index ?? 0) + match[0].length)
  const block = match[1]

  const getField = (label: string) => {
    const fieldMatch = block.match(new RegExp(`${label}:\\s*(.+)`))
    return fieldMatch ? fieldMatch[1].trim() : ''
  }

  const draft: ParsedCastingDraft = {
    role: getField('Role'),
    ageRange: getField('AgeRange'),
    genre: getField('Genre'),
    requirements: getField('Requirements'),
    notes: getField('Notes'),
  }

  return { before, draft, after }
}
