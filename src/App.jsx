import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';
import NavigationControls from './components/NavigationControls';
import { CATEGORIES, DEFAULT_CATEGORY, categorizeFiles } from './components/categories';
import "./App.css";

function App() {
  const [csvData, setCsvData] = useState([]);
  const [title, setTitle] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [categorizedFiles, setCategorizedFiles] = useState({});
  const [flatNavList, setFlatNavList] = useState([]);
  const [fullNameMap, setFullNameMap] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [allowLoad, setAllowLoad] = useState(false);

  // Fetch file list from JSON
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/jarari/anime-shooting-cn/refs/heads/main/Books/parsed_books.json')
    //fetch('./parsed_books.json')
      .then((res) => res.json())
      .then((data) => {
        const files = data.reduce((arr, item) => {
          for (let i = item.numMin; i <= item.numMax; ++i) {
            arr.push({
              "shortName": `${item.shortName} - ${i}`,
              "fullName": `${item.fullName} - ${i}`,
              "file": item.file + i.toString().padStart(item.numDigits, "0")
            });
          }
          return arr;
        }, []); // Initialize with an empty array

        setFileList(files)

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

  // Categorize files and create navigation list whenever fileList changes
  useEffect(() => {
    const categorized = categorizeFiles(fileList);
    setCategorizedFiles(categorized);
    
    // Create flat navigation list respecting category order
    const orderedList = [];
    CATEGORIES.forEach(([_, categoryName]) => {
      if (categorized[categoryName]) {
        orderedList.push(...categorized[categoryName]);
      }
    });
    orderedList.push(...categorized[DEFAULT_CATEGORY]);
    setFlatNavList(orderedList);
  }, [fileList]);

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
        categorizedFiles={categorizedFiles}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className={`content`}>
          <DataTable 
            csvTitle={title} 
            csvData={csvData} 
            isDarkMode={isDarkMode} 
            loading={loading} 
            isFirstLoad={isFirstLoad}/>
      </div>
      <NavigationControls 
        fileList={flatNavList}
        isDarkMode={isDarkMode}
        isFirstLoad={isFirstLoad}
      />
    </div>
  );
}

export default App;
