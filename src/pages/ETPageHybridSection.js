import './ETPageHybridSection.css'; // Ensure that the CSS file is linked
import React, { useState, useEffect } from 'react';
import {
    ComposedChart, Scatter, Line, Bar,
    XAxis, YAxis, Label,
    CartesianGrid, Legend,
    ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import moment from 'moment'

const timeTicks = [
  new Date("2021-04-02").getTime(),
  new Date("2021-10-02").getTime(),
  new Date("2022-04-02").getTime(),
  new Date("2022-10-02").getTime(),
  new Date("2023-04-02").getTime(),
  new Date("2023-10-02").getTime(),
  new Date("2024-04-02").getTime(),
  new Date("2024-10-02").getTime(),
];

const one2oneRa = [
  {log_ra_ba_mb_lc:1 , "1:1":1},
  {log_ra_ba_mb_lc:3 , "1:1":3}
  ];

const one2oneRs = [
  {log_rs_ba_pm_mb_lc:0.5 , "1:1":0.5},
  {log_rs_ba_pm_mb_lc:5 , "1:1":5}
  ];

const one2oneET = [
  {et_mb_lc:0 , "1:1":0},
  {et_mb_lc:6 , "1:1":6}
  ];

const permutation = [
  {predictor:'Air Temp Max', permutation:0.0486},
  {predictor:'Air Temp Min', permutation:0.0568},
  {predictor:'Surface Temp Max', permutation:0.2498},
  {predictor:'Surface Temp Min', permutation:0.0071},
  {predictor:'Temp Gradient', permutation:0.4221},
  {predictor:'Solar Radiation', permutation:0.4927},
  {predictor:'Albedo', permutation:0.1133},
  {predictor:'Net Longwave Rad', permutation:0.0769},
  {predictor:'Soil Heat Flux', permutation:0.0823},
  {predictor:'Wind Gradient', permutation:0.1094},
  {predictor:'Vapor Pressure', permutation:0.06},
  {predictor:'VP Deficit', permutation:0.0212},
  {predictor:'Soil Water Potential', permutation:0.1676},
  {predictor:'Leaf Area Index', permutation: 0.0849},
];

// colors
const aColor = "#007681" // color for "analytical"
const hColor = "#63666A" // color for "hybrid"
const mColor = "#E04E39" // color for "mass balance"
const activeAlpha = 0.9
const inactiveAlpha = 0.1
const mAlpha = 0.75
const inactiveStroke = "none"

  function HybridSection () {

      const [data, setData] = useState([]);
      const [testData, setTestData] = useState([]);
      const [selectedVariable, setSelectedVariable] = useState(null);
      const [selectedYLabel, setSelectedYLabel] = useState(null);
      const [selectedLegend, setSelectedLegend] = useState(null);
      const [selectedOutputNote, setSelectedOutputNote] = useState(null);
      const [selectedDescription, setSelectedDescription] = useState(null);
      let results;
      
      useEffect(() => {
        // parse all data
        Papa.parse('/data/timeseries/prediction_testbed.csv', {
          download: true,
          header: true,
          dynamicTyping: true,
          delimeter: ",",
          skipEmptyLines: true,
          complete: function(data) {
            // format time
            results = data.data.map(d => ({
              datenum: new Date(d.datetime).getTime(), ...d
            }));
            results = results.map(d => ({
              albedo_pct: d.albedo*100, ...d
            }));
            results = results.filter(d => {
              return (0 <= d.et_pm_ml_mean);
            });
            setData(results)
          }
        });
        // parse test set
        Papa.parse('/data/timeseries/prediction_testbed.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            delimeter: ",",
            skipEmptyLines: true,
            complete: function(data) {
              results = data.data
              // select test
              results = results.filter(d => {
                return (d.test === "True");
              });
              results = results.filter(d => {
                return (0 <= d.et_pm_mo);
              });
              results = results.filter(d => {
                return (0 <= d.et_pm_ml_mean);
              });
              setTestData(results)
            }
          });
      }, []);

      return(
        <section className="hybrid-section">
            <div className="hybrid-all">
                <h2 className="hybrid-title">Hybrid Model</h2>
                <h5 className="hybrid-title">SMARTSoils Testbed as a platform for reparametrizaing PM Model using a machine learning approach</h5>
                <div className="hybrid-model">
                    <div className="hybrid-model-visualization">
                        <div>
                            <button onClick={() => [setSelectedVariable(null), setSelectedYLabel(null), setSelectedLegend(null)]}>Reset</button>
                        </div>
                        {
                          selectedVariable === null ? (
                              <div className="hybrid-model-structure">
                                  <div>
                                      <img src={'https://smartsoils-testbed.s3.amazonaws.com/assets/ann.png'}
                                          />
                                  </div>
                                  <div className="hybrid-model-structure-description">
                                      <div className="hybrid-model-structure-description-bullets">
                                          <legend>A Machine Learning Model for PM Parametrization</legend>
                                          <ul>
                                              <li>Model Benchmarking: PM resistance terms were derived from sensor measurements and ground truth ET.</li>
                                              <li>An Artificial Neural Network model was trained to predict PM resistance terms.</li>
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                          ) : selectedVariable === "permutation" ? (
                              <React.Fragment>
                                  <h5 className="hybrid-title">Reduction of r2 value when a predictor is permutated</h5>
                                  <ResponsiveContainer debounce={200} width="99%" height={300}>
                                      <ComposedChart data={permutation} margin={{ top: 10, right: 10, left: 10, bottom: 130 }}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="predictor" angle={-90} textAnchor={"end"}/>
                                      <YAxis type="number" domain={[0, 'auto']}>
                                          <Label style={{textAnchor: "middle"}} angle={270} dx={-35} value={selectedYLabel} />
                                      </YAxis>
                                      <Bar dataKey={selectedVariable} type="number" fill={aColor} />
                                      </ComposedChart>
                                  </ResponsiveContainer>
                              </React.Fragment> 
                          ) : (selectedVariable === "log_ra_ba_mb_lc" || selectedVariable === "log_rs_ba_pm_mb_lc") ? (
                              <React.Fragment>
                                  <h5 className="hybrid-title">SMARTSoils Testbed</h5>
                                  <div className="hybrid-timeseries-output">
                                      <div className="hybrid-timeseries">
                                          <ResponsiveContainer debounce={200} width="99%" height={225}>
                                              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                                              <CartesianGrid strokeDasharray="3 3" />
                                              <XAxis dataKey="datenum" type="number"
                                                    domain={['datamin', 'datamax']}
                                                    ticks={timeTicks}
                                                    tickFormatter = {(unixTime) => moment(unixTime).format('YY-MMM')}
                                                    angle={-30} textAnchor={"end"}/>
                                              <YAxis type="number" domain={['auto', 'auto']} allowDecimals={false}>
                                                  <Label style={{textAnchor: "middle"}} angle={270} dx={-35} value={selectedYLabel} />
                                              </YAxis>
                                              <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                                              <Line dataKey={selectedVariable} type="number" name={selectedLegend} stroke={hColor} />
                                              </ComposedChart>
                                          </ResponsiveContainer>
                                      </div>
                                      <div className="hybrid-model-equation">
                                          <img src={'https://smartsoils-testbed.s3.amazonaws.com/assets/r.png'}
                                          />
                                      </div>
                                      <div>
                                          <p className="hybrid-model-note">{selectedOutputNote}</p>
                                      </div>
                                  </div>
                              </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <h5 className="hybrid-title">SMARTSoils Testbed</h5> 
                              <ResponsiveContainer debounce={200} width="99%" height={225}>
                                  <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="datenum" type="number"
                                        domain={['datamin', 'datamax']}
                                        ticks={timeTicks}
                                        tickFormatter = {(unixTime) => moment(unixTime).format('YY-MMM')}
                                        angle={-30} textAnchor={"end"}/>
                                  <YAxis type="number" domain={['auto', 'auto']} allowDecimals={false}>
                                      <Label style={{textAnchor: "middle"}} angle={270} dx={-35} value={selectedYLabel} />
                                  </YAxis>
                                  <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                                  <Line dataKey={selectedVariable} type="number" name={selectedLegend} fill="#000000" dot={false} />
                                  </ComposedChart>
                              </ResponsiveContainer>
                            </React.Fragment> 
                          )
                        }
                    </div>
                    <div className="hybrid-model-input-container">
                        <h5 className="hybrid-title">View Model Inputs (Predictors, Observed)</h5>
                        <div className="hybrid-model-input-button-container">
                            <button onClick={() => [setSelectedVariable('txmax'), setSelectedYLabel('[K]'), setSelectedLegend('Air Temperature, Daily Max')]}
                                    className={selectedVariable === 'txmax' ? 'active' : ''}>Air Temp Max</button>
                            <button onClick={() => [setSelectedVariable('txmin'), setSelectedYLabel('[K]'), setSelectedLegend('Air Temperature, Daily Min')]}
                                    className={selectedVariable === 'txmin' ? 'active' : ''}>Air Temp Min</button>
                            <button onClick={() => [setSelectedVariable('tomax'), setSelectedYLabel('[K]'), setSelectedLegend('Surface Temperature, Daily Max')]}
                                    className={selectedVariable === 'tomax' ? 'active' : ''}>Surface Temp Max</button>
                            <button onClick={() => [setSelectedVariable('tomin'), setSelectedYLabel('[K]'), setSelectedLegend('Surface Temperature, Daily Min')]}
                                    className={selectedVariable === 'tomin' ? 'active' : ''}>Surface Temp Min</button>
                            <button onClick={() => [setSelectedVariable('dt/dz'), setSelectedYLabel('[K/m]'), setSelectedLegend('Temperature Gradient (Surface minus Air and adjusted by surface roughness)')]}
                                    className={selectedVariable === 'dt/dz' ? 'active' : ''}>Temp Gradient</button>
                            <button onClick={() => [setSelectedVariable('srad'), setSelectedYLabel('[W/m2]'), setSelectedLegend('Incoming Shortwave Radiation, Daily Mean')]}
                                    className={selectedVariable === 'srad' ? 'active' : ''}>Solar Radiation</button>
                            <button onClick={() => [setSelectedVariable('albedo_pct'), setSelectedYLabel('[%]'), setSelectedLegend('Albedo')]}
                                    className={selectedVariable === 'albedo_pct' ? 'active' : ''}>Albedo</button>
                            <button onClick={() => [setSelectedVariable('nlrad'), setSelectedYLabel('[W/m2]'), setSelectedLegend('Net Longwave Radiation, Daily Mean')]}
                                    className={selectedVariable === 'nlrad' ? 'active' : ''}>Net Longwave Rad</button>
                            <button onClick={() => [setSelectedVariable('g'), setSelectedYLabel('[W/m2]'), setSelectedLegend('Soil Heat Flux, Daily Mean')]}
                                    className={selectedVariable === 'g' ? 'active' : ''}>Soil Heat Flux</button>
                            <button onClick={() => [setSelectedVariable('du/dz'), setSelectedYLabel('[m/s/m]'), setSelectedLegend('Wind Speed Gradient (adjusted by surface roughness)')]}
                                    className={selectedVariable === 'du/dz' ? 'active' : ''}>Wind Gradient</button>
                            <button onClick={() => [setSelectedVariable('vp'), setSelectedYLabel('[Pa]'), setSelectedLegend('Vapor Pressure, Daily Mean')]}
                                    className={selectedVariable === 'vp' ? 'active' : ''}>Vapor Pressure</button>
                            <button onClick={() => [setSelectedVariable('vpd'), setSelectedYLabel('[Pa]'), setSelectedLegend('Vapor Pressure Deficit')]}
                                    className={selectedVariable === 'vpd' ? 'active' : ''}>VP Deficit</button>
                            <button onClick={() => [setSelectedVariable('swp_log'), setSelectedYLabel('-log(-[kPa])'), setSelectedLegend('Soil Water Potential, Daily Mean (more negative = drier soil)')]}
                                    className={selectedVariable === 'swp_log' ? 'active' : ''}>Soil Water Potential</button>
                            <button onClick={() => [setSelectedVariable('lai'), setSelectedYLabel('[m2/m2]'), setSelectedLegend('Leaf Area Index')]}
                                    className={selectedVariable === 'lai' ? 'active' : ''}>Leaf Area Index</button>
                            <button onClick={() => [setSelectedVariable('permutation'), setSelectedYLabel('-[r2] (importance)'), setSelectedLegend(null)]}
                                    className={selectedVariable === 'permutation' ? 'active' : ''}>Predictors Importance</button>
                        </div>
                    </div>
                    <div className="hybrid-model-output-container">
                        <h5 className="hybrid-title">View Model Outputs (Labels, Benchmarked)</h5>
                        <div className="hybrid-model-output-button-container">
                            <button onClick={() => [setSelectedVariable('log_ra_ba_mb_lc'), setSelectedYLabel('log([s/m])'), setSelectedLegend('Aerodynamic Resistance'),
                                                    setSelectedOutputNote("Lower resistance during warm periods (enhanced turbulent transfer through buoyancy)")
                                            ]}
                                    className={selectedVariable === 'log_ra_ba_mb_lc' ? 'active' : ''}>Aerodynamic Resistance</button>
                            <button onClick={() => [setSelectedVariable('log_rs_ba_pm_mb_lc'), setSelectedYLabel('log([s/m])'), setSelectedLegend('Surface Resistance'),
                                                    setSelectedOutputNote("Lower resistance during wet periods")
                                            ]}
                                    className={selectedVariable === 'log_rs_ba_pm_mb_lc' ? 'active' : ''}>Surface Resistance</button>
                        </div>
                    </div>
                </div>
                <h5 className="hybrid-title">Model Performance</h5>
                <div className="hybrid-summary">
                    From a holdout dataset not used in ML model training, ET prediction based on the 
                    hybrid model (PM Model + ML predicted resistance terms)
                    shows a higher agreement with the ground truth ET (r2 = 0.82)
                    compared to the PM model with analytical solutions (r2 = 0.46).
                </div>
                <div className="hybrid-plots-1to1">
                    <div className="hybrid-1to1">
                        <h5 className="hybrid-title">Aerodynamic Resistance</h5>
                        <h6 className="hybrid-title">log([s/m])</h6>
                        <h6 className="hybrid-title">r2 = 0.79 (holdout data)</h6>{/*Analytical -1.38*/}
                        <ResponsiveContainer debounce={200} width="99%" height={250} >
                            <ComposedChart margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="log_ra_ba_mb_lc" type="number" domain={[1, 3]} ticks={[1,2,3]}>
                                <Label style={{textAnchor: "middle", fill: mColor}} dy={25} value={"Benchmarked"} />
                            </XAxis>
                            <YAxis domain={[1, 3]} ticks={[1,2,3]}>
                                <Label style={{textAnchor: "middle"}} angle={270} dx={-15} value={"ML Predicted"} />
                            </YAxis>
                            <Line data={one2oneRa} dataKey="1:1" stroke="#000000" dot={false} legendType="none" />
                            <Scatter data={testData} dataKey="log_ra_ml" name="Hybrid" 
                                    type="number" fill={hColor} isAnimationActive={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="hybrid-1to1">
                        <h5 className="hybrid-title">Surface Resistance</h5>
                        <h6 className="hybrid-title">log([s/m])</h6>
                        <h6 className="hybrid-title">r2 = 0.71 (holdout data)</h6> {/*Analytical -8.39*/}
                        <ResponsiveContainer debounce={200} width="99%" height={250} >
                            <ComposedChart margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="log_rs_ba_pm_mb_lc" type="number" domain={[0.5, 5]} ticks={[1,2,3,4,5]}>
                                <Label style={{textAnchor: "middle", fill: mColor}} dy={25} value={"Benchmarked"} />
                            </XAxis>
                            <YAxis domain={[0.5, 5]} ticks={[1,2,3,4,5]}>
                                <Label style={{textAnchor: "middle"}} angle={270} dx={-15} value={"ML Predicted"} />
                            </YAxis>
                            <Line data={one2oneRs} dataKey="1:1" stroke="#000000" dot={false} legendType="none" />
                            <Scatter data={testData} dataKey="log_rs_ml" name="Hybrid" 
                                    type="number" fill={hColor} isAnimationActive={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="hybrid-1to1">
                        <h5 className="hybrid-title">Evapotranspiration</h5>
                        <h6 className="hybrid-title">[mm/d]</h6>
                        <h6 className="hybrid-title">r2 = 0.82 (holdout data)</h6> {/*Analytical 0.46*/}
                        <ResponsiveContainer debounce={200} width="99%" height={250} >
                            <ComposedChart margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="et_mb_lc" type="number" domain={[0, 6]} ticks={[0,2,4,6]}>
                                <Label style={{textAnchor: "middle", fill: mColor}} dy={25} value={"Mass Balance"} />
                            </XAxis>
                            <YAxis domain={[0, 6]} ticks={[0,2,4,6]}>
                                <Label style={{textAnchor: "middle"}} angle={270} dx={-15} value={"Modeled"} />
                            </YAxis>
                            <Line data={one2oneET} dataKey="1:1" stroke="#000000" dot={false} legendType="none" />
                            <Scatter data={testData} dataKey="et_pm_ml_mean" name="PM (Hybrid)" 
                                    type="number" fill={hColor} isAnimationActive={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
      )
  
  }
  
  export default HybridSection;