import type { Meta, StoryObj } from '@storybook/react-vite'
import brandJson from '../../../../recursica_brand.json?raw';
import '../../../../recursica_variables_scoped.css'

type BrandTypography = Record<string, { $type?: string; $value?: unknown }>

function getTypographyTypeNames(brandData: {
  brand?: { typography?: BrandTypography }
}): string[] {
  const typography = brandData.brand?.typography
  if (!typography || typeof typography !== 'object') return []
  return Object.entries(typography)
    .filter(([key]) => !key.startsWith('$'))
    .filter(
      ([, entry]) =>
        entry && typeof entry === 'object' && entry.$value != null
    )
    .map(([name]) => name)
}

/** Maps brand.typography type name to the scoped CSS helper class (e.g. body → recursica_brand_typography_body). */
function typographyClassName(typeName: string): string {
  return `recursica_brand_typography_${typeName}`
}

const brandData = JSON.parse(brandJson) as {
  brand?: { typography?: BrandTypography }
}
const typographyTypeNames = getTypographyTypeNames(brandData)

const SAMPLE_TEXT =
  'The quick onyx goblin jumps over the lazy dwarf, executing a superb and swift maneuver with extraordinary zeal.'

function ThemeTypographyPalette() {
  if (typographyTypeNames.length === 0) {
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
      {typographyTypeNames.map((name) => {
        const helperClass = typographyClassName(name)
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
                <code style={{ fontSize: 11 }}>.{helperClass}</code>
              </span>
            </h2>
            <p className={typographyClassName(name)} style={{ margin: 0 }}>
              {SAMPLE_TEXT}
            </p>
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
