import './ETPageAnalyticalSection.css'; // Ensure that the CSS file is linked
import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Area,
  XAxis, YAxis, Label,
  CartesianGrid, Tooltip, Legend,
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

// colors
const aColor = "#007681" // color for "analytical"
const hColor = "#63666A" // color for "hybrid"
const mColor = "#E04E39" // color for "mass balance"
const activeAlpha = 0.9
const inactiveAlpha = 0.1
const mAlpha = 0.75
const inactiveStroke = "none"

function AnalyticalSection () {

  const [data, setData] = useState([]);
  let results;
  
  useEffect(() => {
    // parse data
    Papa.parse('/data/timeseries/prediction_testbed.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      delimeter: ",",
      skipEmptyLines: true,
      complete: function(data) {
        // select relevant columns
        results = data.data.map(({ 
          datetime, et_mb_lc, et_pm_mo }) => ({ 
          datetime, et_mb_lc, et_pm_mo }));
        // format time
        var time = new Date(results.datetime).getTime();
        results = results.map(d => ({
          datenum: new Date(d.datetime).getTime(), ...d
        }));
        results = results.filter(d => {
          return (0 <= d.et_pm_mo);
        });
        setData(results)
      }
    });

  }, []);

  return(
      <section className="analytical-section">
          <div className="analytical-all">
              <h2 className="analytical-title">Penman-Monteith Model</h2>
              <h5 className="analytical-title">A widely adopted equation with analytical solutions to estimate evapotranpsiration in ecosystem models</h5>
              <div className="analytical-pm-image-container">
                  <img src={'/assets/pm.png'} // https://smartsoils-testbed.s3.amazonaws.com
                  />
              </div>
              <div className="analytical-pm-description-bullets">
                  <ul>
                      <li>Model Inputs: Penman-Monteith Model, a resistor analog for vapor transfer,
                          requires <strong>environmental drivers for ET</strong> (i.e. radiation, temperature, vapor, wind) and
                          two terms describing the <strong>resistance to water flux </strong>
                          (1) via the soil and canopy pathways <em>(surface resistance, rs)</em> and
                          (2) in the boundary layer <em>(aerodynamic resistance, ra)</em>.</li>
                      <li><strong>Analytical Solutions</strong>: While the environmental variables are directly measurable,
                          the characterization of the resistance terms relies on semi-empirical parametrization or empirical relationships established by literature.</li>
                  </ul>
              </div>
              <div className="analytical-plots">
                  <h5 className="analytical-title">SMARTSoils Testbed reveals mismatch between observed and modeled ET</h5>
                  <div className="analytical-plot-description-bullets">
                      <ul>
                          <li>Compared to the ground truth ET (mass balance analysis from daily load change),
                              the modeled ET has an overall mismatch of mean absolute error = 0.92 [mm/d] (r2 = 0.68).</li>
                          <li>Testbed provides benchmarking datasets to examine the parametrization of the PM resistance terms.</li>
                      </ul>
                  </div>
                  <div className="analytical-timelapse">
                      <h5 className="analytical-title">SMARTSoils Testbed</h5>
                      <ResponsiveContainer debounce={200} width="99%" height={300}>
                          <ComposedChart data={data}
                                          margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="datenum" type="number"
                                  domain={['datamin', 'datamax']}
                                  ticks={timeTicks}
                                  tickFormatter = {(unixTime) => moment(unixTime).format('YY-MMM')}
                                  angle={-30} textAnchor={"end"}/>
                          <YAxis type="number" domain={[0, 12]} overflow={'hidden'}>
                              <Label style={{textAnchor: "middle"}} angle={270} dx={-25} value={"Daily ET [mm/d]"} />
                          </YAxis>
                          <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                          <Area dataKey="et_pm_mo" name="PM (Analytical)" 
                              type="number" stroke={aColor} fill={aColor} fillOpacity={activeAlpha} />
                          <Area dataKey="et_mb_lc" name="Mass Balance (Load)" 
                              type="number" stroke={mColor} fill={mColor} fillOpacity={mAlpha} />
                          </ComposedChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      </section>
  )

}

export default AnalyticalSection;