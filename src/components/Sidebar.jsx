import React, { useState, useEffect, useRef } from "react";
import { FaSun, FaMoon, FaChevronDown, FaChevronRight } from "react-icons/fa";
import "../styles/sidebar.css";

function Sidebar({ categorizedFiles, toggleTheme, isDarkMode }) {
    const [isOpen, setIsOpen] = useState(true); // Sidebar starts open
    const sidebarRef = useRef(null);

    // Click outside handler
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event) => {
        // Check if click is outside sidebar AND not on navigation controls
        if (
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          !event.target.closest('.nav-controls') // Add this line
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

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
      <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
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
                let selected = false;
                if (window.location.hash && window.location.hash.substring(1) == fileObj.file){
                  selected = true;
                }
                return (
                  <button className={`${selected ? "selected" : ""}`} key={fileObj.file} onClick={() => {
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
