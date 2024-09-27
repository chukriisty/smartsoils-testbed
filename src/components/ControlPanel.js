import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import './ControlPanel.css';  // CSS is in the separate file

const ControlPanel = ({ onComponentSelect }) => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({});
  const popupRef = useRef(null);

  // Load and parse the CSV file
  useEffect(() => {
    Papa.parse("/data/component/tb_component_description.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const filteredData = result.data.map(component => {
          if (component.__parsed_extra && component.__parsed_extra.length > 0) {
            component.Image = component.__parsed_extra[0].replace(/'/g, '').trim();
          }
          return component;
        });
        setComponents(filteredData);  // Store the parsed data into state
      },
    });
  }, []);

  // Handle button click to fetch component info by Sensor name
  const handleClick = (sensorName, event) => {
    const component = components.find(comp => comp.Sensor === sensorName);
    if (component) {
      const rect = event.target.getBoundingClientRect();
      let popupTop = rect.top + window.scrollY - 200;
  
      if (rect.top > window.innerHeight / 2) {
        popupTop = rect.top + window.scrollY - 500;
      }
  
      if (popupTop < 20) {
        popupTop = 20;
      }
  
      // Adjusting the popup to be slightly to the left
      setPopupPosition({
        top: popupTop,
        left: rect.left + window.scrollX - 150,  // Move popup to the left (100 instead of 150)
      });
  
      setSelectedComponent(component);
  
      // Pass the selected component to the parent (so the 3D component updates its image)
      onComponentSelect(component);
    }
  };
  
  // Effect to detect outside clicks and close the pop-up
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSelectedComponent(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="control-panel">
      <p className="instructions">View individual components below. Toggle to 3D View to view 3D model of the testbed (zoom-in the web page once to achieve better rendering). Select Reset View to return to the original state.</p>
      
      {/* Dynamically Generated Buttons */}
      <div className="button-list">
        {components.map((component, index) => (
          <button 
            key={index} 
            className="component-button" 
            onClick={(event) => handleClick(component.Sensor, event)}  // Pass Sensor name on click
          >
            {component.Sensor}  {/* Display the sensor name on the button */}
          </button>
        ))}
      </div>

      {/* Popup with component details */}
      {selectedComponent && (
        <div 
          className="sens-comp-popup-card"  // Updated class name
          ref={popupRef}  // Attach a ref to the pop-up to detect clicks outside of it
          style={{ 
            top: `${popupPosition.top}px`, 
            left: `${popupPosition.left}px`
          }}
        >
          <div className="sens-comp-popup-arrow"></div> {/* Arrow pointing to the button */}
          <div className="sens-comp-popup-content">
            <h3>{selectedComponent.Sensor}</h3> {/* Display sensor name */}
            <p><strong>Description:</strong> {selectedComponent.Description || 'No description available.'}</p> {/* Display description */}
            <p><strong>Application:</strong> {selectedComponent.Application || 'No application information available.'}</p> {/* Display application */}
            
            {/* Image Container */}
            <div className="sens-comp-image-container">
              <img
                src={`https://smartsoils-testbed.s3.amazonaws.com/data/component/${selectedComponent.Image}`} 
                alt={selectedComponent.Sensor}
                className="sens-comp-component-image" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
