import type { Meta, StoryObj } from '@storybook/react-vite'
import brandJson from '../../../../brand.json?raw';
import tokensJson from '../../../../tokens.json?raw';
import '../../../../recursica-variables-scoped.css'

const REF_PATTERN = /^\{([^}]+)\}$/

function getByPath(obj: unknown, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

function tokenValueToCss(
  tokenNode: unknown,
  cssProperty: string
): string | number | undefined {
  if (tokenNode == null || typeof tokenNode !== 'object') return undefined
  const node = tokenNode as Record<string, unknown>
  const value = node.$value
  const tokenType = node.$type as string | undefined

  if (value === undefined || value === null) {
    if (cssProperty === 'textTransform' || cssProperty === 'textDecoration')
      return 'none'
    return undefined
  }

  if (tokenType === 'fontFamily') {
    const v = value as string | string[]
    if (Array.isArray(v))
      return v.map((s) => (s.includes(' ') ? `"${s}"` : s)).join(', ')
    return typeof v === 'string' ? v : undefined
  }

  if (tokenType === 'dimension' && typeof value === 'object' && value !== null) {
    const d = value as { value?: number; unit?: string }
    if (typeof d.value === 'number' && d.unit) return `${d.value}${d.unit}`
    return undefined
  }

  if (tokenType === 'number' && typeof value === 'number') {
    if (cssProperty === 'letterSpacing') return `${value}em`
    return value
  }

  if (tokenType === 'string') return value === null ? 'none' : String(value)

  if (typeof value === 'number') return value
  if (typeof value === 'string') return value
  return undefined
}

function resolveRef(ref: string, tokensData: Record<string, unknown>): unknown {
  const match = ref.trim().match(REF_PATTERN)
  if (!match) return ref
  const path = match[1]
  return getByPath(tokensData, path)
}

type TypographyValue = Record<string, string>
type BrandTypography = Record<string, { $type?: string; $value?: TypographyValue }>

function resolveTypography(
  brandData: { brand?: { typography?: BrandTypography } },
  tokensData: Record<string, unknown>
): { name: string; style: React.CSSProperties }[] {
  const typography = brandData.brand?.typography
  if (!typography || typeof typography !== 'object') return []

  const cssPropMap: Record<string, string> = {
    fontFamily: 'fontFamily',
    fontSize: 'fontSize',
    fontWeight: 'fontWeight',
    letterSpacing: 'letterSpacing',
    lineHeight: 'lineHeight',
    textCase: 'textTransform',
    textDecoration: 'textDecoration',
  }

  return Object.entries(typography)
    .filter(([key]) => !key.startsWith('$'))
    .filter(
      ([, entry]) =>
        entry &&
        typeof entry === 'object' &&
        entry.$value &&
        typeof entry.$value === 'object'
    )
    .map(([name, entry]) => {
      const raw = entry.$value as Record<string, string>
      const style: React.CSSProperties = {}
      for (const [prop, refOrValue] of Object.entries(raw)) {
        const cssProp = cssPropMap[prop]
        if (!cssProp) continue
        const resolved =
          typeof refOrValue === 'string' && REF_PATTERN.test(refOrValue)
            ? resolveRef(refOrValue, tokensData)
            : refOrValue
        const cssValue = tokenValueToCss(resolved, cssProp)
        if (cssValue !== undefined && cssValue !== null)
          (style as Record<string, string | number>)[cssProp] = cssValue
      }
      return { name, style }
    })
}

const brandData = JSON.parse(brandJson) as { brand?: { typography?: BrandTypography } }
const tokensData = JSON.parse(tokensJson) as Record<string, unknown>
const typographyStyles = resolveTypography(brandData, tokensData)

const SAMPLE_TEXT =
  'The quick onyx goblin jumps over the lazy dwarf, executing a superb and swift maneuver with extraordinary zeal.'

function ThemeTypographyPalette() {
  if (typographyStyles.length === 0) {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        No typography styles found in brand.
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
        gap: 32,
      }}
    >
      {typographyStyles.map(({ name, style }) => {
        const cssVarPrefix = `--recursica-brand-typography-${name}`
        return (
          <section key={name}>
            <h2
              style={{
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 600,
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {name}
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                {' — '}
                <code style={{ fontSize: 11 }}>{cssVarPrefix}-*</code>
              </span>
            </h2>
            <p style={{ margin: 0, ...style }}>{SAMPLE_TEXT}</p>
          </section>
        )
      })}
    </div>
  )
}

const meta = {
  title: 'Theme/Type',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ThemeTypographyPalette />,
}
