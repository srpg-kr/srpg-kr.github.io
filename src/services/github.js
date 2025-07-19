import { Octokit } from 'octokit';

export function loginWithGitHub() {
  const currentPath = window.location.pathname;
  window.location.replace(`https://jolly-capybara-ff83c3.netlify.app/.netlify/functions/auth?redirect_to=${encodeURIComponent(currentPath)}`);
}

export async function handleGitHubRedirect() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const params = new URLSearchParams(hash);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('github_token', token);
      window.history.replaceState("", document.title, window.location.pathname + window.location.search);
      return token;
    }
  }
  return null;
}

export function getGitHubToken() {
  return localStorage.getItem('github_token');
}

export function logout() {
  localStorage.removeItem('github_token');
}

export async function getIssues(token) {
  const octokit = new Octokit({ auth: token });
  const owner = 'srpg-kr';
  const repo = 'srpg-kr.github.io';

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      state: 'open',
    });
    // Filter issues by title prefix and exclude those with the 'accepted' label
    return response.data.filter(issue => 
      issue.title.startsWith('[Translation Suggestion]') && 
      !issue.labels.some(label => label.name === 'accepted')
    );
  } catch (error) {
    console.error('Error fetching issues:', error);
    if (error.status === 401) {
      console.error('Authentication failed. Please ensure your GitHub token is valid and has the correct permissions (repo scope).');
    }
    return [];
  }
}

export async function rejectSuggestion(token, issueNumber) {
  const octokit = new Octokit({ auth: token });
  const owner = 'srpg-kr';
  const repo = 'srpg-kr.github.io';

  try {
    await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
    });
    return true;
  } catch (error) {
    console.error(`Error closing issue #${issueNumber}:`, error);
    return false;
  }
}

export async function acceptSuggestion(token, issueNumber) {
  const octokit = new Octokit({ auth: token });
  const owner = 'srpg-kr';
  const repo = 'srpg-kr.github.io';

  try {
    // Add the 'accepted' label to the issue
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
      owner,
      repo,
      issue_number: issueNumber,
      labels: ['accepted'],
    });

    // Optionally, remove the 'translation-suggestion' label if it exists
    // This is not strictly necessary as the action will filter by 'accepted'
    // and then change to 'patched', but it keeps the issue labels cleaner.
    // await octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}', {
    //   owner,
    //   repo,
    //   issue_number: issueNumber,
    //   name: 'translation-suggestion',
    // });

    // Keep the issue open for the action to process
    return true;
  } catch (error) {
    console.error(`Error accepting issue #${issueNumber}:`, error);
    return false;
  }
}

export async function createSuggestionIssue(token, cnText, krText, suggestedText) {
  const octokit = new Octokit({ auth: token });
  const owner = 'srpg-kr';
  const repo = 'srpg-kr.github.io';

  const title = `[Translation Suggestion] ${cnText}`;
  const body = `
**Original Text (CN):**
\`\`\`
${cnText}
\`\`\`

**Current Translation (KR):**
\`\`\`
${krText}
\`\`\`

**Suggested Translation (KR):**
\`\`\`
${suggestedText}
\`\`\`
  `;

  try {
    const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      title: title,
      body: body,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating suggestion issue:', error);
    return null;
  }
}

export function parseIssueBody(body) {
  const originalCnMatch = body.match(/\*\*Original Text \(CN\):\*\*\n```\n([\s\S]*?)\n```/);
  const currentKrMatch = body.match(/\*\*Current Translation \(KR\):\*\*\n```\n([\s\S]*?)\n```/);
  const suggestedKrMatch = body.match(/\*\*Suggested Translation \(KR\):\*\*\n```\n([\s\S]*?)\n```/);

  return {
    originalCn: originalCnMatch ? originalCnMatch[1].trim() : '',
    currentKr: currentKrMatch ? currentKrMatch[1].trim() : '',
    suggestedKr: suggestedKrMatch ? suggestedKrMatch[1].trim() : '',
  };
}

export async function dispatchWorkflow(token, workflowId, ref = 'main') {
  const octokit = new Octokit({ auth: token });
  const owner = 'srpg-kr';
  const repo = 'srpg-kr.github.io';

  try {
    await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
      owner,
      repo,
      workflow_id: workflowId,
      ref: ref,
      inputs: {},
    });
    return true;
  } catch (error) {
    console.error('Error dispatching workflow:', error);
    return false;
  }
}

export async function checkAdminPermissions(token) {
  const octokit = new Octokit({ auth: token });
  const owner = 'srpg-kr';
  const repo = 'srpg-kr.github.io';

  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/collaborators/{username}/permission', {
      owner,
      repo,
      username: (await octokit.rest.users.getAuthenticated()).data.login,
    });
    return data.permission === 'admin';
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    return false;
  }
}
