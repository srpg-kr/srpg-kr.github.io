// src/components/ControlsPanel.jsx
import React, { useState, useEffect } from 'react';
import { LAppDelegate } from '../live2d/lappdelegate';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import '../styles/controlspanel.css';

function ControlsPanel({ refreshFlag }) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [bgColor, setBgColor] = useColor(localStorage.getItem("bgcolor") || "#ffffffff");
  const [expressions, setExpressions] = useState([]);
  const [motionGroups, setMotionGroups] = useState([]);
  const [motions, setMotions] = useState([]);
  const [selectedMotionGroup, setSelectedMotionGroup] = useState('');
  const [selectedMotion, setSelectedMotion] = useState('');
  const [parameters, setParameters] = useState([]);
  const [expParameters, setExpParameters] = useState([]);
  const [eyeBlink, setEyeBlink] = useState(true);
  const [angleX, setAngleX] = useState(0);
  const [angleY, setAngleY] = useState(0);
  const [angleZ, setAngleZ] = useState(0);
  const [bodyAngleX, setBodyAngleX] = useState(0);
  const [bodyAngleY, setBodyAngleY] = useState(0);
  const [bodyAngleZ, setBodyAngleZ] = useState(0);

  // This function synchronizes parameters with the current state of the model.
  // It updates both parameters and the baseline expression parameters.
  const syncParameters = () => {
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model && model.getParameters) {
      const params = model.getParameters();
      // Mark parameter as enabled if its current value differs from defaultValue.
      const synced = params.map((p) => ({
        ...p,
        value: p.value,
        enabled: p.value !== p.defaultValue,
      }));
      setParameters(synced);
    }
  };

  // This function stores the current parameters as the baseline for the expression.
  const storeExpParameters = () => {
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model && model.getParameters) {
      const params = model.getParameters();
      // Create a shallow copy of each parameter so we have a baseline reference.
      const baseline = params.map((p) => ({ ...p }));
      setExpParameters(baseline);
    }
  };

  const syncEyeBlink = (model) => {
    model.setEyeBlink(eyeBlink);
  }

  // This function refreshes the entire controls panel.
  const refreshControls = () => {
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    const intervalId = setInterval(() => {
        if (model && model._model && model._modelSetting) {
            // Update expressions.
            const availableExpressions = model.getAvailableExpressions();
            setExpressions(availableExpressions);

            // Update motion groups and motions.
            const groups = model.getAvailableMotionGroups();
            setMotionGroups(groups);
            const hasGroups = groups.length > 0;
            const resolvedGroup = groups.includes(selectedMotionGroup)
              ? selectedMotionGroup
              : (hasGroups ? groups[0] : '');
            setSelectedMotionGroup(resolvedGroup);
            const groupMotions = hasGroups
              ? model.getAvailableMotions(resolvedGroup)
              : [];
            setMotions(groupMotions);
            const resolvedMotion = groupMotions.includes(selectedMotion)
              ? selectedMotion
              : (groupMotions[0] || '');
            setSelectedMotion(resolvedMotion);

            // Update parameters and also store them as baseline.
            if (model.getParameters) {
                const params = model.getParameters();
                const synced = params.map((p) => ({
                ...p,
                enabled: p.value !== p.defaultValue,
                }));
                setParameters(synced);
                setExpParameters(synced.map((p) => ({ ...p })));
            }
            if (typeof model.getAngles === 'function') {
                const currentAngles = model.getAngles();
                setAngleX(currentAngles?.x ?? 0);
                setAngleY(currentAngles?.y ?? 0);
                setAngleZ(currentAngles?.z ?? 0);
            } else {
                setAngleX(model._dragX ?? 0);
                setAngleY(model._dragY ?? 0);
                setAngleZ(model._dragZ ?? 0);
            }
            if (typeof model.getBodyAngles === 'function') {
                const currentBodyAngles = model.getBodyAngles();
                setBodyAngleX(currentBodyAngles?.x ?? 0);
                setBodyAngleY(currentBodyAngles?.y ?? 0);
                setBodyAngleZ(currentBodyAngles?.z ?? 0);
            } else {
                setBodyAngleX(model._bodyAngleX ?? 0);
                setBodyAngleY(model._bodyAngleY ?? 0);
                setBodyAngleZ(model._bodyAngleZ ?? 0);
            }
            syncEyeBlink(model);
            clearInterval(intervalId);
        }
    }, 100);
  };

  useEffect(() => {
    refreshControls();
  }, [refreshFlag]);

  // Poll for the model until it is loaded, then refresh the controls.
  useEffect(() => {
    const intervalId = setInterval(() => {
      const model = LAppDelegate.getInstance()
        .getSubdelegate()
        .getLive2DManager()
        .getModel(0);
      if (model && model._model && model._modelSetting) {
        refreshControls();
        clearInterval(intervalId);
      }
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  // When an expression is selected, reset parameters and load the expression.
  // Then, after a short delay, synchronize and store the new baseline parameters.
  const handleExpressionChange = (e) => {
    const expression = e.target.value;
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model) {
      model.setExpression(expression);
      setTimeout(() => {
        syncParameters();
        storeExpParameters();
        syncEyeBlink(model);
      }, 50);
    }
  };

  // Motion group change handler: update motions for selected group.
  const handleMotionGroupChange = (e) => {
    const group = e.target.value;
    setSelectedMotionGroup(group);
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model) {
      const groupMotions = model.getAvailableMotions(group);
      setMotions(groupMotions);
      setSelectedMotion(groupMotions[0] || '');
    }
  };

  const onMotionFinished = (motion) => {
  }

  // Motion selection handler: store the currently chosen motion.
  const handleMotionChange = (e) => {
    const motionKey = e.target.value; // Expected format: "Group_Index"
    setSelectedMotion(motionKey);
  };

  const handleStartMotion = () => {
    if (!selectedMotion) return;
    const separator = selectedMotion.lastIndexOf('_');
    if (separator === -1) {
      return;
    }
    const group = selectedMotion.substring(0, separator);
    const index = parseInt(selectedMotion.substring(separator + 1), 10);
    if (Number.isNaN(index)) {
      return;
    }
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model) {
      model.startMotion(group, index, 3, onMotionFinished);
    }
  };

  const handleStopMotion = () => {
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model && typeof model.stopAllMotions === 'function') {
      model.stopAllMotions();
      if (typeof model.resetParameters === 'function') {
        model.resetParameters();
      }
    }
  };

  const handleAngleChange = (axis, value) => {
    const clamped = Math.max(-1, Math.min(1, value));
    if (Number.isNaN(clamped)) {
      return;
    }
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    const nextAngles = {
      x: axis === 'x' ? clamped : angleX,
      y: axis === 'y' ? clamped : angleY,
      z: axis === 'z' ? clamped : angleZ,
    };
    setAngleX(nextAngles.x);
    setAngleY(nextAngles.y);
    setAngleZ(nextAngles.z);
    if (model) {
      if (typeof model.setAngles === 'function') {
        model.setAngles(nextAngles.x, nextAngles.y, nextAngles.z);
      } else if (typeof model.setDrag === 'function') {
        model.setDrag(nextAngles.x, nextAngles.y, nextAngles.z);
      } else {
        model._dragX = nextAngles.x;
        model._dragY = nextAngles.y;
        model._dragZ = nextAngles.z;
      }
    }
  };

  const handleBodyAngleChange = (axis, value) => {
    const clamped = Math.max(-1, Math.min(1, value));
    if (Number.isNaN(clamped)) {
      return;
    }
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    const nextBodyAngles = {
      x: axis === 'x' ? clamped : bodyAngleX,
      y: axis === 'y' ? clamped : bodyAngleY,
      z: axis === 'z' ? clamped : bodyAngleZ,
    };
    setBodyAngleX(nextBodyAngles.x);
    setBodyAngleY(nextBodyAngles.y);
    setBodyAngleZ(nextBodyAngles.z);
    if (model) {
      if (typeof model.setBodyAngles === 'function') {
        model.setBodyAngles(
          nextBodyAngles.x,
          nextBodyAngles.y,
          nextBodyAngles.z
        );
      } else {
        model._bodyAngleX = nextBodyAngles.x;
        model._bodyAngleY = nextBodyAngles.y;
        model._bodyAngleZ = nextBodyAngles.z;
      }
    }
  };

  // Parameter slider change handler.
  // Here we update the parameter by applying the delta from the baseline (expParameters).
  const handleParameterChange = (index, newValue) => {
    setParameters((prevParams) => {
      const newParams = [...prevParams];
      newParams[index].value = newValue;
      return newParams;
    });
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model && parameters[index].enabled && expParameters[index]) {
      if (!parameters[index].isEye) {
        model.setCustomParameterValueById(parameters[index].id, newValue);
      }
      else {
        model.setCustomParameterValueById(parameters[index].id, newValue);
        model.setEyeForcedValue(parameters[index].id, newValue);
      }
    }
  };

  // Parameter enable/disable checkbox handler.
  const handleParameterCheckbox = (index) => {
    setParameters((prevParams) => {
      const newParams = [...prevParams];
      newParams[index].enabled = !newParams[index].enabled;
      return newParams;
    });
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model) {
      if (!parameters[index].isEye){
        // When disabling, revert to the baseline value.
        if (parameters[index].enabled) {
            model.setCustomParameterValueById(parameters[index].id, expParameters[index].value);
        } else {
            model.setCustomParameterValueById(parameters[index].id, parameters[index].value);
        }
      }
      else {
        if (parameters[index].enabled) {
            model.setCustomParameterValueById(parameters[index].id, expParameters[index].value);
            model.setEyeForcedValue(parameters[index].id, expParameters[index].value);
        } else {
            model.setCustomParameterValueById(parameters[index].id, parameters[index].value);
            model.setEyeForcedValue(parameters[index].id, parameters[index].value);
        }
      }
    }
  };

  const handleEyeblinkCheckbox = () => {
    setEyeBlink(!eyeBlink);
    const model = LAppDelegate.getInstance()
      .getSubdelegate()
      .getLive2DManager()
      .getModel(0);
    if (model) {
        model.setEyeBlink(!eyeBlink);
    }
  }

  const handleBGColorChange = (currentColor) => {
    localStorage.setItem("bgcolor", currentColor.hex)
    const subdelegate = LAppDelegate.getInstance()
      .getSubdelegate()
    if (subdelegate) {
      subdelegate.setClearColor(currentColor.rgb.r / 255.0, 
        currentColor.rgb.g / 255.0, 
        currentColor.rgb.b / 255.0, 
        currentColor.rgb.a);
    }
  }

  return (
    <div>
      <h2>Background</h2>
      <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>Change Color</button>
      { isColorPickerOpen && (
        <div>
          <div className="color-picker-overlay" onClick={() => setIsColorPickerOpen(false)}>
          </div>
          <div  className="color-picker-container">
            <ColorPicker color={bgColor} onChange={setBgColor} 
            onChangeComplete={handleBGColorChange}/>
          </div>
        </div>
      )}
      <h2>Expressions</h2>
      <select onChange={handleExpressionChange}>
      <option value="">-- Select Expression --</option>
        {expressions.map((expr, idx) => (
          <option key={`${expr}-${idx}`} value={expr}>
            {expr}
          </option>
        ))}
      </select>

      <h2>Motions</h2>
      <div>
        <label>Group:</label>
        <select value={selectedMotionGroup} onChange={handleMotionGroupChange}>
          {motionGroups.map((group, idx) => (
            <option key={`${group}-${idx}`} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Motion:</label>
        <select value={selectedMotion} onChange={handleMotionChange}>
          <option value="">-- Select Motion --</option>
          {motions.map((motion, idx) => (
            <option key={`${motion}-${idx}`} value={motion}>
              {motion}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleStartMotion} disabled={!selectedMotion}>
          Start Motion
        </button>
        <button onClick={handleStopMotion}>
          Stop Motion
        </button>
      </div>

      <h2>Angles</h2>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Angle</label>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Angle X:</label>
        <br />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={angleX}
            onChange={(e) => handleAngleChange('x', parseFloat(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ textAlign: 'right' }}>
            {angleX.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => handleAngleChange('x', 0)}
            style={{ flex: '0 0 auto', width: 'auto' }}
          >
            Reset
          </button>
        </div>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Angle Y:</label>
        <br />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={angleY}
            onChange={(e) => handleAngleChange('y', parseFloat(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ textAlign: 'right' }}>
            {angleY.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => handleAngleChange('y', 0)}
            style={{ flex: '0 0 auto', width: 'auto' }}
          >
            Reset
          </button>
        </div>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label>Angle Z:</label>
        <br />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={angleZ}
            onChange={(e) => handleAngleChange('z', parseFloat(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ textAlign: 'right' }}>
            {angleZ.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => handleAngleChange('z', 0)}
            style={{ flex: '0 0 auto', width: 'auto' }}
          >
            Reset
          </button>
        </div>
      </div>

      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Body Angle</label>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Body X:</label>
        <br />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={bodyAngleX}
            onChange={(e) => handleBodyAngleChange('x', parseFloat(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ textAlign: 'right' }}>
            {bodyAngleX.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => handleBodyAngleChange('x', 0)}
            style={{ flex: '0 0 auto', width: 'auto' }}
          >
            Reset
          </button>
        </div>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Body Y:</label>
        <br />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={bodyAngleY}
            onChange={(e) => handleBodyAngleChange('y', parseFloat(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ textAlign: 'right' }}>
            {bodyAngleY.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => handleBodyAngleChange('y', 0)}
            style={{ flex: '0 0 auto', width: 'auto' }}
          >
            Reset
          </button>
        </div>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label>Body Z:</label>
        <br />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={bodyAngleZ}
            onChange={(e) => handleBodyAngleChange('z', parseFloat(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ textAlign: 'right' }}>
            {bodyAngleZ.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => handleBodyAngleChange('z', 0)}
            style={{ flex: '0 0 auto', width: 'auto' }}
          >
            Reset
          </button>
        </div>
      </div>

      <h2>Eye Blink</h2>
        <input
            type="checkbox"
            checked={eyeBlink}
            onChange={() => handleEyeblinkCheckbox()}
        />
        Do Blinks

      <h2>Parameters</h2>
      {parameters.map((param, index) => (
        <div key={param.id.getString().s} style={{ marginBottom: '0.5rem' }}>
          <label>
            <input
              type="checkbox"
              checked={param.enabled}
              onChange={() => handleParameterCheckbox(index)}
            />
            {param.id.getString().s}
          </label>
          <br />
          <input
            type="range"
            min={param.min}
            max={param.max}
            step="0.01"
            value={param.value}
            disabled={!param.enabled}
            onChange={(e) =>
              handleParameterChange(index, parseFloat(e.target.value))
            }
          />
          <span>{param.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export default ControlsPanel;
