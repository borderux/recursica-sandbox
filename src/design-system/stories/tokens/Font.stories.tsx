import type { Meta, StoryObj } from '@storybook/react-vite'
import tokensJson from '../../../../tokens.json?raw'
import '../../../../recursica-variables-scoped.css'

type FontWeights = Record<string, { $type: string; $value: number }>

type TypefaceVariant = { weight?: string; style?: string }

type TypefaceEntry = {
  $value?: string | string[]
  $extensions?: {
    'com.google.fonts'?: { url?: string; variants?: TypefaceVariant[] },
    variants?: TypefaceVariant[]
  }
}

type TokensShape = {
  tokens?: {
    font?: {
      typefaces?: Record<string, TypefaceEntry>
      weights?: FontWeights
    }
  }
}

const data = JSON.parse(tokensJson) as TokensShape

function weightKeyToCssVar(key: string): string {
  return `--recursica-tokens-font-weights-${key.replace(/-/g, '_')}`
}

function parseWeightRef(ref: string): string | null {
  const match = ref.match(/tokens\.font\.weights\.([^}.]+)/)
  return match ? match[1].trim() : null
}

function getWeightsSortedByValue(): { key: string; weightVar: string }[] {
  const weights = data.tokens?.font?.weights
  if (!weights || typeof weights !== 'object') return []

  const entries = Object.entries(weights)
    .filter(([name]) => !name.startsWith('$'))
    .filter(([, entry]) => entry?.$type === 'number' && typeof entry.$value === 'number')
    .map(([key, entry]) => ({ key, value: (entry as { $value: number }).$value }))
    .sort((a, b) => a.value - b.value)

  return entries.map(({ key }) => ({ key, weightVar: weightKeyToCssVar(key) }))
}

function getWeightKeysForTypeface(typefaceKey: string): string[] {
  const typefaces = data.tokens?.font?.typefaces
  const entry = typefaces?.[typefaceKey] as TypefaceEntry | undefined
  const weightsData = data.tokens?.font?.weights
  if (!weightsData) return []

  const variants = entry?.$extensions?.variants
  if (Array.isArray(variants) && variants.length > 0) {
    const keys = new Set<string>()
    for (const v of variants) {
      const key = parseWeightRef(v?.weight ?? '')
      if (key && Object.prototype.hasOwnProperty.call(weightsData, key)) keys.add(key)
    }
    const order = getWeightsSortedByValue().map((w) => w.key)
    return order.filter((k) => keys.has(k))
  }

  return getWeightsSortedByValue().map((w) => w.key)
}

function getTypefaceDisplayName(entry: TypefaceEntry): string {
  const v = entry?.$value
  if (typeof v === 'string') return v
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') return v[0]
  return ''
}

function getTypefaces() {
  const typefaces = data.tokens?.font?.typefaces
  if (!typefaces || typeof typefaces !== 'object') return []

  const allWeights = getWeightsSortedByValue()

  const ret = Object.entries(typefaces)
    .filter(([name]) => !name.startsWith('$'))
    .filter(([, face]) => face && typeof face === 'object')
    .map(([key, entry]) => {
      const cssVar = `--recursica-tokens-font-typefaces-${key}`
      const displayName = getTypefaceDisplayName(entry)
      const weightKeys = getWeightKeysForTypeface(key)
      const weights = weightKeys.map((wk) => {
        const w = allWeights.find((a) => a.key === wk)
        return w ? { key: wk, weightVar: w.weightVar } : null
      }).filter((w): w is { key: string; weightVar: string } => w !== null)
      return { key, displayName, cssVar, weights }
    })
    console.log(ret);
    return ret;
}

const SAMPLE_TEXT = 'The quick onyx goblin jumps over the lazy dwarf, executing a superb and swift maneuver with extraordinary zeal.'

function FontPalette() {
  const typefaces = getTypefaces()
  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      {typefaces.map(({ key, displayName, cssVar, weights }) => (
        <section key={key}>
          <h2 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
            {key}
            {displayName ? ` — ${displayName}` : ''}
          </h2>
          {weights.map(({ key: weightKey, weightVar }) => (
            <div key={weightKey} style={{ marginBottom: 12 }}>
              <span
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: '#666',
                  marginBottom: 2,
                  textTransform: 'capitalize',
                }}
              >
                {weightKey.replace(/-/g, ' ')}
              </span>
              <p
                style={{
                  fontFamily: `var(${cssVar})`,
                  fontWeight: `var(${weightVar})`,
                  fontSize: 18,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {SAMPLE_TEXT}
              </p>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: 'Tokens/Font',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <FontPalette />,
}
