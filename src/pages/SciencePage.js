import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SciencePage.css'; 

const components = [
  {
    id: 1,
    name: 'Evapotranspiration',
    image: '/assets/et.jpg',
    description: 'Explore how data from the Testbed is used to improve ET model using a machine learning approach.',
    link: '/science/et',
    buttonLabel: 'Go to ET'
  },
  {
    id: 2,
    name: 'Soil Carbon Flux',
    image: 'https://smartsoils-testbed.s3.amazonaws.com/assets/sensor-layout.png',
    description: 'Add Soil CO2 description.',
    link: '/science/soil-co2',
    buttonLabel: 'Go to Soil CO2'
  },
  {
    id: 3,
    name: 'Parflow',
    image: 'https://smartsoils-testbed.s3.amazonaws.com/assets/sensor-layout.png',
    description: 'Add Parflow description.',
    link: '/science/parflow',
    buttonLabel: 'Go to Parflow',
  },
];

const SciencePage = () => {
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
        <h1 className="data-title">Science Topics</h1>
        <p className="intro-text">
          Explore how data from SMARTSoils Testbed examines, benchmarks, and drives the development of machine-learning-based, process-based and ecocsystem models.
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
    </div>
  );
};

export default SciencePage;