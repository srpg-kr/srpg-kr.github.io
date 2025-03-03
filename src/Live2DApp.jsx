import React, { useEffect, useState, useRef } from 'react';
import { FaPerson } from "react-icons/fa6";
import { VscSettings } from "react-icons/vsc";
import { FaWrench } from 'react-icons/fa';
import './Live2DApp.css';
import './styles/sidebar.css';
import Live2DViewer from './components/Live2DViewer';
import ControlsPanel from './components/ControlsPanel';
import ScreenshotModal from './components/ScreenshotModal';
import { getAvailableModels } from './live2d/lappdefine';
import { LAppDelegate } from './live2d/lappdelegate';

function Live2DApp() {
  const [modelList, setModelList] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);
  const [controlsOpacity, setControlsOpacity] = useState(1.0);
  const [isLPanelOpen, setIsLPanelOpen] = useState(false);
  const [isRPanelOpen, setIsRPanelOpen] = useState(false);
  const rightPanelRef = useRef(null);

  useEffect(() => {
    // Retrieve available models from LAppDefine and update state.
    const models = getAvailableModels();
    setModelList(models);
  }, []);

  // Handler to load a new model when a button is clicked.
  const handleModelSelect = (modelIndex) => {
    // Use LAppLive2DManager.changeScene or addModel.
    // Here, we assume that LAppDelegate.getInstance().getSubdelegate().getLive2DManager()
    // has a public method "addModel" that loads the model at a given index.
    const live2dManager = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager();
    if (live2dManager && live2dManager.addModel) {
      live2dManager.addModel(modelIndex);
      setRefreshFlag(prev => !prev);
    }
  };

  const handleOpacityChange = (newValue) => {
    setControlsOpacity(newValue);
    const rightPanel = rightPanelRef.current;
    rightPanel.style.opacity = newValue;
  };

  // Capture screenshot handler (existing implementation).
  const handleCaptureScreenshot = async () => {
    const canvas = document.querySelector('.l2d-canvas');
    if (!canvas) return;

    const originalWidth = canvas.style.width;
    const originalHeight = canvas.style.height;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    // Use dimensions from local storage or defaults
    const savedWidth = localStorage.getItem('screenshotWidth') || cw;
    let savedHeight = localStorage.getItem('screenshotHeight') || ch;
    if ((localStorage.getItem('useAspect') || 'true') === 'true') {
      savedHeight = Math.round(savedWidth * ch / cw);
    }
    canvas.style.setProperty('width', `${savedWidth / window.devicePixelRatio}px`, 'important');
    canvas.style.setProperty('height', `${savedHeight / window.devicePixelRatio}px`, 'important')

    const subdelegate = LAppDelegate.getInstance().getSubdelegate();
    const gl = subdelegate.reInitializeWebGL(true);
    if (!gl) return;
    subdelegate.onResize();

    const modelSetting = subdelegate.getLive2DManager().getModel(0)._modelSetting;
    const filename = modelSetting.getModelFileName().replace('.moc3', '.png');

    subdelegate.update();

    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });

    canvas.style.setProperty('width', originalWidth, 'important');
    canvas.style.setProperty('height', originalHeight, 'important');
    subdelegate.reInitializeWebGL(false);
    subdelegate.onResize();
  };

  return (
    <div className="app-container">
      {/* Left Panel: Models Sidebar */}
      <div className={`l2d-panel ${isLPanelOpen ? "open" : "closed"}`}>
        <button className="toggle-btn" onClick={() => setIsLPanelOpen(!isLPanelOpen)}>
          <FaPerson />
        </button>
        <div className="l2d-panel-control">
          <h2>Models</h2>
        </div>
        <div className="sidebar-content">
          <div className="category-list">
            {modelList.map((model, index) => (
              <button
                key={`${model}-${index}`}
                onClick={() => handleModelSelect(index)}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Area: Live2D Canvas */}
      <div className="main-canvas-container">
        <Live2DViewer />
        <div className="button-container">
          <button
            className="capture-screenshot-btn"
            onClick={handleCaptureScreenshot}
          >
            Capture Screenshot
          </button>
          <button
            className="screenshot-settings-btn"
            onClick={() => setIsScreenshotModalOpen(true)}
          >
            <FaWrench />
          </button>
        </div>
      </div>

      {/* Right Panel: Controls */}
      <div className={`l2d-panel right ${isRPanelOpen ? "open" : "closed"}`}  ref={rightPanelRef}>
        <button className="toggle-btn right" onClick={() => setIsRPanelOpen(!isRPanelOpen)}>
          <VscSettings />
        </button>
        <div className="sidebar-content">
          <ControlsPanel refreshFlag={refreshFlag} />
        </div>
        <div className="l2d-panel-opacity">
          <div>
            <label>Opacity</label>
            <span>{controlsOpacity}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.01"
            value={controlsOpacity}
            onChange={(e) =>
              handleOpacityChange(parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      {isScreenshotModalOpen && (
        <ScreenshotModal
          onClose={() => setIsScreenshotModalOpen(false)}
          onSave={(w, h) => {
            localStorage.setItem('screenshotWidth', w);
            localStorage.setItem('screenshotHeight', h);
          }}
        />
      )}

    </div>
  );
}

export default Live2DApp;
