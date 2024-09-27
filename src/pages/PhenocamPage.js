import React, { useEffect, useState } from 'react';
import {
  ComposedChart, Area, ReferenceLine,
  XAxis, YAxis, Label, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';
import './PhenocamPage.css';
import moment from 'moment';

const PhenocamPage = () => {
  const [images, setImages] = useState([]);
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [play, setPlay] = useState(true);

  // Fetch images from JSON file in the public folder
  useEffect(() => {
    fetch('/imageList.json')  
      .then((response) => response.json())
      .then((data) => {
        setImages(data);  
        preloadImages(data);  // Preload images when data is loaded
        if (data.length > 0) {
          setCurrentIndex(0); 
        }
      })
      .catch((error) => console.error('Error loading image list:', error));
  }, []);

  // Preload images for faster transitions
  const preloadImages = (imagePaths) => {
    const preloaded = imagePaths.map((path) => {
      const img = new Image();
      img.src = `https://smartsoils-testbed.s3.amazonaws.com${path}`;
      return img;
    });
    setPreloadedImages(preloaded);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (play && images.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 150); // Adjust this timing to balance speed and performance

    return () => clearInterval(interval);
  }, [play, images]);

  const togglePlay = () => setPlay(!play);

  const handleSliderChange = (event) => {
    setPlay(false);
    setCurrentIndex(Number(event.target.value));
  };

  const currentImagePath = images[currentIndex];
  const currentFilename = currentImagePath ? currentImagePath.split('/').pop() : '';

  const dateParts = currentFilename.match(/\d{4}_\d{2}_\d{2}_\d{2}_\d{2}/);
  const dateString = dateParts ? dateParts[0].split('_').slice(0, 2).join('_') : '';

  const currentDate = dateString ? moment(dateString, 'YYYY_MM').format('MMMM YYYY') : '';

  // Read greenness data
  const [allData, setAllData] = useState([]);

  Papa.parse("/data/timeseries/data_daily.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    delimeter: ",",
    skipEmptyLines: true,
    complete: (data) => setAllData(data.data)
  });

  const timeString = dateParts ? dateParts[0].split('_').slice(0, 3).join('_') : '';
  const currentTime = timeString ? moment(timeString, 'YYYY_MM_DD').format('YYYY-MM-DD') : '';

  return (
    <div className="phenocam-page">
      <a href="/data-visualization" className="back-arrow">
        &#x2190;  
        <span className="back-text">Back to Data Visualization</span>
      </a>
      <div className="description-box">
        <h2>Phenocam Timelapse</h2>
        <hr className="custom-line" />
        <h6>
          Visualize changes in above-ground phenology over time.<br /><br />
          The time-lapse shows images captured throughout different months and years to highlight seasonal variations of the vegetative status and growth-senescence transitions.<br /><br />
          These images are used to estimate the areal fraction of green vegetation by manipulating the received RGB band values.<br /><br />
        </h6>
        <button className="play-pause-button" onClick={togglePlay}>
          {play ? 'Pause' : 'Play'}
        </button>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" angle={-30} textAnchor={"end"} />
            <YAxis>
              <Label style={{textAnchor: "middle"}}
                     value={"Fraction of Green Vegetation [m2/m2]"}
                     angle={270}
                     dx={-25} />
            </YAxis>
            <Tooltip />
            <Area data={allData} dataKey="green" type="monotone" stroke="#74AA50" fill="#AC9F3C" />
            <ReferenceLine x={currentTime} stroke="black" />
          </ComposedChart>
        </ResponsiveContainer>

      </div>
      <div className="timelapse-container">
        <img src="https://smartsoils-testbed.s3.amazonaws.com/assets/smartsoils-logo.png" alt="Logo" className="logo-image" />
        <div className="image-container">
          {preloadedImages.length > 0 && (
            <img
              src={preloadedImages[currentIndex].src}
              alt={`Phenocam ${currentIndex}`}
              onError={(e) => {
                console.error(`Error loading image at index ${currentIndex}`, e);
                e.target.style.display = 'none';
              }}
            />
          )}
          {currentDate && (
            <div className="now-viewing animate-now-viewing">
              {`Now viewing: ${currentDate}`}
            </div>
          )}
        </div>
        <input
          type="range"
          min="0"
          max={images.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="timeline-slider"
        />
      </div>
    </div>
  );
};

export default PhenocamPage;
