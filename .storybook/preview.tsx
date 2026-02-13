import type { Preview } from '@storybook/react-vite'
import '@mantine/core/styles.css'
import '../recursica_variables_scoped.css'
import { MantineProvider } from '@mantine/core'
import { RecursicaThemeProvider } from '../src/design-system/RecursicaThemeProvider/RecursicaThemeProvider'
import { RecursicaFontLoader } from './RecursicaFontLoader'

const preview: Preview = {
  decorators: [
    (Story) => (
      <RecursicaThemeProvider>
        <MantineProvider>
          <RecursicaFontLoader>
            <Story />
          </RecursicaFontLoader>
        </MantineProvider>
      </RecursicaThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
