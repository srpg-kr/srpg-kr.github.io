import React, { useEffect, useState } from 'react';
import './Live2DApp.css';
import './styles/sidebar.css';
import Live2DViewer from './components/Live2DViewer';
import ControlsPanel from './components/ControlsPanel';
import { getAvailableModels } from './live2d/lappdefine';
import { LAppDelegate } from './live2d/lappdelegate';

function Live2DApp() {
    const [modelList, setModelList] = useState([]);
    const [refreshFlag, setRefreshFlag] = useState(false);

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
  
    return (
      <div className="app-container">
        {/* Left Panel: Models Sidebar */}
        <div className="l2d-panel">
          <div className="sidebar-content">
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
  
        {/* Main Area: Live2D Canvas */}
        <div className="main-canvas-container">
          <Live2DViewer />
        </div>
  
        {/* Right Panel: Controls */}
        <div className="l2d-panel right">
          <div className="sidebar-content">
            <ControlsPanel refreshFlag={refreshFlag} />
          </div>
        </div>
      </div>
    );
  }

export default Live2DApp;
