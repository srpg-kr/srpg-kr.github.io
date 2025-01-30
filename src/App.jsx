import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';
import "./App.css";

function App() {
  const [csvData, setCsvData] = useState([]);
  const [title, setTitle] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [fullNameMap, setFullNameMap] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false); // Track loading state
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [allowLoad, setAllowLoad] = useState(false);

  // Fetch file list from JSON
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/jarari/anime-shooting-cn/refs/heads/main/Books/parsed_books.json')
    //fetch('./parsed_books.json')
      .then((res) => res.json())
      .then((data) => {
        setFileList(data)

        // Create a map where the key is `file.replace(".book.csv", "")`
        // and the value is the `fullName`
        const nameMap = data.reduce((map, item) => {
          // e.g. "A02001.book.csv" => "A02001"
          const key = item.file.replace('.book.csv', '');
          map[key] = item.fullName;
          return map;
        }, {});
  
        // Store that map in state, or wherever you need
        setFullNameMap(nameMap);
        setAllowLoad(true);
        if (window.location.hash){
          let code = window.location.hash.substring(1); // remove the "#"
          handleFileSelect(code + ".book.csv", nameMap[code])
        }
      })
      .catch((err) => console.error("Error loading file list:", err));
  }, []);

  const handleFileSelect = (fileUrl, title) => {
    setIsFirstLoad(false);
    setLoading(true); // Start loading
    const headers = ["화자", "대사"];
    setTitle(title)
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
        setCsvData(null);
        setLoading(false); // Stop loading on error
      }
    });
  };

  // Run on mount or whenever the hash changes
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash && allowLoad) {
        const code = window.location.hash.substring(1); // remove the "#"
        handleFileSelect(code + ".book.csv", fullNameMap[code])
      }
    }

    // Check current hash on mount
    onHashChange()

    // Listen for future hash changes
    window.addEventListener('hashchange', onHashChange)

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [allowLoad, fullNameMap])

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="App">
      <Sidebar
        fileList={fileList}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className={`content ${isSidebarOpen ? "shifted" : ""}`}>
          <DataTable csvTitle={title} csvData={csvData} isDarkMode={isDarkMode} loading={loading} isFirstLoad={isFirstLoad}/>
      </div>
    </div>
  );
}

export default App;
