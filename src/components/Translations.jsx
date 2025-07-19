import React, { useState, useEffect } from 'react';
import { createSuggestionIssue, getGitHubToken, loginWithGitHub, logout } from '../services/github';

function Translations() {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTranslations, setFilteredTranslations] = useState([]);
  const [githubToken, setGithubToken] = useState(null);

  const ENTRIES_PER_PAGE = 1000;

  useEffect(() => {
    const checkToken = async () => {
      const existingToken = getGitHubToken();
      if (existingToken) {
        setGithubToken(existingToken);
      } else {
        // Check if there's a token in the URL hash after GitHub redirect
        const hash = window.location.hash.substring(1);
        if (hash) {
          const params = new URLSearchParams(hash);
          const token = params.get('token');
          if (token) {
            localStorage.setItem('github_token', token);
            setGithubToken(token);
            // Clean the URL hash after getting the token
            window.history.replaceState("", document.title, window.location.pathname + window.location.search);
          }
        }
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    const allTranslations = Object.entries(translations);
    const filtered = allTranslations.filter(([cn, kr]) => 
      cn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      kr.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTranslations(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchQuery, translations]);

  const totalPages = Math.ceil(filteredTranslations.length / ENTRIES_PER_PAGE);

  const goToPage = (page) => {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  useEffect(() => {
    fetch('/translation_data.json')
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading translation data:", err);
        setLoading(false);
      });
  }, []);

  const handleSuggestChange = async (cnText, krText) => {
    const token = getGitHubToken();
    if (!token) {
      alert('Please log in to GitHub to suggest changes.');
      return;
    }

    const suggestedText = prompt('Enter your suggested Korean translation:', krText);
    if (suggestedText === null || suggestedText.trim() === '') {
      alert('Suggestion cancelled or empty.');
      return;
    }

    try {
      const result = await createSuggestionIssue(token, cnText, krText, suggestedText);
      if (result) {
        alert('Suggestion submitted successfully!');
      } else {
        alert('Failed to submit suggestion. Please check console for errors.');
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert('Failed to submit suggestion. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Translations</h1>

      {/* GitHub Login/Logout */}
      <div style={{ marginBottom: '1rem' }}>
        {githubToken ? (
          <button onClick={() => { logout(); setGithubToken(null); }}>Logout from GitHub</button>
        ) : (
          <button onClick={() => loginWithGitHub('/translations')}>Login with GitHub</button>
        )}
      </div>
      
      {/* Search Input */}
      <div>
        <input 
          type="text" 
          placeholder="Search..." 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ marginBottom: '1rem' }}
        />
      </div>

      <p>Found {filteredTranslations.length} entries.</p>

      {/* Pagination Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={goToFirstPage} disabled={currentPage === 1}>First</button>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>Last</button>
        <input 
          type="number" 
          min="1" 
          max={totalPages} 
          defaultValue={currentPage} 
          onBlur={(e) => goToPage(e.target.value)} 
          style={{ width: '50px', marginLeft: '1rem' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Chinese (Original)</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Korean (Translated)</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTranslations.slice((currentPage - 1) * ENTRIES_PER_PAGE, currentPage * ENTRIES_PER_PAGE).map(([cn, kr]) => (
            <tr key={cn}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{cn}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{kr}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button onClick={() => handleSuggestChange(cn, kr)}>
                  Suggest Change
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Translations;