import { FaArrowAltCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import '../styles/navigationcontrols.css';

// Add this component inside your App component
function NavigationControls({ fileList, isDarkMode, isFirstLoad, isSidebarOpen }) {
  // Get current file hash
  const currentHash = window.location.hash.replace('#', '');
  
  // Find current file index
  const currentIndex = fileList.findIndex(file => file.file === currentHash);
  
  // Calculate previous/next availability
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < fileList.length - 1;

  const handleNavigate = (offset) => {
    const newIndex = currentIndex + offset;
    if (newIndex >= 0 && newIndex < fileList.length) {
      window.location.hash = fileList[newIndex].file;
    }
  };

  return (
    <>
      <div className={`nav-controls left ${isDarkMode ? 'dark-mode' : ''}`}>
        <button 
          onClick={() => handleNavigate(-1)}
          disabled={isFirstLoad || !hasPrevious}
        >
          <FaArrowCircleLeft />
        </button>
      </div>
      
      <div className={`nav-controls right ${isDarkMode ? 'dark-mode' : ''}`}>
        <button
          onClick={() => handleNavigate(1)}
          disabled={isFirstLoad || !hasNext}
        >
          <FaArrowAltCircleRight />
        </button>
      </div>
    </>
  );
}

export default NavigationControls;