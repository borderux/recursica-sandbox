import { useState } from 'react'
import './App.css'

interface FormData {
  changeDescription: string;
  changeType: 'content' | 'styling' | 'layout' | 'other';
  priority: 'low' | 'medium' | 'high';
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
    changeDescription: '',
    changeType: 'content',
    priority: 'medium'
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

    try {
      // Create the change data
      const changeData = {
        change: formData.changeDescription,
        type: formData.changeType,
        priority: formData.priority,
        timestamp: new Date().toISOString(),
        user: 'anonymous'
      };

      // Create the issue with JSON data embedded in the body
      const issueBody = `**Change Type:** ${formData.changeType}
**Priority:** ${formData.priority}
**Description:** ${formData.changeDescription}

## Change Request Data
\`\`\`json
${JSON.stringify(changeData, null, 2)}
\`\`\`

This issue was created automatically from the main application form. A pull request will be created automatically.`;

      const issueResp = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Change Request: ${formData.changeType} - ${formData.priority} priority`,
          body: issueBody,
          labels: ['change-request', formData.changeType, formData.priority]
        })
      });
      
      if (!issueResp.ok) {
        const errorText = await issueResp.text();
        throw new Error(`Failed to create issue: ${issueResp.status} ${errorText}`);
      }
      
      const issue = await issueResp.json();
      setPrUrl(issue.html_url);
      setSubmitStatus('success');
      setFormData({ changeDescription: '', changeType: 'content', priority: 'medium' });
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
        <p>Submit Change Requests</p>
      </header>
      
      <main className="app-main">
        <div className="form-container">
          <h2>Submit a Change Request</h2>
          <p className="form-description">
            Use this form to submit changes you'd like to see in the Storybook builds. 
            Your request will be created as a GitHub issue, and a pull request will be created automatically with a JSON file attached.
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
              <label htmlFor="changeType">Change Type:</label>
              <select
                id="changeType"
                value={formData.changeType}
                onChange={(e) => handleInputChange('changeType', e.target.value)}
                required
              >
                <option value="content">Content</option>
                <option value="styling">Styling</option>
                <option value="layout">Layout</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority:</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="changeDescription">Change Description:</label>
              <textarea
                id="changeDescription"
                value={formData.changeDescription}
                onChange={(e) => handleInputChange('changeDescription', e.target.value)}
                placeholder="Describe the change you'd like to see..."
                rows={5}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !formData.changeDescription.trim() || !GITHUB_TOKEN}
              className="submit-button"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Change Request'}
            </button>
          </form>

          {submitStatus === 'success' && (
            <div className="success-message">
              <h3>✅ Change Request Submitted!</h3>
              <p>Your change request has been created as a GitHub issue. A pull request will be created automatically.</p>
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
              <p>There was an error submitting your change request. Please try again.</p>
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
