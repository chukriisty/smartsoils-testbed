// TimeSeriesPlot.js
import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Line, Area, ReferenceLine,
  XAxis, YAxis, Label,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import './SensorTimeSeriesPage.css';

function SensorTimeSeriesPage() {

  // default
  const [variable, setVariable] = useState([]);
  const [yAxisLabel, setYAxisLabel] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  const [data, setData] = useState([]);

  const currentDate = new Date().toJSON().slice(0, 10);

  const [timeStart, setTimeStart] = useState("2021-04-07")
  const [timeEnd, setTimeEnd] = useState(currentDate)

  let results;

  const handleYAxisChange = (e) => {
    const selectedVariable = e.target.value;
    setVariable(selectedVariable);
    if (selectedVariable === "radiation") {
      setYAxisLabel("Daily Sum [MJ/m2/d] or Hourly [W/m2]")
    } else if (selectedVariable === "temperature") {
      setYAxisLabel("[°C]");
    } else if (selectedVariable === 'wind') {
      setYAxisLabel("[m/s]");
    } else if (selectedVariable === 'vpd') {
      setYAxisLabel("[kPa]");
    } else if (selectedVariable === 'swc') {
      setYAxisLabel("[m3/m3]");
    } else if (selectedVariable === 'swp') {
      setYAxisLabel("log(hPa) or [pF]");
    } else if (selectedVariable === 'co2') {
      setYAxisLabel("[μmol/m2/s]");
    }
  };

  const handleXAxisChange = (e) => {
    const selectedFrequency = e.target.value;
    if (selectedFrequency === "daily") {
      setFrequency(selectedFrequency)
      setXAxis("Date");
    } else if (selectedFrequency === "hourly") {
      setFrequency(selectedFrequency)
      setXAxis("Time");
    }
  };
  
  const handleTimeStartChange = (e) => {
    const selectedTimeStart = e.target.value
    setTimeStart(selectedTimeStart);
  };

  const handleTimeEndChange = (e) => {
    const selectedTimeEnd = e.target.value
    setTimeEnd(selectedTimeEnd);
  };

  const handleGenerate = () => {
    if (frequency === "daily") {
      Papa.parse('/data/timeseries/data_daily.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        delimeter: ",",
        skipEmptyLines: true,
        complete: function(data) {
          results = data.data
          var tstart = new Date(timeStart).getTime()
          var tend = new Date(timeEnd).getTime()
          results = results.filter(d => {
            var time = new Date(d.Date).getTime();
            return (tstart <= time && time <= tend);
           });
          setData(results)
        }
      });
    } else if (frequency === "hourly") {
      Papa.parse('/data/timeseries/data_hourly.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        delimeter: ",",
        skipEmptyLines: true,
        complete: function(data) {
          results = data.data
          var tstart = new Date(timeStart).getTime()
          var tend = new Date(new Date(timeStart).getTime() + 14 * 24 * 60 * 60 * 1000)
          results = results.filter(d => {
            var time = new Date(d.Date).getTime();
            return (tstart <= time && time <= tend);
           });
          setData(results)
        }
      });
    }
  };

  // Placeholder for future data filtering based on time period
  useEffect(() => {
    // Implement logic to filter data based on selected time period
  }, []);

  return(
    
    <div className="timeseries-page">

      <a href="/data-visualization" className="back-arrow">
          &#x2190;
          <span className="back-text">Back to Data Visualization</span>
      </a>

      <div className="title">Sensor Time-Series</div>
      <div>Select one of the highlighted variables, the temporal frequency, and the time period of interest (starting 2021 April) to view sensor observations.</div>

      <div className="timeseries-container">
        
        <div className="dropdown-container">
          
          <label htmlFor="y-axis-select">Y-Axis (Variable):</label>
          <select id="y-axis-select" value={variable} onChange={handleYAxisChange}> 
            <option value="-">-----</option>
            <option value="radiation">Radiation</option>
            <option value="temperature">Temperature</option>
            <option value="wind">Wind Speed</option>
            <option value="vpd">Vapor Pressure Deficit</option>
            <option value="swc">Soil Water Content</option>
            <option value="swp">Soil Water Potential</option>
            <option value="co2">Soil CO2 Flux</option>
          </select>

          <label htmlFor="x-axis-select">X-Axis (Frequency):</label>
          <select id="x-axis-select" value={frequency} onChange={handleXAxisChange}>
            <option value="-">-----</option>
            <option value="daily">Daily Average</option>
            <option value="hourly">Hourly Average (15 days)</option>
          </select>

          {
            frequency === 'daily' ? (
              <React.Fragment>
              <label htmlFor="time-period-start">Start: </label>
              <input type="date" id="date" min="2021-04-07" max={timeEnd}
                    value={timeStart} onChange={handleTimeStartChange}>
              </input>

              <label htmlFor="time-period-end">End: </label>
              <input type="date" id="date" min={timeStart} max={currentDate}
                    value={timeEnd} onChange={handleTimeEndChange}>
              </input>

              <button className="generate-button" onClick={handleGenerate}>Generate</button>
              </React.Fragment>
            ) : frequency === 'hourly' ? (
              <React.Fragment>
              <label htmlFor="time-period-start">Start: </label>
              <input type="date" id="date" min="2021-04-07" max={currentDate}
                    value={timeStart} onChange={handleTimeStartChange}>
              </input>

              <button className="generate-button" onClick={handleGenerate}>Generate</button>
              </React.Fragment>
            ) : (
              <div></div>
            )
          }

        </div>
        
        <div className='description'>
        {
          variable === 'radiation' ? (
            <div>
              <li>Net shortwave and longwave radiation are calculated as downwelling minus upwelling fluxes.</li>
              <li>Net shortwave radiation is determined by incoming solar radiation and surface albedo;  
                  net longwave radiation is affected by temperature, vapor pressure, and cloud coverage.</li>
              <li>Availabe energy (net shortwave + net longwave - soil heat flux) at the surface
                  is the energy to be partitioned into sensible and latent heat fluxes (i.e. turbulent exchange of heat and vapor).</li>
              <li>These fluxes are important components of surface energy balance.</li>
              </div>
          ) : variable === 'temperature' ? (
            <div>
              <li>Temperature gradient is calculated as surface minus air (+2.9 m) temperature.</li>
              <li>Positive gradient (warmer surface) enhances turbulent transfer through buoyancy:
                  typically during warm season and day time.</li>
              <li>Negative gradient (warmer air) hinders turbulent transfer through inversion:
                  typically during cold season and night time.</li>
              <li>These temperature measurements are important for modeling turbulent exchanges at the surface and monitoring canopy stress.</li>
              </div>
          ) : variable === 'wind' ? (
            <div>
              <li>Two-dimensional sonic wind speed measured at +2.9 m from the soil surface</li>
            </div>
          ) : variable === 'vpd' ? (
            <div>
              <li>Vapor pressure deficit (saturated vapor pressure at air temperature T - actual vapor pressure) measured at +2.9 m from the soil surface</li>
            </div>
          ) : variable === 'swc' ? (
            <div>
              <li>Volumetric soil water content averaged from eight soil sensors installed at
                  two lateral locations, each at four depths (-0.1, -0.3, -0.5, -0.7 m)</li>
              </div>
          ) : variable === 'swp' ? (
            <div>
              <li>Soil water potential (i.e. soil suction) averaged from four sensors installed at
                  two lateral locations, each at two soil depths (-0.3, -0.5 m)</li>
              <li>Wetter soil has lower pF value.
                  Conventional values of field capacity (pF=2.5, hPa=-330) and
                  wilting point (pF=4.2, hPa=-15000) are plotted as reference.</li>
              </div>
          ) : variable === 'co2' ? (
            <div>
              <li>Soil CO2 flux is an important component of the terrestrial carbon cycle controlled by
                  temperature, water availability, and biological activities (photosynthesis, root and microbes respiration).</li>
            </div>
          ) : (
            <div>Select a variable</div>
          )
        }
        </div>

        {
          variable === 'radiation' ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data} overflow="visible" margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-30} textAnchor={"end"} />
              <YAxis>
                <Label
                  style={{textAnchor: "middle"}}
                  angle={270}
                  dx={-25}
                  value={yAxisLabel} />
              </YAxis>
              <Tooltip />
              <Legend align="right" verticalAlign="top" />
              <Area dataKey="netShortWave" name="Net Shortwave Radiation"
                    type="monotone" stroke="#E04E39" fill="#E8927C" />
              <Area dataKey="netLongWave" name="Net Longwave Radiation"
                    type="monotone" stroke="#00313C" fill="#007681" />
              <Line dataKey="availableEnergy" name="Available Energy" 
                    type="monotone" stroke="black" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : variable === 'temperature' ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data} overflow="visible" margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-30} textAnchor={"end"} />
              <YAxis>
                <Label
                  style={{textAnchor: "middle"}}
                  angle={270}
                  dx={-25}
                  value={yAxisLabel} />
              </YAxis>
              <Tooltip />
              <Legend align="right" verticalAlign="top" />
              <Line dataKey="airTemp" name="Air Temp" 
                    type="monotone" stroke="#00313C" dot={false} />
              <Area dataKey="gradientTemp" name="Gradient"
                    type="monotone" stroke="#E04E39" fill="#E8927C" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : variable === 'wind' ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data} overflow="visible" margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-30} textAnchor={"end"} />
              <YAxis>
                <Label
                  style={{textAnchor: "middle"}}
                  angle={270}
                  dx={-25}
                  value={yAxisLabel} />
              </YAxis>
              <Tooltip />
              <Legend align="right" verticalAlign="top" />
              <Line dataKey="windSpeed" name="Wind Speed"
                    type="monotone" stroke="#00313C" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : variable === 'vpd' ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data} overflow="visible" margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-30} textAnchor={"end"} />
              <YAxis>
                <Label
                  style={{textAnchor: "middle"}}
                  angle={270}
                  dx={-25}
                  value={yAxisLabel} />
              </YAxis>
              <Tooltip />
              <Legend align="right" verticalAlign="top" />
              <Area dataKey="vaporPressureDeficit" name="Vapor Pressure Deficit"
                    type="monotone" stroke="#E04E39" fill="#E8927C" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : variable === 'swc' ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data} overflow="visible" margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-30} textAnchor={"end"} />
              <YAxis>
                <Label
                  style={{textAnchor: "middle"}}
                  angle={270}
                  dx={-25}
                  value={yAxisLabel} />
              </YAxis>
              <Tooltip />
              <Legend align="right" verticalAlign="top" />
              <Area dataKey="soilWaterContent" name="Volumetric Soil Water Content"
                    type="monotone" stroke="#00313C" fill="#007681" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : variable === 'swp' ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data} overflow="visible" margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-30} textAnchor={"end"} />
              <YAxis domain={[0, 4.2]}>
                <Label
                  style={{textAnchor: "middle"}}
                  angle={270}
                  dx={-25}
                  value={yAxisLabel} />
              </YAxis>
              <Tooltip />
              <Legend align="right" verticalAlign="top" />
              <Area dataKey="soilWaterPotential" name="Soil Water Potential"
                    type="monotone" stroke="#E04E39" fill="#E8927C" />
              <ReferenceLine y={2.5} stroke="#00313C" ifOverflow="visible">
                <Label value="Field Capacity" fill="black" position="insideTopLeft"/>
              </ReferenceLine>
              <ReferenceLine y={4.2} stroke="#672E45" ifOverflow="visible">
                <Label value="Wilting Point" fill="black" position="insideTopLeft"/>
              </ReferenceLine>
              </ComposedChart>
            </ResponsiveContainer>
          ) : variable === 'co2' ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data} overflow="visible" margin={{ top: 20, right: 10, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-30} textAnchor={"end"} />
              <YAxis>
                <Label
                  style={{textAnchor: "middle"}}
                  angle={270}
                  dx={-25}
                  value={yAxisLabel} />
              </YAxis>
              <Tooltip />
              <Legend align="right" verticalAlign="top" />
              <Area dataKey="soilCO2Flux0" name="Soil CO2 Flux (Location 0)"
                    type="monotone" stroke="#00313C" fill="#007681" />
              <Area dataKey="soilCO2Flux1" name="Soil CO2 Flux (Location 1)"
                    type="monotone" stroke="#E04E39" fill="#E8927C" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div></div>
          )
        }

      </div>

  </div>

  );

}

export default SensorTimeSeriesPage; /* this component will be referenced by that name */