import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';
import "./App.css";

function App() {
  const [csvData, setCsvData] = useState([]);
  const [title, setTitle] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch file list from JSON
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/jarari/anime-shooting-cn/refs/heads/main/Books/parsed_books.json')
      .then((res) => res.json())
      .then((data) => setFileList(data))
      .catch((err) => console.error("Error loading file list:", err));
  }, []);

  const handleFileSelect = (fileUrl) => {
    setLoading(true); // Start loading
    const headers = ["화자", "대사"];
    setTitle(fileUrl.replace(".book.csv", ""))
    Papa.parse("https://raw.githubusercontent.com/jarari/anime-shooting-cn/refs/heads/main/Books/Parsed/" + fileUrl, {
      download: true,
      header: false, // if your CSV has headers
      skipEmptyLines: true,
      complete: function (results) {
        const formattedData = results.data.map((row) => {
          return headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {});
        });

        setCsvData(formattedData);
        setLoading(false); // Stop loading when data is ready
      },
      error: function(err) {
        console.error('Error parsing CSV:', err);
        setLoading(false); // Stop loading on error
      }
    });
  };

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="App">
      <Sidebar
        onFileSelect={handleFileSelect}
        fileList={fileList}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className={`content ${isSidebarOpen ? "shifted" : ""}`}>
          <div className='csvTitle'>
            <br/>
            <h1>{title}</h1>
            <br/>
          </div>
          <DataTable csvData={csvData} isDarkMode={isDarkMode} loading={loading}/>
      </div>
    </div>
  );
}

export default App;
