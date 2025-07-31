import { useState } from 'react'
import './App.css'

interface FormData {
  changeDescription: string;
  changeType: 'content' | 'styling' | 'layout' | 'other';
  priority: 'low' | 'medium' | 'high';
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    changeDescription: '',
    changeType: 'content',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [issueUrl, setIssueUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create the JSON payload
      const payload = {
        change: formData.changeDescription,
        type: formData.changeType,
        priority: formData.priority,
        timestamp: new Date().toISOString(),
        user: 'anonymous' // Could be enhanced with user authentication
      };

      // Call the GitHub API to create an issue
      // Note: In a real implementation, you'd need to set up a backend service
      // or use GitHub's API with proper authentication
      const response = await fetch('/api/create-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setIssueUrl(result.issueUrl);
        setSubmitStatus('success');
        
        // Reset form
        setFormData({
          changeDescription: '',
          changeType: 'content',
          priority: 'medium'
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error submitting change request:', error);
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
            Your request will be created as a GitHub issue with a JSON file attachment.
          </p>

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
              disabled={isSubmitting || !formData.changeDescription.trim()}
              className="submit-button"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Change Request'}
            </button>
          </form>

          {submitStatus === 'success' && (
            <div className="success-message">
              <h3>✅ Change Request Submitted!</h3>
              <p>Your change request has been created as a GitHub issue.</p>
              {issueUrl && (
                <p>
                  <a href={issueUrl} target="_blank" rel="noopener noreferrer">
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
              <p className="error-details">
                Note: This feature requires a backend service to be set up. 
                For now, this is a demonstration of the UI.
              </p>
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
