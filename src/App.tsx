import { useState } from 'react';
import '@mantine/core/styles.css';
import '../recursica.css';
import { ThemeProvider, Button, Textfield, Box, Typography, Flex } from '@recursica/ui-kit-mantine';

interface FormData {
  name: string;
  email: string;
  buttonColor: string;
}

const REPO_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'borderux';
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO || 'recursica-sandbox';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    buttonColor: '#3366FF',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [prUrl, setPrUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    if (!GITHUB_TOKEN) {
      setErrorMessage(
        'GitHub token is not configured. Please set VITE_GITHUB_TOKEN environment variable.'
      );
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(formData.buttonColor)) {
      setErrorMessage('Please enter a valid hex color (e.g., #FF0000 or #F00)');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const changeData = {
        name: formData.name,
        email: formData.email,
        buttonColor: formData.buttonColor,
        timestamp: new Date().toISOString(),
      };

      const issueBody = `**Name:** ${formData.name}
**Email:** ${formData.email}
**New Button Color:** ${formData.buttonColor}

## Change Request Data
\`\`\`json
${JSON.stringify(changeData, null, 2)}
\`\`\`

This issue was created automatically from the main application form.`;

      const issueResp = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `Button Color Request: ${formData.buttonColor}`,
            body: issueBody,
            labels: ['button-color-request'],
          }),
        }
      );

      if (!issueResp.ok) {
        const errorText = await issueResp.text();
        throw new Error(`Failed to create issue: ${issueResp.status} ${errorText}`);
      }

      const issue = await issueResp.json();
      setPrUrl(issue.html_url);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', buttonColor: '#3366FF' });
    } catch (error) {
      console.error('Error creating issue:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear any previous errors when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const isFormValid =
    formData.name.trim() && formData.email.trim() && formData.buttonColor.trim() && GITHUB_TOKEN;

  return (
    <ThemeProvider themeClassname='RecursicaBrand-Light'>
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}
        bg='color/gray/050'
      >
        {/* Header */}
        <Box
          p='size/spacer/4x'
          bg='layers/layer-0/properties/surface'
          style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
        >
          <Box style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Box style={{ marginBottom: '8px' }}>
              <Typography variant='h1' as='h1'>
                Recursica Sandbox
              </Typography>
            </Box>
            <Box style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Typography variant='body-1/normal' color='color/gray/600'>
                This demonstrates how modifications to the Recursica JSON structure will update the styling in the components. This demonstrates by creating a Storybook UI build to demonstrate automated PR previews can allow designers to see their changes in the code.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box style={{ flex: 1 }} p='size/spacer/4x'>
          <Box style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Configuration Warning */}
            {!GITHUB_TOKEN && (
              <Box
                p='size/spacer/3x'
                bg='color/salmon/50'
                br='size/border-radius/2x'
                style={{
                  marginBottom: '32px',
                  border: '1px solid var(--recursica-color-salmon-200)'
                }}
              >
                <Box style={{ marginBottom: '8px' }}>
                  <Flex align='center' gap='size/spacer/default'>
                    <Typography variant='h4' as='h3' color='color/salmon/700'>
                      ⚠️ Configuration Required
                    </Typography>
                  </Flex>
                </Box>
                <Box style={{ marginBottom: '8px' }}>
                  <Typography color='color/salmon/700'>
                    GitHub token is not configured. Please set the VITE_GITHUB_TOKEN environment
                    variable.
                  </Typography>
                </Box>
                <Typography variant='body-2/normal' color='color/salmon/600'>
                  <strong>Repository:</strong> {REPO_OWNER}/{REPO_NAME}
                </Typography>
              </Box>
            )}

            {/* Main Form Card */}
            <Box
              p='size/spacer/4x'
              bg='layers/layer-0/properties/surface'
              br='size/border-radius/2x'
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            >

              <form onSubmit={handleSubmit}>
                <Flex direction='column' gap='size/spacer/3x'>
                  {/* Form Fields */}
                  <Textfield
                    label='Name'
                    placeholder='Enter your name'
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />

                  <Textfield
                    label='Email'
                    placeholder='your.email@example.com'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />

                  <Box>
                    <Textfield
                      label='Color'
                      placeholder='#3366FF'
                      value={formData.buttonColor}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      helpText='Enter a hex color code'
                    />

                    {/* Color Preview */}
                    {formData.buttonColor &&
                      formData.buttonColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) && (
                        <Box style={{ marginTop: '8px' }}>
                          <Box style={{ marginBottom: '4px' }}>
                            <Typography variant='body-2/normal' color='color/gray/600'>
                              Preview:
                            </Typography>
                          </Box>
                          <Flex align='center' gap='size/spacer/default'>
                            <Box
                              style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: formData.buttonColor,
                                borderRadius: '8px',
                                border: '1px solid var(--recursica-color-gray-300)'
                              }}
                            />
                            <Button
                              label='Sample Button'
                              variant='solid'
                              style={{ backgroundColor: formData.buttonColor }}
                              disabled
                            />
                          </Flex>
                        </Box>
                      )}
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type='submit'
                    label={isSubmitting ? 'Submitting...' : 'Submit'}
                    variant='solid'
                    loading={isSubmitting}
                    disabled={!isFormValid || isSubmitting}
                  />
                </Flex>
              </form>
            </Box>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <Box
                p='size/spacer/3x'
                bg='color/greensheen/50'
                br='size/border-radius/2x'
                style={{
                  marginTop: '24px',
                  border: '1px solid',
                  borderColor: 'var(--recursica-color-greensheen-200)',
                }}
              >
                <Box style={{ marginBottom: '8px' }}>
                  <Flex align='center' gap='size/spacer/default'>
                    <Typography variant='h4' as='h3' color='color/greensheen/700'>
                      ✅ Success!
                    </Typography>
                  </Flex>
                </Box>
                <Box style={{ marginBottom: '8px' }}>
                  <Typography color='color/greensheen/700'>
                    Your request has been submitted successfully.
                  </Typography>
                </Box>
                {prUrl && (
                  <Box>
                    <Button
                      label='View Issue on GitHub'
                      variant='outline'
                      onClick={() => window.open(prUrl, '_blank')}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <Box
                p='size/spacer/3x'
                bg='color/salmon/50'
                br='size/border-radius/2x'
                style={{
                  marginTop: '24px',
                  border: '1px solid var(--recursica-color-salmon-200)'
                }}
              >
                <Box style={{ marginBottom: '8px' }}>
                  <Flex align='center' gap='size/spacer/default'>
                    <Typography variant='h4' as='h3' color='color/salmon/700'>
                      ❌ Error
                    </Typography>
                  </Flex>
                </Box>
                <Box style={{ marginBottom: '8px' }}>
                  <Typography color='color/salmon/700'>
                    There was an error submitting your request. Please try again.
                  </Typography>
                </Box>
                {errorMessage && (
                  <Typography variant='body-2/normal' color='color/salmon/600'>
                    <strong>Error details:</strong> {errorMessage}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box p='size/spacer/3x' bg='layers/layer-0/properties/surface'>
          <Box style={{ textAlign: 'center' }}>
            <Typography color='color/gray/500' variant='body-2/normal'>
              Built with ❤️ using React, Vite & Recursica Design System
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
