// src/components/ControlsPanel.jsx
import React, { useState, useEffect } from 'react';
import { LAppDelegate } from '../live2d/lappdelegate';
import { LAppModel } from '../live2d/lappmodel';

function ControlsPanel({ refreshFlag }) {
  const [expressions, setExpressions] = useState([]);
  const [motionGroups, setMotionGroups] = useState([]);
  const [motions, setMotions] = useState([]);
  const [selectedMotionGroup, setSelectedMotionGroup] = useState('');
  const [parameters, setParameters] = useState([]);
  const [expParameters, setExpParameters] = useState([]);
  const [eyeBlink, setEyeBlink] = useState(true);

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
            if (groups.length > 0) {
                setSelectedMotionGroup(groups[0]);
                const groupMotions = model.getAvailableMotions(groups[0]);
                setMotions(groupMotions);
            }

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
    }
  };

  // Motion selection handler: start the chosen motion.
  const handleMotionChange = (e) => {
    const motionKey = e.target.value; // Expected format: "Group_Index"
    const parts = motionKey.split('_');
    if (parts.length === 2) {
      const group = parts[0];
      const index = parseInt(parts[1], 10);
      const model = LAppDelegate.getInstance()
        .getSubdelegate()
        .getLive2DManager()
        .getModel(0);
      if (model) {
        // Example: priority 2.
        model.startMotion(group, index, 2);
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

  return (
    <div>
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
        <select onChange={handleMotionChange}>
          {motions.map((motion, idx) => (
            <option key={`${motion}-${idx}`} value={motion}>
              {motion}
            </option>
          ))}
        </select>
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
