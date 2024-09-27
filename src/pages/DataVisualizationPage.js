// DataVisualizationPage.js
import React from 'react';
import VisualizationPanel from '../components/VisualizationPanel';
import './DataVisualization.css'; // Ensure this file contains the styles for the overview section

const DataVisualizationPage = () => {
  return (
    <div className="main-content">
      <div style={{ fontFamily: 'Karla, sans-serif' }}>
        {/* Sensor Component Panel Below the Overview */}
        <VisualizationPanel />
      </div>
    </div>
  );
};

export default DataVisualizationPage;
