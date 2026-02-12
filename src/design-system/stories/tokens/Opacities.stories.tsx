import type { Meta, StoryObj } from '@storybook/react-vite'
import tokensJson from '../../../../recursica_tokens.json?raw'
import '../../../../recursica_variables_scoped.css'

type OpacityEntry = { $type?: string; $value?: number | null }

type TokensShape = {
  tokens?: {
    opacities?: Record<string, OpacityEntry>
  }
}

const data = JSON.parse(tokensJson) as TokensShape

function getOpacities(): { key: string; cssVar: string; value: number | null }[] {
  const opacities = data.tokens?.opacities
  if (!opacities || typeof opacities !== 'object') return []

  return Object.entries(opacities)
    .filter(([name]) => !name.startsWith('$'))
    .filter(([, entry]) => entry && typeof entry === 'object')
    .map(([key, entry]) => {
      const cssVar = `--recursica_tokens_opacities_${key}`
      const value = entry?.$value ?? null
      return { key, cssVar, value }
    })
}

function OpacitiesPalette() {
  const opacities = getOpacities()
  if (opacities.length === 0) {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        Opacities were not found.
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
        gap: 20,
      }}
    >
      {opacities.map(({ key, cssVar, value }) => (
        <section key={key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, minWidth: 100 }}>
            {key}
            {value !== null ? ` — ${value}` : ''}
          </h2>
          <div
            style={{
              flex: 1,
              height: 32,
              backgroundColor: '#333',
              opacity: `var(${cssVar})`,
              borderRadius: 4,
            }}
          />
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: 'Tokens/Opacities',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <OpacitiesPalette />,
}
