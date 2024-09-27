// // TimeSeriesPlot.js
import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import './ERT.css';
import moment from 'moment';
import Plot from 'react-plotly.js';

const YlOrRd = [
  [0, 'rgb(255,255,204)'],
  [0.125, 'rgb(255,237,160)'], [0.25, 'rgb(254,217,118)'],
  [0.375, 'rgb(254,178,76)'], [0.5, 'rgb(253,141,60)'],
  [0.625, 'rgb(252,78,42)'], [0.75, 'rgb(227,26,28)'],
  [0.875, 'rgb(189,0,38)'], [1, 'rgb(128,0,38)'],
];

const Blues = [
  [0, 'rgb(220,220,220)'], [0.35, 'rgb(106,137,247)'],
  [0.5, 'rgb(90,120,245)'], [0.6, 'rgb(70,100,245)'],
  [0.7, 'rgb(40,60,190)'], [1, 'rgb(5,10,172)'],
];

const BuRd = [
  [0, 'rgb(178,10,28)'], [0.35, 'rgb(230,145,90)'],
  [0.5, 'rgb(220,170,132)'], [0.6, 'rgb(190,190,190)'],
  [0.7, 'rgb(106,137,247)'], [1, 'rgb(5,10,172)'], 
];

const layout2D = {
    xaxis: {
      automargin: true,
      zeroline: false,
      range: [0, 4.7],
      title: {text: "x [m]", standoff: 15, font: {family: 'Karla, sans-serif', size: 18}}, // positive standoff: move upward
      tickvals: [0, 1, 2, 3, 4],
      tickfont: {family: 'Karla, sans-serif', size: 16},
      side: 'top',
      ticks: "outside", // make tick marks visible
    },
    yaxis: {
      automargin: true,
      zeroline: false,
      range: [1, 0], // inverse depth profile
      scaleanchor: 'x', // how to set 2d axes aspect
      scaleratio: 1,
      title: {text: "depth [m]", standoff: 15, font: {family: 'Karla, sans-serif', size: 18}}, // positive standoff: move leftward
      tickvals: [0, 0.5, 1],
      tickfont: {family: 'Karla, sans-serif', size: 16},
      ticks: "outside",
    },
    autosize: true,
    width: 1000,
    height: 320,
    margin: {l: 60, r: 60, b: 0, t: 0, pad: 10},
    paper_bgcolor: '#f0f8e7',
    plot_bgcolor: '#8b9a6d'
  }

const layout3D = {
  scene:{
    aspectratio: {x:4.7,y:1.2,z:1}, // how to set 3d axes aspect
    xaxis: {
      range: [4.7, 0],
      title: {text: "x [m]", standoff: 0, font: {family: 'Karla, sans-serif', size: 8}},
      tickvals: [0, 4],
      tickfont: {family: 'Karla, sans-serif', size: 8},
      ticks: "outside",
    },
    yaxis: {
      range: [0, 1.2],
      title: {text: "y [m]", standoff: 0, font: {family: 'Karla, sans-serif', size: 8}},
      tickvals: [0, 1],
      tickfont: {family: 'Karla, sans-serif', size: 8},
      ticks: "outside",
    },
    zaxis: {
      range: [1, 0],
      title: {text: "depth [m]", standoff: 0, font: {family: 'Karla, sans-serif', size: 8}},
      tickvals: [0, 1],
      tickfont: {family: 'Karla, sans-serif', size: 8},
      ticks: "outside",
    },
    camera: {eye: {x: 1, y: 2.5, z: 1}},
    dragmode: "none",
  },
  width: 1000,
  height: 320,
  margin: {l: 100, r: 100, b: 100, t: 10, pad: 10},
  paper_bgcolor: '#f0f8e7',
  plot_bgcolor: '#8b9a6d',
}

