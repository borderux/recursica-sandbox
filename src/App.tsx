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
      // 1. Create a new branch from main
      const branchName = `change-request-${Date.now()}`;
      console.log(`Creating branch: ${branchName} in ${REPO_OWNER}/${REPO_NAME}`);
      
      // Get the latest commit SHA from main
      const mainRefResp = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/main`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      if (!mainRefResp.ok) {
        const errorText = await mainRefResp.text();
        throw new Error(`Failed to get main branch ref: ${mainRefResp.status} ${errorText}`);
      }
      const mainRef = await mainRefResp.json();
      const mainSha = mainRef.object.sha;
      
      // Create the new branch
      const createRefResp = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: mainSha
        })
      });
      if (!createRefResp.ok) {
        const errorText = await createRefResp.text();
        throw new Error(`Failed to create branch: ${createRefResp.status} ${errorText}`);
      }

      // 2. Create the change file in the new branch
      const changeData = {
        change: formData.changeDescription,
        type: formData.changeType,
        priority: formData.priority,
        timestamp: new Date().toISOString(),
        user: 'anonymous'
      };
      const filePath = `change-requests/change-${branchName}.json`;
      const createFileResp = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Add change request: ${formData.changeType}`,
          content: btoa(JSON.stringify(changeData, null, 2)),
          branch: branchName
        })
      });
      if (!createFileResp.ok) {
        const errorText = await createFileResp.text();
        throw new Error(`Failed to create change file: ${createFileResp.status} ${errorText}`);
      }

      // 3. Create the PR
      const prResp = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Change Request: ${formData.changeType} - ${formData.priority} priority`,
          body: `**Change Type:** ${formData.changeType}\n**Priority:** ${formData.priority}\n**Description:** ${formData.changeDescription}\n\nThis PR was created automatically from the main application form.`,
          head: branchName,
          base: 'main',
        })
      });
      if (!prResp.ok) {
        const errorText = await prResp.text();
        throw new Error(`Failed to create PR: ${prResp.status} ${errorText}`);
      }
      const pr = await prResp.json();
      setPrUrl(pr.html_url);
      setSubmitStatus('success');
      setFormData({ changeDescription: '', changeType: 'content', priority: 'medium' });
    } catch (error) {
      console.error('Error creating PR:', error);
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
            Your request will be created as a GitHub pull request with a JSON file attached.
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
              <p>Your change request has been created as a GitHub pull request.</p>
              {prUrl && (
                <p>
                  <a href={prUrl} target="_blank" rel="noopener noreferrer">
                    View Pull Request on GitHub
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
