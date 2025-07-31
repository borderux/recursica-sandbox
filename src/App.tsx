import { useState } from 'react'
import './App.css'

interface FormData {
  name: string;
  email: string;
  buttonColor: string;
}

const REPO_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'borderux';
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO || 'recursica-sandbox';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Debug environment variables
console.log('Environment variables:', {
  REPO_OWNER,
  REPO_NAME,
  GITHUB_TOKEN: GITHUB_TOKEN ? '***SET***' : 'NOT SET'
});

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    buttonColor: ''
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

    // Check if required environment variables are set
    if (!GITHUB_TOKEN) {
      setErrorMessage('GitHub token is not configured. Please set VITE_GITHUB_TOKEN environment variable.');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(formData.buttonColor)) {
      setErrorMessage('Please enter a valid hex color (e.g., #FF0000 or #F00)');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the change data
      const changeData = {
        name: formData.name,
        email: formData.email,
        buttonColor: formData.buttonColor,
        timestamp: new Date().toISOString()
      };

      // Create the issue with JSON data embedded in the body
      const issueBody = `**Name:** ${formData.name}
**Email:** ${formData.email}
**New Button Color:** ${formData.buttonColor}

## Change Request Data
\`\`\`json
${JSON.stringify(changeData, null, 2)}
\`\`\`

This issue was created automatically from the main application form. A pull request will be created automatically.`;

      const issueResp = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Button Color Request: ${formData.buttonColor}`,
          body: issueBody,
          labels: ['button-color-request']
        })
      });
      
      if (!issueResp.ok) {
        const errorText = await issueResp.text();
        throw new Error(`Failed to create issue: ${issueResp.status} ${errorText}`);
      }
      
      const issue = await issueResp.json();
      setPrUrl(issue.html_url);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', buttonColor: '' });
    } catch (error) {
      console.error('Error creating issue:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Recursica Sandbox</h1>
        <p>Request Button Color Changes</p>
      </header>
      
      <main className="app-main">
        <div className="form-container">
          <h2>Request a New Button Color</h2>
          <p className="form-description">
            Submit a hex color value for the button. Your request will be created as a GitHub issue.
          </p>

          {!GITHUB_TOKEN && (
            <div className="error-message">
              <h3>⚠️ Configuration Required</h3>
              <p>GitHub token is not configured. Please set the VITE_GITHUB_TOKEN environment variable.</p>
              <p><strong>Repository:</strong> {REPO_OWNER}/{REPO_NAME}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="change-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="buttonColor">New Button Color:</label>
              <input
                type="text"
                id="buttonColor"
                value={formData.buttonColor}
                onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                placeholder="#FF0000"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                title="Please enter a valid hex color (e.g., #FF0000 or #F00)"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.buttonColor.trim() || !GITHUB_TOKEN}
              className="submit-button"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Color Request'}
            </button>
          </form>

          {submitStatus === 'success' && (
            <div className="success-message">
              <h3>✅ Color Request Submitted!</h3>
              <p>Your button color request has been created as a GitHub issue.</p>
              {prUrl && (
                <p>
                  <a href={prUrl} target="_blank" rel="noopener noreferrer">
                    View Issue on GitHub
                  </a>
                </p>
              )}
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="error-message">
              <h3>❌ Error Submitting Request</h3>
              <p>There was an error submitting your color request. Please try again.</p>
              {errorMessage && (
                <p className="error-details">
                  <strong>Error details:</strong> {errorMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Built with React + Vite</p>
      </footer>
    </div>
  )
}

export default App