function layoutProfile(colorMin, colorMax, colorName) {return {
  // title: {text: "Depth Profile", font: {family: 'Karla, sans-serif', size: 20}},
  xaxis: {
    automargin: true,
    range: [colorMin, colorMax],
    title: {text: colorName, standoff: -5, font: {family: 'Karla, sans-serif', size: 18}},
    tickfont: {family: 'Karla, sans-serif', size: 16},
    ticks: "outside",
  },
  yaxis: {
    range: [1, 0],
    title: {text: "depth [m]", standoff: 20, font: {family: 'Karla, sans-serif', size: 18}},
    tickvals: [0, 0.5, 1],
    tickfont: {family: 'Karla, sans-serif', size: 16},
    ticks: "outside",
  },
  autosize: false,
  width: 500,
  height: 320,
  margin: {l: 100, r: 100, b: 90, t: 50, pad: 10},
  paper_bgcolor: '#f0f8e7',
  plot_bgcolor: '#8b9a6d'
}}

const ERTPage = () => {

   const [play, setPlay] = useState(false);
   const [viewMode2D, setViewMode2D] = useState(true)
   const [files, setFiles] = useState([]);
   const [currentIndex, setCurrentIndex] = useState([]);
  
   // Fetch csvs from JSON file in the public folder
   useEffect(() => {
     fetch('/ertFileList.json')  // Adjust the path if needed
       .then((response) => response.json())
       .then((data) => {
         setFiles(data);  // Set the loaded csvs from the JSON
         // console.log('Loaded files:', data);
         if (data.length > 0) {
           setCurrentIndex(0); // Ensure we start with the first file
           //setCurrentPath(data[0]);
         }
       })
       .catch((error) => console.error('Error loading csv list:', error));
   }, []);

   useEffect(() => {
     let interval;
     if (play && files.length > 0) { // Only run if csvs are loaded
       interval = setInterval(() => {
         setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length);
       }, 2000);
     }
     return () => clearInterval(interval);
   }, [play, files]);

   const togglePlay = () => setPlay(!play);

   const [xyzData, setXYZData] = useState([]);
   const [xzData, setXZData] = useState([]);
   const [zData, setZData] = useState([]);
   const [colorVar, setColorVar] = useState("log_res25")
   const [colorName, setColorName] = useState("Resistivity log([ohm m])")
   const [colorMin, setColorMin] = useState(1.5)
   const [colorMax, setColorMax] = useState(2.7)
   const [colorScale, setColorScale] = useState('RdBu');

   const handleSliderChange = (event) => {
     setPlay(false);
     setCurrentIndex(Number(event.target.value));
   };

   const handleColorVarChange = (e) => {
     const selectedColorVar = e.target.value
     setColorVar(selectedColorVar);
     if (selectedColorVar === "log_res25") {
       setColorName("Resistivity log([ohm m])");
       setColorMin(1.5);
       setColorMax(2.7);
       setColorScale('RdBu');
     } else if (selectedColorVar === "swc") {
       setColorName("Water Content [m3/m3]");
       setColorMin(0.08);
       setColorMax(0.43);
       setColorScale(BuRd);
     } else if (selectedColorVar === "pF") {
       setColorName("Water Potential [pF]");
       setColorMin(0.6);
       setColorMax(4.2);
       setColorScale('RdBu');
     } else if (selectedColorVar === "logK_cmd") {
       setColorName("Hydraulic Conductivity log([cm/day])");
       setColorMin(-6);
       setColorMax(0.5);
       setColorScale(BuRd);
     } else if (selectedColorVar === "cov") {
       setColorName("Coverage [-]");
       setColorMin(-5);
       setColorMax(3);
       setColorScale('RdBu');
     }
   };
   const handleColorMinChange = (e) => {setColorMin(e.target.value)};
   const handleColorMaxChange = (e) => {setColorMax(e.target.value)};

   const toggleView = () => setViewMode2D(!viewMode2D);

   const currentPath = files[currentIndex];
   const currentFileName = currentPath ? currentPath.split('/').pop() : '';
   const timeParts = currentFileName.match(/\d{4}_\d{2}_\d{2}_\d{2}_\d{2}/);
   const timeString = timeParts ? timeParts[0].split('_').slice(0, 5).join('_') : '';
   const currentDate = timeString ? moment(timeString, 'YYYY_MM_DD_hh_mm').format('YYYY MMMM DD') : '';

   let results, results_x, results_o;

   if (typeof currentPath != "undefined") {

      Papa.parse(currentPath, {
        download: true,
        header: true,
        dynamicTyping: true,
        delimeter: ",",
        skipEmptyLines: true,
        complete: function(data) {
          results = data.data
          results_x = results.filter(d => {
            return (d["plot"] == "x");
          });
          setXZData({
            x: results_x.map(function(d) {return d["x_(m)"]}),
            y: results_x.map(function(d) {return d["z_(m)"]}),
            mode: 'markers',
            marker: {
              size: 15,
              symbol: 'square',
              // opacity: results.map(function(d) {return d["cov"]}),
              color: results_x.map(function(d) {return d[colorVar]}),
              cmin: colorMin,
              cmax: colorMax,
              colorscale: colorScale,
              colorbar: {
                title: colorName,
                titlefont: {family: 'Karla, sans-serif', size: 18},
                tickfont: {family: 'Karla, sans-serif', size: 16},
                titleside: 'bottom',
                orientation: "h",
                x: 0.5,
                y: -0.3,
                yanchor: 'middle',
                thickness: 10,
              }
            }
          })
          results_o = results.filter(d => {
            return (d["plot"] == "o");
          });
          setXYZData({
            x: results_o.map(function(d) {return d["x_(m)"]}),
            y: results_o.map(function(d) {return d["y_(m)"]}),
            z: results_o.map(function(d) {return d["z_(m)"]}),
            mode: 'markers',
            type: 'scatter3d',
            marker: {
              size: 15,
              symbol: 'square',
              // opacity: results.map(function(d) {return d["cov"]}),
              color: results_o.map(function(d) {return d[colorVar]}),
              cmin: colorMin,
              cmax: colorMax,
              colorscale: colorScale,
              colorbar: {
                title: colorName,
                titlefont: {family: 'Karla, sans-serif', size: 18},
                tickfont: {family: 'Karla, sans-serif', size: 16},
                titleside: 'bottom',
                orientation: "h",
                x: 0.5,
                y: -0.3,
                yanchor: 'middle',
                thickness: 10,
              }
            }
          })
        }
      })

     Papa.parse("/data/ert/csv_files/z/testbed_z.csv", {
       download: true,
       header: true,
       dynamicTyping: true,
       delimeter: ",",
       skipEmptyLines: true,
       complete: function(data) {
         results = data.data
         results = results.filter(d => {
           return (d["date"] == timeString);
         });
         setZData({
           x: results.map(function(d) {return d[colorVar]}),
           y: results.map(function(d) {return d["z_(m)"]}),
           mode: 'lines+markers',
           marker: {
             size: 5,
             color: '#000000',
           }
         })
       }
     })

   }

   //console.log(zData)

  return (
      
      <div className="page">
        
        <div className="cleantop">
          <a href="/data-visualization" className="arrow">
            &#x2190;  
            <span className="arrowtext">Back to Data Visualization</span>
          </a>
        </div>

        <div className="note">

          <div className="notedescription">
            <h2>ERT Timelapse</h2>
            <hr className="custom-line" />
            <h6>Visualize resitivity and ERT-derived soil hydraulic variables over space and time.
                2D map averaged over the short axis (y=1.2 m) of the testbed, and the depth profile averaged over both the long (x=4.7 m) and the short axes.<br /><br />
                Color bar represents <font color="red">dryer soil</font> in red and <font color="blue">wetter soil</font> in blue. Use Autoscale to re-center the 2D map.
            </h6>
          </div>
           
          <div className="notevariable">
            <p className="variable-text">Select a variable below to view its calibration plot.</p>
            <div className="inputbox">
                <label>Variable:</label>
                <select value={colorVar} onChange={handleColorVarChange}>
                  <option className="service-small" value="log_res25">Resistivity</option>
                  <option className="service-small" value="swc">Soil Water Content</option>
                  <option className="service-small" value="pF">Soil Water Potential</option>
                  <option className="service-small" value="logK_cmd">Soil Hydraulic Conductivity</option>
                </select>
            </div>
            <div className="inputbox">
                <label>Min:</label> <br></br>
                <input type="number" value={colorMin} onChange={handleColorMinChange}></input>
                <label>Max:</label>
                <input type="number" value={colorMax} onChange={handleColorMaxChange}></input>
            </div>

            {
              colorVar === "log_res25" ? (
                <h6>From ERT inversion, corrected to 25°C.<br /><br />
                    Typical range: <font color="blue">1.5 (30 ohm m)</font> to <font color="red">2.7 (500 ohm m)</font>.</h6>
              ) : colorVar === "swc" ? (
                <h6>Converted from ERT resistivity, based on in-situ calibration between co-located ERT and soil water content sensors observations.<br /><br />
                    Typical range: <font color="red">0.08</font> to <font color="blue">0.43</font>.</h6>
              ) : colorVar === "pF" ? (
                <h6>Converted from water content, based on in-situ characterization of soil water retention curve using soil water content and matric potential sensors.<br /><br />
                    Typical range: <font color="blue">0.6 (-4 hPa)</font> to <font color="red">4.2 (-15,000 hPa)</font>.</h6>
              ) : colorVar === "logK_cmd" ? (
                <h6>Converted from water potential based on ex-situ core sample saturated and unsaturated hydaulic conductivity analysis.<br /><br />
                    Typical range: <font color="red">-6 (10<sup>-6</sup> cm/day)</font> to <font color="blue">0.5 (10<sup>0.5</sup> cm/day)</font>.</h6>
              ) : (
                <h6></h6>
              )
            }
          
          </div>

        </div>

        <div className="calibration">
          
          <div className="calibrationdescription">
            <div>
              <button className="calibrationbutton">Calibration Plot</button>
            </div>
            {
              colorVar === "swc" ? (
                <h6>Relationship between soil electrical resistivity and water content:<br /><br />
                    Data points from eight co-located ERT and SWC sensors measurements, fitted with an Arhice model.</h6>
              ) : colorVar === "pF" ? (
                <h6>Soil water retention curve:<br /><br />
                    Data from four pairs of co-located SWC and SWP sensors, fitted with the constrained van-Genuchten model.
                    Conventional <font color="blue">field capacity</font> (pF=2.5) and <font color="red">wilting point</font> (4.2) are plotted.
                    (SWP sensors have an upper limit of pF=2).
                </h6>
              ) : colorVar === "logK_cmd" ? (
                <h6>Hydraulic conductivity curve:<br /><br />Lab analysis of soil hydraulic conductivity under saturated (KSAT) and unsaturated (Hyprop) conditions using a soil core sample from the testbed, 
                    fitted results in conjunction with the soil water retention curve.</h6>
              ) : (
                <h6></h6>
              )
            }
          </div>
          
          <div className="calibrationvar">
            {
              colorVar === "swc" ? (
                <img src={"/data/ert/calibration_swc.png"} className="calibrationimage" />
              ) : colorVar === "pF" ? (
                <img src={"/data/ert/calibration_swp.png"} className="calibrationimage" />
              ) : colorVar === "logK_cmd" ? (
                <img src={"/data/ert/calibration_K.png"} className="calibrationimage" />
              ) : (
                <h6></h6>
              )
            }
          </div>

        </div>
        <div className="cleanbottom">
          <div> 
            <button className="playbutton" onClick={togglePlay}>
              {play ? 'Pause' : 'Play'}
            </button>
            <input type="range" min="0" max={files.length - 1} value={currentIndex} onChange={handleSliderChange} className="range"/>
          </div>
        </div>
        <div className="map">
          <div>
            {/*<button className="viewbutton" onClick={toggleView}>
                {viewMode2D ? 'Change to 3D' : 'Change to 2D'}
            </button>*/}
            <button className="viewbutton1">
                Two-Dimensional Map: {currentDate}
            </button>
            <Plot data={[xzData]} layout={layout2D}/>
            {/* viewMode2D ? (
              <Plot data={[xzData]} layout={layout2D}/>
            ) : (      
              <Plot data={[xyzData]} layout={layout3D}/>
            )*/}
          </div>
          
        </div>
        
        <div className="profile">
          <div>
            <button className="viewbutton2">
                Depth Profile: {currentDate}
            </button>
            <Plot data={[zData]} layout={layoutProfile(colorMin, colorMax, colorName)}/>
          </div>
        </div>

       </div>

   );
 };

export default ERTPage; /* this component will be referenced by that name */