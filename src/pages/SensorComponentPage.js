import React, { useState } from 'react';
import ThreeDSensorLayout from '../components/3DSensorLayout';
import ControlPanel from '../components/ControlPanel';
import './SensorComponentPage.css';

const SensorComponentPage = () => {
  const [viewMode, setViewMode] = useState('Static');  // Default to static view
  const [selectedComponent, setSelectedComponent] = useState(null);  // Store selected component

  const resetView = () => {
    console.log('Reset view triggered');
    setSelectedComponent(null);  // Reset to default image on reset
  };

  const handleComponentSelect = (component) => {
    if (component) {
      setSelectedComponent(component);  // Set the selected component
    } else {
      setSelectedComponent(null);  // Deselect component and show default image
    }
  };

  return (
    <div className="component-page">
      <a href="/data-visualization" className="back-arrow">
        &#x2190;
        <span className="back-text">Back to Data Visualization</span>
      </a>
      <div className="sensor-title">Sensor Component Layout</div>

      <div className="layout-container">
        {/* 3D/Static Image Viewer */}
        <ThreeDSensorLayout viewMode={viewMode} setViewMode={setViewMode} selectedComponent={selectedComponent} resetView={resetView} />

        {/* Control Panel */}
        <ControlPanel onComponentSelect={handleComponentSelect} />
      </div>
    </div>
  );
};

export default SensorComponentPage;
