import React, { useEffect, useRef, useState, useCallback } from 'react';
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import vtkLookupTable from '@kitware/vtk.js/Common/Core/LookupTable';
import '@kitware/vtk.js/Rendering/Profiles/All';
import './ERTPage.css';

const ERTPage = () => {
  const renderWindowRef = useRef(null);
  const [fileNames, setFileNames] = useState([]);
  const [currentFile, setCurrentFile] = useState('');
  const [currentScalarField, setCurrentScalarField] = useState('res'); // Default to resistivity field
  const [scalarFields, setScalarFields] = useState([]);
  const [actor, setActor] = useState(null); // Store the current actor
  const [renderer, setRenderer] = useState(null); // Store the renderer

  // Function to fetch data and render
  const fetchData = useCallback(async (filePath, scalarField) => {
    try {
      const reader = vtkXMLPolyDataReader.newInstance();

      console.log('Fetching file from path:', filePath);
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      reader.parseAsArrayBuffer(arrayBuffer);

      const polydata = reader.getOutputData(0);
      if (!polydata) {
        throw new Error('Failed to parse the .vtp file properly.');
      }

      console.log('Polydata:', polydata);

      // Get available scalar fields and set them in the state for the dropdown
      const cellData = polydata.getCellData();
      const availableScalarFields = cellData.getArrays().map(array => array.getName());
      setScalarFields(availableScalarFields);

      // If no scalar field is passed, use default
      const selectedField = scalarField || availableScalarFields[0];

      // Log the data of the current scalar field for verification
      const selectedScalarArray = cellData.getArray(selectedField);
      console.log(`Selected scalar field (${selectedField}) data:`, selectedScalarArray.getData());

      const mapper = vtkMapper.newInstance();
      const newActor = vtkActor.newInstance();

      // Get the range of the current scalar field
      const [minValue, maxValue] = selectedScalarArray.getRange();
      console.log(`Selected scalar field (${selectedField}) range:`, [minValue, maxValue]);

      // Create a lookup table for resistivity (or other scalar value) visualization
      const lookupTable = vtkLookupTable.newInstance();
      lookupTable.setRange(minValue, maxValue); // Set scalar range based on selected scalar field

      // Set a Blue-to-Red color gradient using hue range
      lookupTable.setHueRange(0.667, 0); // Blue (low) to red (high)
      lookupTable.setSaturationRange(1, 1); // Full saturation for colors
      lookupTable.setValueRange(1, 1); // Bright colors
      lookupTable.build(); // Build the lookup table after setting ranges

      mapper.setLookupTable(lookupTable);
      mapper.setUseLookupTableScalarRange(true);

      // Set scalar mode and input data
      mapper.setScalarModeToUseCellFieldData();
      mapper.setArrayAccessMode(1); // Use cell data
      mapper.setScalarVisibility(true);
      mapper.setInputData(polydata);
      mapper.setColorByArrayName(selectedField); // Map color by the selected scalar field

      newActor.setMapper(mapper);

      // Remove the previous actor if it exists
      if (actor && renderer) {
        renderer.removeActor(actor);
      }

      // Add the new actor
      renderer.addActor(newActor);
      setActor(newActor); // Save the new actor

      // Reset the camera and make sure it scales the object properly to fill the window
      renderer.resetCamera();

      renderer.getRenderWindow().render(); // Ensure rendering after data load
    } catch (error) {
      console.error('Error loading or parsing .vtp file:', error);
    }
  }, [actor, renderer]);

  useEffect(() => {
    // Initialize the rendering window and renderer only once
    const genericRenderWindow = vtkGenericRenderWindow.newInstance();
    genericRenderWindow.setContainer(renderWindowRef.current);

    // Set background color to transparent or specific color
    const renderWindowRenderer = genericRenderWindow.getRenderer();
    renderWindowRenderer.setBackground(1, 1, 1); // White background

    const interactor = genericRenderWindow.getInteractor();
    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
    setRenderer(renderWindowRenderer);

    // Fetch the list of .vtp files from the JSON file
    const fetchFileList = async () => {
      try {
        const response = await fetch('/vtpFileList.json'); // Adjust the path to your JSON file
        if (!response.ok) {
          throw new Error(`Failed to fetch file list: ${response.statusText}`);
        }

        const data = await response.json();
        setFileNames(data);
        setCurrentFile(data[0]); // Set default file to the first in the list
      } catch (error) {
        console.error('Error fetching file list: ', error);
      }
    };

    fetchFileList(); // Fetch file list on component mount
  }, []);

  useEffect(() => {
    if (currentFile) {
      fetchData(currentFile, currentScalarField); // Fetch data for the default or selected file
    }
  }, [currentFile, currentScalarField, fetchData]); // Depend on both file and scalar field changes

  const handleFileChange = (event) => {
    const selectedFile = event.target.value;
    setCurrentFile(selectedFile);
  };

  const handleScalarFieldChange = (event) => {
    const selectedScalarField = event.target.value;
    setCurrentScalarField(selectedScalarField);
  };

  // Function to format file name to display only the date
  const formatFileName = (fileName) => {
    const matches = fileName.match(/(\d{8})/);
    if (matches) {
      const date = matches[1]; // YYYYMMDD
      const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
      return formattedDate; // Return only the formatted date
    }
    return fileName; // Return the original file name if no match is found
  };

  return (
    <div className="ert-page">
      {/* Back Button */}
      <a href="/data-visualization" className="back-arrow">
        &#x2190; <span className="back-text">Back to Data Visualization</span>
      </a>

      {/* Title */}
      <h2 className="page-title">Electrical Resistivity Tomography</h2>

      {/* Controls on top of the render window */}
      <div className="controls-container">
        <label htmlFor="file-select">Select Date:</label>
        <select id="file-select" onChange={handleFileChange} value={currentFile}>
          {fileNames.map((file) => (
            <option key={file} value={file}>
              {formatFileName(file)}
            </option>
          ))}
        </select>

        <label htmlFor="scalar-field-select">Select Scalar Field:</label>
        <select id="scalar-field-select" onChange={handleScalarFieldChange} value={currentScalarField}>
          {scalarFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div className="render-window-container">
        <div className="render-window" ref={renderWindowRef}></div>
      </div>
    </div>
  );
};

export default ERTPage;
