import '@mantine/core/styles.css';
import '../recursica_variables_scoped.css';
import { MantineProvider, Box } from '@mantine/core';
import { RecursicaThemeProvider } from './design-system/RecursicaThemeProvider/RecursicaThemeProvider';

const THEME_FORGE_URL = 'https://forge.recursica.com?demo=true';

function App() {
  return (
    <RecursicaThemeProvider>
      <MantineProvider>
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '24px',
          boxSizing: 'border-box'
        }}
        bg='color/gray/050'
      >
        <Box style={{ textAlign: 'center', maxWidth: '480px' }}>
          <Box style={{ marginBottom: '16px' }}>
            <img
              src='/recursica_logo.png'
              alt='Recursica'
              style={{ height: '64px', width: 'auto' }}
            />
          </Box>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: '0 0 12px',
              color: 'inherit'
            }}
          >
            Recursica Sandbox
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: 1.5,
              margin: '0 0 20px',
              color: 'var(--recursica-color-gray-700, #374151)'
            }}
          >
            Welcome to your Recursica playground. Click the link below to launch Theme Forge to edit
            the design tokens and themes. Once updated, create a pull request to this repo from
            Theme Forge to watch the magic happen.
          </p>
          <a
            href={THEME_FORGE_URL}
            style={{
              fontSize: '0.875rem',
              color: 'var(--recursica-color-primary-600, #2563eb)',
              textDecoration: 'underline'
            }}
          >
            Launch Theme Forge
          </a>
          <br />
          <br />
          <a
            href={"/storybook"}
            style={{
              fontSize: '0.875rem',
              color: 'var(--recursica-color-primary-600, #2563eb)',
              textDecoration: 'underline'
            }}
          >
            Checkout the Storybook
          </a>
        </Box>
      </Box>
    </MantineProvider>
    </RecursicaThemeProvider>
  );
}

export default App;
