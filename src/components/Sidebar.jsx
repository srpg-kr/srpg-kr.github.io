import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaChevronDown, FaChevronRight } from "react-icons/fa";
import "../styles/sidebar.css";

const CATEGORIES = [
  ["M", "메인 스토리"],
  ["A", "이벤트"],
  ["F", "일지"],
  ["P", "엘모 서버룸"],
  ["T", "호감도"],
  ["CN_A", "중국판"],
  ["CN_M", "중국판"],
];
const DEFAULT_CATEGORY = "기타";

function categorizeFiles(files) {
    let categorized = {};

    // Initialize categories
    CATEGORIES.forEach(([_, categoryName]) => (categorized[categoryName] = []));
    categorized[DEFAULT_CATEGORY] = [];

    files.forEach((file) => {
        let matched = false;
        
        for (let [prefix, category] of CATEGORIES) {
          if (file.file.startsWith(prefix) && /\d/.test(file.file[prefix.length])) {
              categorized[category].push(file);
              matched = true;
              break;
          }
        }
        
        if (!matched) {
        categorized[DEFAULT_CATEGORY].push(file);
        }
    });

    return categorized;
}

function Sidebar({ fileList, toggleTheme, isDarkMode }) {
    const [isOpen, setIsOpen] = useState(true); // Sidebar starts open

    // Categorize files on load
    const categorizedFiles = categorizeFiles(fileList);

    // Track which categories are expanded
    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(categorizedFiles).reduce((acc, key) => {
        acc[key] = false; // Default all categories to close
        return acc;
        }, {})
    );

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({
        ...prev,
        [category]: !prev[category],
        }));
    };
  
    return (
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Hamburger Button */}
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
  
        {/* Sidebar Header with Theme Toggle */}
        <div className="sidebar-header">
          <h2>스토리 리스트</h2>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
  
      {/* Scrollable Sidebar Content */}
      <div className="sidebar-content">
        {Object.entries(categorizedFiles).map(([category, files]) => (
          <div key={category} className="category-section">
            {/* Collapsible Category Header */}
            <button className="category-toggle" onClick={() => toggleCategory(category)}>
              {expandedCategories[category] ? <FaChevronDown /> : <FaChevronRight />}
              {category}
            </button>

            {/* Expand/Collapse Content */}
            <div className={`category-list ${expandedCategories[category] ? "expanded" : "collapsed"}`}>
              {files.map((fileObj) => {
                return (
                  <button key={fileObj.file} onClick={() => {
                    window.location.hash = fileObj.file;
                    setIsOpen(false);
                  }}>
                    {fileObj.shortName}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  }
  
  export default Sidebar;
