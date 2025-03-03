// src/components/ScreenshotModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/screenshotmodal.css';

function ScreenshotModal({ onClose, onSave }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [useAspect, setUseAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    // Get the canvas's client dimensions and compute aspect ratio.
    const canvas = document.querySelector('.l2d-canvas');
    if (canvas) {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      setAspectRatio(ch / cw);

      // Load saved values from localStorage or use canvas dimensions.
      const savedWidth = localStorage.getItem('screenshotWidth') || cw;
      const savedHeight = localStorage.getItem('screenshotHeight') || ch;
      setWidth(savedWidth);
      setHeight(savedHeight);

      const savedUseAspect = localStorage.getItem('useAspect');
      if (savedUseAspect !== null) {
        setUseAspect(savedUseAspect === 'true');
      } else {
        setUseAspect(true);
      }
    }
  }, []);

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    if (useAspect) {
      // Recalculate height using the aspect ratio.
      const newHeight = newWidth * aspectRatio;
      setHeight(Math.round(newHeight));
    }
  };

  const handleCheckboxChange = () => {
    const newUseAspect = !useAspect;
    setUseAspect(newUseAspect);
    localStorage.setItem('useAspect', newUseAspect);
  };

  const handleSave = () => {
    localStorage.setItem('screenshotWidth', width);
    localStorage.setItem('screenshotHeight', height);
    onSave(parseInt(width, 10), parseInt(height, 10));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Screenshot Settings</h2>
        <div className="modal-input-container">
          <label>Width:</label>
          <input
            type="number"
            value={width}
            onChange={handleWidthChange}
          />
        </div>
        <div className="modal-input-container">
          <label>Height:</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            disabled={useAspect}
          />
        </div>
        <div className="modal-input-container">
          <label>
            <input
              type="checkbox"
              checked={useAspect}
              onChange={handleCheckboxChange}
            />
            Use Canvas's Aspect Ratio
          </label>
          {!useAspect && (
            <p className="warning-text">
              Warning: The screenshot may look different or be clipped compared to the canvas.
            </p>
          )}
        </div>
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ScreenshotModal;
