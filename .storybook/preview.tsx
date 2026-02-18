import type { Preview } from '@storybook/react-vite'
import '@mantine/core/styles.css'
import '../recursica_variables_scoped.css'
import { MantineProvider } from '@mantine/core'
import { RecursicaThemeProvider } from '../src/design-system/RecursicaThemeProvider/RecursicaThemeProvider'
import { RecursicaFontLoader } from './RecursicaFontLoader'

const LIGHT_BG = '#ffffff';
const DARK_BG = '#1a1a1a';

const preview: Preview = {
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
  decorators: [
    (Story, context) => {
      const bg = context.globals?.backgrounds?.value;
      const theme =
        bg === 'dark' || bg === DARK_BG ? 'dark' : 'light';
      return (
        <RecursicaThemeProvider theme={theme}>
          <MantineProvider>
            <RecursicaFontLoader>
              <Story />
            </RecursicaFontLoader>
          </MantineProvider>
        </RecursicaThemeProvider>
      );
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Tokens', 'Theme', 'UI Kit'],
      },
    },
    backgrounds: {
      options: {
        light: { name: 'Light', value: LIGHT_BG },
        dark: { name: 'Dark', value: DARK_BG },
      },
    },
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
