import React, { useState, useEffect } from 'react';
import './RhizotronPage.css';
import {
  ComposedChart, Area, Line, ReferenceLine,
  XAxis, YAxis, Label, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';

const RhizotronPage = () => {
  const [imagesT1, setImagesT1] = useState([]);
  const [imagesT2, setImagesT2] = useState([]);
  const [imagesPh, setImagesPh] = useState([]);
  const [selectedSource, setSelectedSource] = useState('T1');  // Add this state
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [allData, setAllData] = useState([]);  // Data from CSV
  const [currentDataIndex] = useState(0);
  const imagesPerPage = 6;

  useEffect(() => {
    // Fetching Images
    fetch('/imageListT1.json')
      .then((response) => response.json())
      .then((data) => setImagesT1(data))
      .catch((error) => console.error('Error loading T1 images:', error));

    fetch('/imageListT2.json')
      .then((response) => response.json())
      .then((data) => setImagesT2(data))
      .catch((error) => console.error('Error loading T2 images:', error));

    fetch('/imageListPh.json')
      .then((response) => response.json())
      .then((data) => setImagesPh(data))
      .catch((error) => console.error('Error loading Ph images:', error));

    // Fetching CSV Data using PapaParse
    Papa.parse("/data/timeseries/data_daily.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      delimiter: ",",
      skipEmptyLines: true,
      complete: (data) => setAllData(data.data),
    });
  }, []);

  // Determine which images to display based on the selected sensor (T1 or T2)
  const rootImages = selectedSource === 'T1' ? imagesT1 : imagesT2;

  const currentRootImages = rootImages.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  const currentPhenoImages = imagesPh.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * imagesPerPage < rootImages.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const extractDateFromFilename = (filename) => {
    const baseName = filename.split('.')[0];
    const datePart = baseName.split('_').slice(1, 4).join('-');
    return datePart;
  };

  const fewerPhenoImagesClass = currentPhenoImages.length < imagesPerPage ? 'fewer-images' : '';
  const fewerRootImagesClass = currentRootImages.length < imagesPerPage ? 'fewer-images' : '';

  // Handle dropdown selection change
  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);  // Update the selected source
  };

  return (
    <div className="rhizotron-page-container">
      <a href="/data-visualization" className="back-arrow">
        &#x2190;
        <span className="back-text">Back to Data Visualization</span>
      </a>

      <h2 className="rhizotron-title">Rhizotron Data</h2>

      <div className="panel-container">
        <div className="rhizotron-bullet-points">
          <h3>Why is this important?</h3>
          <ul>
            <li>Helps monitor root growth over time and detect changes in soil moisture content.</li>
            <li>Provides insights into plants' belowground responses to environmental stresses for better soil management.</li>
            <li>Combines data from phenocam images and sensor readings to give a holistic view of soil, plant and atmosphere interactions.</li>
            <li>Assists in developing models to predict water and nutrient movement in soils.</li>
          </ul>
          <p>
            The images below are captured from two different sensors, T1 and T2, located in separate areas. 
            You can switch between the sensors using the dropdown to see data from each location.
          </p>
          {/* Add dropdown for T1/T2 selection */}
          <div className="t-inputbox">
            <label htmlFor="sensor-select">Sensor:</label>
            <select id="sensor-select" value={selectedSource} onChange={handleSourceChange}>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
            </select>
          </div>
        </div>

        <div className="rhizotron-chart">
          <h4 className="rhizotron-chart-title">Soil Water Content & Air Temperature</h4>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={allData} margin={{ top: 20, right: 30, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" angle={-30} textAnchor={"end"} />
              
              {/* Left Y-Axis for Soil Water Content */}
              <YAxis yAxisId="left" stroke="#007681">
                <Label style={{ textAnchor: "middle" }} value={"Soil Water Content [m3/m3]"} angle={270} dx={-25} />
              </YAxis>
              
              {/* Right Y-Axis for Air Temperature */}
              <YAxis yAxisId="right" orientation="right" stroke="#ff6347">
                <Label style={{ textAnchor: "middle" }} value={"Air Temperature [°C]"} angle={90} dx={25} />
              </YAxis>

              <Tooltip />
              
              {/* Area for Soil Water Content */}
              <Area yAxisId="left" dataKey="soilWaterContent" type="monotone" stroke="#00313C" fill="#007681" />
              
              {/* Area for Air Temperature */}
              <Line yAxisId="right" dataKey="airTemp" type="monotone" stroke="#ff6347" fill="rgba(255, 99, 71, 0.5)" dot={false} />
              
              <ReferenceLine x={allData[currentDataIndex]?.Date} stroke="black" yAxisId="left" /> 
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="carousel-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 0} className="carousel-arrow">
          &#8249;
        </button>
        <button onClick={handleNextPage} disabled={(currentPage + 1) * imagesPerPage >= rootImages.length} className="carousel-arrow">
          &#8250;
        </button>
      </div>

      <div className={`carousel-container ${isTransitioning ? 'slideIn' : ''}`}>
        <div className="phenocam-box">
          <div className={`phenocam-image-panel-container ${fewerPhenoImagesClass}`}>
            {currentPhenoImages.map((image, index) => (
              <div key={index} className="phenocam-image-container">
                <p className="phenocam-image-date">{extractDateFromFilename(image)}</p>
                <img src={`https://smartsoils-testbed.s3.amazonaws.com${image}`} alt={`Phenocam ${index}`} className="phenocam-image" />
              </div>
            ))}
          </div>
        </div>

        <div className="rhizotron-box">
          <div className={`rhizotron-image-panel-container ${fewerRootImagesClass}`}>
            {currentRootImages.map((image, index) => (
              <div key={index} className="rhizotron-image-container">
                <img src={`https://smartsoils-testbed.s3.amazonaws.com${image}`} alt={`Rhizotron ${selectedSource} ${index}`} className="rhizotron-image" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RhizotronPage;
