// This is an example serverless function that could be deployed to Vercel, Netlify, or similar
// It handles form submissions and creates GitHub issues

const { Octokit } = require('@octokit/rest');

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'your-org';
const GITHUB_REPO = process.env.GITHUB_REPO || 'recursica-sandbox';

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function createIssue(payload) {
  try {
    // Create issue title
    const title = `Change Request: ${payload.type} - ${payload.priority} priority`;
    
    // Create issue body
    const body = [
      'Change Request submitted via the main application.',
      '',
      `**Change Type:** ${payload.type}`,
      `**Priority:** ${payload.priority}`,
      `**Description:** ${payload.change}`,
      `**User:** ${payload.user}`,
      `**Timestamp:** ${payload.timestamp}`,
      '',
      'This issue was created automatically from the main application form.',
      '',
      '---',
      '',
      '## JSON Data',
      '```json',
      JSON.stringify(payload, null, 2),
      '```'
    ].join('\n');

    // Create the issue
    const issue = await octokit.issues.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: title,
      body: body,
      labels: ['change-request', payload.type, payload.priority]
    });

    // Create the JSON file in the repo
    const fileName = `change-requests/change-${issue.data.number}-${Date.now()}.json`;
    
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: fileName,
      message: `Add change request JSON for issue #${issue.data.number}`,
      content: Buffer.from(JSON.stringify(payload, null, 2)).toString('base64'),
      branch: 'main'
    });

    // Add a comment to the issue with the file link
    await octokit.issues.createComment({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: issue.data.number,
      body: `📎 Change request JSON file: [${fileName}](https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/main/${fileName})`
    });

    return {
      success: true,
      issueNumber: issue.data.number,
      issueUrl: issue.data.html_url,
      jsonFile: fileName
    };

  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}

// Export for serverless function
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const payload = req.body;

    // Validate required fields
    if (!payload.change || !payload.type || !payload.priority) {
      res.status(400).json({ 
        error: 'Missing required fields: change, type, priority' 
      });
      return;
    }

    // Validate change type
    const validTypes = ['content', 'styling', 'layout', 'other'];
    if (!validTypes.includes(payload.type)) {
      res.status(400).json({ 
        error: 'Invalid change type' 
      });
      return;
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(payload.priority)) {
      res.status(400).json({ 
        error: 'Invalid priority level' 
      });
      return;
    }

    // Add timestamp if not provided
    if (!payload.timestamp) {
      payload.timestamp = new Date().toISOString();
    }

    // Add user if not provided
    if (!payload.user) {
      payload.user = 'anonymous';
    }

    // Create the issue
    const result = await createIssue(payload);

    res.status(200).json({
      success: true,
      issueUrl: result.issueUrl,
      issueNumber: result.issueNumber,
      jsonFile: result.jsonFile
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}; 