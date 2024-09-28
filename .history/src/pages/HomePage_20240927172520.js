import React, { useEffect, useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisionVisible, setIsVisionVisible] = useState(false);
  const [isWhatIsVisible, setIsWhatIsVisible] = useState(false);
  const [isWhyVisible, setIsWhyVisible] = useState(false);
  const [isDataVisible, setIsDataVisible] = useState(false); // New state for data visualization section

  // Amazon S3 URL prefix
  const s3Prefix = 'https://smartsoils-testbed.s3.amazonaws.com';

  // Fetch images from JSON file and prepend S3 URL
  useEffect(() => {
    fetch('/slideshowImages.json')
      .then((response) => response.json())
      .then((data) => {
        const imagesWithS3URL = data.map((image) => `${s3Prefix}${image}`);
        setSlideshowImages(imagesWithS3URL);
      })
      .catch((error) => console.error('Error loading slideshow images:', error));
  }, []);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slideshowImages.length);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slideshowImages.length - 1 : prevSlide - 1
    );
  };

  // Function to check if sections are in view
  const handleScroll = () => {
    const visionSection = document.querySelector('.vision');
    const visionPosition = visionSection.getBoundingClientRect().top;

    const whatIsSection = document.querySelector('.smartsoils-overview');
    const whatIsPosition = whatIsSection.getBoundingClientRect().top;

    const whySection = document.querySelector('.why-smartsoils');
    const whyPosition = whySection.getBoundingClientRect().top;

    const dataSection = document.querySelector('.data-exploration'); // For data visualization link
    const dataPosition = dataSection.getBoundingClientRect().top;

    const screenPosition = window.innerHeight / 1.5;

    if (visionPosition < screenPosition) {
      setIsVisionVisible(true);
    }

    if (whatIsPosition < screenPosition) {
      setIsWhatIsVisible(true);
    }

    if (whyPosition < screenPosition) {
      setIsWhyVisible(true);
    }

    if (dataPosition < screenPosition) {
      setIsDataVisible(true);
    }
  };

  // Add event listener for scroll event
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="main-content">
      {/* Full-width Slideshow */}
      <section className="slideshow-section0">
        <div
          className="slideshow-container"
          style={{
            backgroundImage: `url(${slideshowImages[currentSlide]})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            height: '80vh',
          }}
        >
          <div className="slideshow">
            <button className="slideshow-arrow left-arrow" onClick={prevSlide}>
              ←
            </button>
            <button className="slideshow-arrow right-arrow" onClick={nextSlide}>
              →
            </button>
            {/* Logo overlay within the slideshow */}
            <img src="https://smartsoils-testbed.s3.amazonaws.com/assets/smartsoils-logo.png" className="slideshow-logo0" alt="SMARTSoils Logo" />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className={`vision ${isVisionVisible ? 'vision-visible' : 'vision-hidden'}`}>
        <h2 className="vision-title">OUR VISION</h2>
        <p className="vision-text">
          The <span className="vision-highlight">SMARTSoils testbed</span> will help usher in breakthroughs in our ability to understand and predict soil-microbe-plant interactions and their regulation of ecosystem functioning under changing, real-world conditions from laboratory to testbed to field, and from hours to decades.
        </p>
      </section>

      {/* What is SMARTSoils Section */}
      <section className={`smartsoils-overview ${isWhatIsVisible ? 'what-is-visible' : 'what-is-hidden'}`}>
        <h2 className="smartsoils-title">What is the SMARTSoils Testbed?</h2>
        <p className="smartsoils-definition">
        The SMARTSoils (Sensors at Mesoscale with Autonomous Remote Telemetry) Testbed is a controlled, fabricated ecosystem designed to study the complex soil-microbe-plant interactions using a comprehensive set of innovative sensors and technologies. This testbed mimics the complexity of a natural ecosystem and enables researchers to manipulate and observe the ecosystem physical, chemical, and biological interactions under real-world environmental conditions.
        </p>
        <div className="arrow-container">
          <img src="https://smartsoils-testbed.s3.amazonaws.com/assets/smartsoils-arrow.png" className="down-arrow" alt="Down Arrow" />
        </div>
      </section>

      <section className={`why-smartsoils ${isWhyVisible ? 'why-visible' : 'why-hidden'}`}>
        <h2 className="why-title">Why SMARTSoils?</h2>

        {/* Central image */}
        <div className="smartsoils-image-container">
          <img src="https://smartsoils-testbed.s3.amazonaws.com/assets/ecotech-cartoon.png" className="smartsoils-image" alt="SMARTSoils Cartoon" />
        </div>

        {/* Centered container for the panels */}
        <div className="container">
          <div className="smartsoils-panels">
            <a href="/data-visualization/sensor-layout" className="panel-link">
              <div className="smartsoils-panel">
                <h3>Why care about SMARTSoils?</h3>
                <p>
                The SMART Soils Testbed is at the right level of complexity between laboratory and field scale research.  Driven by natural forcings and supported by comprehensive sensing, the gained insights of the coupled plant-soil-microbial interactions are transferrable to the field scales. See the sensor layout and explore the 3D interactive model to better understand the role of each sensor in the testbed.
                </p>
              </div>
            </a>

            <a href="/data-visualization/phenocam" className="panel-link">
              <div className="smartsoils-panel">
                <h3>Why use phenocam sensors?</h3>
                <p>
                Phenocams track the surface vegetative dynamics over time, offering insights into the plant growth dynamics in response to seasonal and annual changes. This helps correlate aboveground plant activity with belowground dynamics for exploring mechanisms driving system evolution.
                </p>
              </div>
            </a>

            <a href="/data-visualization/rhizotron" className="panel-link">
              <div className="smartsoils-panel">
                <h3>Why minirhizotron?</h3>
                <p>
                Minirhizotron provides a window in to the dynamic root growth in responding to environmental drivers and stressors. This data is critical for understanding plant adaptation to environmental changes, such as water and nutrient availability. Linking root changes with canopy dynamics and soil/microbial processes provides a full view of the coupling of the soil-plant-microbial interactions.
                </p>
              </div>
            </a>

            <a href="/data-visualization/ert" className="panel-link">
              <div className="smartsoils-panel">
                <h3>Why water level and resistivity?</h3>
                <p>
                Real time monitoring of water level and soil resistivity allows for the visualization of hydrological processes that underpin plant and biogeochemical dynamics. Electrical Resistivity Tomography (ERT) provides a full 4D view of the ecosystem in terms of moisture dynamics and hydrological properties that link to plant stress and dynamics.  
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Data Exploration CTA with Image */}
      <section className={`data-exploration ${isDataVisible ? 'data-visible' : 'data-hidden'}`}>
        <div className="data-container">
          <div className="data-text">
            <h2 className="data-title">Explore Interactive Data Visualizations</h2>
            <p className="data-description">
              Dive deeper into the data collected through the SMARTSoils Testbed. Use interactive tools to visualize data streams, including:
            </p>
            <ul className="data-list">
              <li><strong>Sensor Layout:</strong> View the details of key sensors deployed in the testbed.</li>
              <li><strong>Sensor Time Series:</strong> Explore plots of meteorological, soil and other environmental variables over time.</li>
              <li><strong>Electrical Resistivity Tomography (ERT):</strong> Visualize electrical resistivity and soil hydraulic properties in space and time.</li>
              <li><strong>Phenocam Timelapse:</strong> Watch plant growth through timelapse imagery.</li>
              <li><strong>Root Scans:</strong> Track root development with minirhizotron scans.</li>
            </ul>
            <a href="/data-visualization" className="explore-link">Get Started</a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
