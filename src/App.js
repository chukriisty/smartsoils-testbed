import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DataVisualizationPage from './pages/DataVisualizationPage';
import SciencePage from './pages/SciencePage';
import PhenocamPage from './pages/PhenocamPage';
import ERTPage from './pages/ERT';
import SensorComponentPage from './pages/SensorComponentPage';
import RhizotronPage from './pages/RhizotronPage';
import SensorTimeSeriesPage from './pages/SensorTimeSeriesPage';
import ETPage from './pages/ETPage';
import SoilCO2Page from './pages/SoilCO2Page';
import ParflowPage from './pages/ParflowPage';
import ContactPage from './pages/ContactPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content"> {/* Wrap all routes in a container */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/data-visualization" element={<DataVisualizationPage />} />
            <Route path="/data-visualization/phenocam" element={<PhenocamPage />} />
            <Route path="/data-visualization/ert" element={<ERTPage />} />
            <Route path="/data-visualization/sensor-layout" element={<SensorComponentPage />} />
            <Route path="/data-visualization/rhizotron" element={<RhizotronPage />} />
            <Route path="/data-visualization/sensor-time-series" element={<SensorTimeSeriesPage />} />
            <Route path="/science" element={<SciencePage />} />
            <Route path="/science/et" element={<ETPage />} />
            <Route path="/science/soil-co2" element={<SoilCO2Page />} />
            <Route path="/science/parflow" element={<ParflowPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
