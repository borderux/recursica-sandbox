import type { Meta, StoryObj } from '@storybook/react-vite'
import tokensJson from '../../../../recursica_tokens.json?raw'
import '../../../../recursica_variables_scoped.css'

type LineHeightEntry = { $type?: string; $value?: number | null }

type TokensShape = {
  tokens?: {
    font?: {
      'line-heights'?: Record<string, LineHeightEntry>
    }
  }
}

const data = JSON.parse(tokensJson) as TokensShape

function getLineHeights(): { key: string; cssVar: string; value: number | null }[] {
  const lineHeights = data.tokens?.font?.['line-heights']
  if (!lineHeights || typeof lineHeights !== 'object') return []

  return Object.entries(lineHeights)
    .filter(([name]) => !name.startsWith('$'))
    .filter(([, entry]) => entry && typeof entry === 'object')
    .map(([key, entry]) => {
      const cssVar = `--recursica_tokens_font_line-heights_${key}`
      const value = entry?.$value ?? null
      return { key, cssVar, value }
    })
}

const SAMPLE_TEXT =
  'The quick onyx goblin jumps over the lazy dwarf, executing a superb and swift maneuver with extraordinary zeal.'

function FontLineHeightsPalette() {
  const lineHeights = getLineHeights()
  if (lineHeights.length === 0) {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        Line heights were not found.
      </div>
    )
  }
  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {lineHeights.map(({ key, cssVar, value }) => (
        <section key={key}>
          <h2 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
            {key}
            {value !== null ? ` — ${value}` : ''}
          </h2>
          <p
            style={{
              lineHeight: `var(${cssVar})`,
              fontSize: 18,
              margin: 0,
            }}
          >
            {SAMPLE_TEXT}
          </p>
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: 'Tokens/Font/Line Heights',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <FontLineHeightsPalette />,
}
