import React, { useRef, useEffect } from 'react';
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import '@kitware/vtk.js/Rendering/Profiles/All';
import './3DSensorLayout.css';

const ThreeDSensorLayout = ({ viewMode, setViewMode, selectedComponent, resetView }) => {
  const renderWindowRef = useRef(null);
  const genericRenderWindow = useRef(null);
  const initialCameraState = useRef(null);

  useEffect(() => {
    if (viewMode === '3D') {
      if (!genericRenderWindow.current) {
        genericRenderWindow.current = vtkGenericRenderWindow.newInstance({
          background: [169, 191, 204],
        });

        const container = renderWindowRef.current;
        if (!container) return;

        genericRenderWindow.current.setContainer(container);

        const renderer = genericRenderWindow.current.getRenderer();
        const renderWindow = genericRenderWindow.current.getRenderWindow();
        const interactor = genericRenderWindow.current.getInteractor();
        const interactorStyle = vtkInteractorStyleTrackballCamera.newInstance();
        interactor.setInteractorStyle(interactorStyle);

        const reader = vtkXMLPolyDataReader.newInstance();
        const fetchData = async () => {
          try {
            const response = await fetch('/data/component/tb_components.vtp');
            if (!response.ok) throw new Error('Failed to fetch file');

            const arrayBuffer = await response.arrayBuffer();
            reader.parseAsArrayBuffer(arrayBuffer);

            const polydata = reader.getOutputData(0);
            const mapper = vtkMapper.newInstance();
            const actor = vtkActor.newInstance();
            mapper.setInputData(polydata);
            actor.setMapper(mapper);
            renderer.addActor(actor);

            renderer.resetCamera();
            const camera = renderer.getActiveCamera();
            initialCameraState.current = camera.getState();
            renderWindow.render();
          } catch (error) {
            console.error('Error loading .vtp file:', error);
          }
        };

        fetchData();
      } else {
        // Re-render the 3D view if switching back from the static view
        genericRenderWindow.current.getRenderWindow().render();
      }
    } else if (genericRenderWindow.current) {
      // When switching to static view, we delete the 3D render to free up resources
      genericRenderWindow.current.delete();
      genericRenderWindow.current = null;
    }
  }, [viewMode]);

  const resetToDefaultImage = () => {
    resetView();
    // Additional functionality for resetting static image if needed
  };

  return (
    <div className="three-d-viewer-container">
      {viewMode === '3D' && (
        <div className="three-d-render-window" ref={renderWindowRef}></div>
      )}

      {viewMode === 'Static' && (
        <div className="static-image-container">
          <img
            src={selectedComponent ? `https://smartsoils-testbed.s3.amazonaws.com/data/component/${selectedComponent.Image}` : 'https://smartsoils-testbed.s3.amazonaws.com/data/component/tb_component.png'} // Updated S3 URLs
            alt="Static View"
            className="static-image"
          />
        </div>
      )}

      <div className="three-d-view-toggle">
        <button onClick={() => setViewMode('3D')} className={viewMode === '3D' ? 'active' : ''}>3D Render</button>
        <button onClick={() => setViewMode('Static')} className={viewMode === 'Static' ? 'active' : ''}>Static</button>
        <button onClick={resetToDefaultImage}>Reset View</button>
      </div>
    </div>
  );
};

export default ThreeDSensorLayout;
