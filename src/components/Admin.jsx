import React, { useState, useEffect } from 'react';
import { loginWithGitHub, handleGitHubRedirect, getGitHubToken, logout, getIssues, rejectSuggestion, acceptSuggestion, parseIssueBody, dispatchWorkflow } from '../services/github';

function Admin() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const handleAuth = async () => {
      const existingToken = getGitHubToken();
      if (existingToken) {
        setToken(existingToken);
      } else {
        const new_token = await handleGitHubRedirect();
        if (new_token) {
          setToken(new_token);
        }
      }
    };
    handleAuth();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchIssues = async () => {
        const issueData = await getIssues(token);
        setIssues(issueData);
        setLoading(false);
      };
      fetchIssues();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogin = () => {
    loginWithGitHub();
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setIssues([]);
  };

  const handleReject = async (issueNumber) => {
    const success = await rejectSuggestion(token, issueNumber);
    if (success) {
      setIssues(issues.filter((issue) => issue.number !== issueNumber));
    }
  };

  const handleAccept = async (issueNumber) => {
    const success = await acceptSuggestion(token, issueNumber);
    if (success) {
      setIssues(issues.filter((issue) => issue.number !== issueNumber));
      alert(`Suggestion #${issueNumber} accepted. The translation file will be updated shortly.`);
    }
  };

  const handleRunUpdateAction = async () => {
    if (!token) {
      alert('Please log in to GitHub to run this action.');
      return;
    }
    const workflowId = 'update-translations.yml'; // The ID of your workflow file
    const success = await dispatchWorkflow(token, workflowId);
    if (success) {
      alert('GitHub Action dispatched successfully! Check the Actions tab in your GitHub repository for progress.');
    } else {
      alert('Failed to dispatch GitHub Action. Please check console for errors.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Admin</h1>
      {token ? (
        <div>
          <p>Welcome, you are logged in.</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleRunUpdateAction} style={{ marginLeft: '1rem' }}>Run Update Action</button>
          <hr style={{ margin: '1rem 0' }} />
          <h2>Translation Suggestions</h2>
          {issues.length > 0 ? (
            issues.map((issue) => {
              const parsedBody = parseIssueBody(issue.body);
              return (
                <div key={issue.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                  <h3>{issue.title}</h3>
                  <p><strong>Original CN:</strong> {parsedBody.originalCn}</p>
                  <p><strong>Current KR:</strong> {parsedBody.currentKr}</p>
                  <p><strong>Suggested KR:</strong> {parsedBody.suggestedKr}</p>
                  <button onClick={() => handleAccept(issue.number)} style={{ marginRight: '0.5rem' }}>Accept</button>
                  <button onClick={() => handleReject(issue.number)}>Reject</button>
                </div>
              );
            })
          ) : (
            <p>No open translation suggestions found.</p>
          )}
        </div>
      ) : (
        <div>
          <p>Please log in with GitHub to manage translations.</p>
          <button onClick={handleLogin}>Login with GitHub</button>
        </div>
      )}
    </div>
  );
}

export default Admin;
