import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './VisualizationPanel.css'; 

const components = [
  {
    id: 1,
    name: 'Sensor Layout',
    image: 'https://smartsoils-testbed.s3.amazonaws.com/assets/sensor-layout.png',
    description: 'View the arrangement of sensors in the testbed and their descriptions and positions in relation to the soil volume.',
    link: '/data-visualization/sensor-layout',
  },
  {
    id: 2,
    name: 'Sensor Time-Series',
    image: 'https://smartsoils-testbed.s3.amazonaws.com/assets/time-series-cover2.png',
    description: 'Explore daily and hourly meteorological, hydrological, and soil carbox flux measurements. Use this tool to visualize seasonal and diurnal trends.',
    link: '/data-visualization/sensor-time-series',
  },
  {
    id: 3,
    name: 'Electrical Resistivity Tomography (ERT)',
    image: 'https://smartsoils-testbed.s3.amazonaws.com/data/ert/ert_demo.png',
    description: 'Visualize subsurface properties using electrical resistivity tomography (ERT). Detect spatiotemporal changes in root-zone soil hydraulic properties.',
    link: '/data-visualization/ert',
    buttonLabel: 'Go to ERT', // Corrected this label to 'Go to ERT'
  },
];

const components2 = [
  {
    id: 4,
    name: 'Phenocam Timelapse',
    image: 'https://smartsoils-testbed.s3.amazonaws.com/data/phenocam/camera_2023_06_02_13_31.jpg',
    description: 'Watch plant growth and scenesce through time-lapse imagery from the phenocam. Analyze above-ground vegetation cover throughout the years.',
    link: '/data-visualization/phenocam',
  },
  {
    id: 5,
    name: 'Rhizotron Scans',
    image: 'https://smartsoils-testbed.s3.amazonaws.com/data/rootscan/root-demo.jpg',
    description: 'Track root growth and its correlation with above-ground vegetation development.',
    link: '/data-visualization/rhizotron',
  },
];

const VisualizationPanel = () => {
  const sensorCardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const currentRefs = [...sensorCardsRef.current];

    currentRefs.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      currentRefs.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, []);

  return (
    <div>
      {/* Condensed Intro section */}
      <div className="intro-section">
        <h1 className="data-title">Interactive Data Visualization</h1>
        <p className="intro-text">
          Explore the data stream from above and below-ground meteorological, phenological, hydrological, and geophysical sensing components.
          Click a panel to dive deeper into the data.
        </p>
      </div>

      {/* First row sensor cards - fade in on page load */}
      <div className="unique-sensor-panel fade-in-visible">
        <div className="unique-sensor-group">
          {components.map((component) => (
            <div className="unique-sensor-card" key={component.id}>
              <div className="unique-sensor-image-container">
                <img src={component.image} alt={component.name} className="unique-sensor-image" />
                <div className="unique-sensor-overlay"></div>
                <h3 className="unique-sensor-title">{component.name}</h3>
              </div>
              <div className="unique-sensor-text-overlay">
                <p className="unique-sensor-description">{component.description}</p>
                <Link to={component.link} className="unique-sensor-explore-button">
                  {component.buttonLabel ? component.buttonLabel : `Go to ${component.name}`} 
                  {/* Correctly applying the label here */}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second row sensor cards - fade in on scroll */}
      <div className="unique-sensor-panel">
        <div className="unique-sensor-group fade-in" ref={(el) => (sensorCardsRef.current[0] = el)}>
          {components2.map((component, index) => (
            <div className="unique-sensor-card" key={component.id}>
              <div className="unique-sensor-image-container">
                <img src={component.image} alt={component.name} className="unique-sensor-image" />
                <div className="unique-sensor-overlay"></div>
                <h3 className="unique-sensor-title">{component.name}</h3>
              </div>
              <div className="unique-sensor-text-overlay">
                <p className="unique-sensor-description">{component.description}</p>
                <Link to={component.link} className="unique-sensor-explore-button">
                  {component.buttonLabel ? component.buttonLabel : `Go to ${component.name}`}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualizationPanel;
