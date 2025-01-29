import React from 'react';
import "../styles/datatable.css";

function DataTable({ csvData, isDarkMode, loading }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>불러오는 중...</p>
      </div>
    );
  }

  if (!csvData || csvData.length === 0) return null;

  return (
    <table className={`data-table ${isDarkMode ? "dark-mode" : ""}`}>
      <thead>
        <tr>
          {Object.keys(csvData[0]).map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {csvData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.keys(row).map((col) => (
              <td key={col}>
                {transformText(row[col]) /* We'll implement transformText below */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Helper function to parse custom tags and transform them to HTML
function transformText(text) {
  if (!text) return '';

  // 1. Handle line breaks on '|'
  let html = text.split('|').join('<br/>');

  // 2. Replace <size=20> with a span style or something similar
  //    A simplistic approach: find <size=xx> and turn it into <span style="font-size:xxpx">
  //    Then match the closing tag if any, or revert to default styling
  //    For simplicity, let's do just one value
  html = html.replace(/<size=(\d+)>/g, (match, p1) => {
    return `<span style="font-size:${p1 / 2}px">`;
  });

  // 3. Replace <color=#123456> with <span style="color:#123456">
  html = html.replace(/<color=(#[0-9A-Fa-f]{6})>/g, (match, p1) => {
    return `<span style="color:${p1}">`;
  });

  // 4. Handle italic for <i> ... </i>
  //    We'll replace <i> with <em> and </i> with </em>
  html = html.replace(/<i>/g, '<em>');
  html = html.replace(/<\/i>/g, '</em>');

  // 5. If you need to close those <span> tags, you might have a custom marker, e.g. </size> or </color>.
  //    If your CSV includes those closing tags, handle them similarly:
  html = html.replace(/<\/size>/g, '</span>');
  html = html.replace(/<\/color>/g, '</span>');

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default DataTable;
