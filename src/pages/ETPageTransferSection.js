import './ETPageTransferSection.css'; // Ensure that the CSS file is linked
import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Scatter, Line, Area,
  XAxis, YAxis, Label,
  CartesianGrid, Legend,
  ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import moment from 'moment'

// one-to-one line
const one2one = [
  {et_mb_swc:0 , "1:1":0},
  {et_mb_swc:9 , "1:1":9}
]

// time filters and ticks
const doyStart = 105
const doyEnd = 288
const timeStart = new Date("2020-05-01").getTime()
const timeEnd = new Date("2023-10-01").getTime()
const timeTicks = [
  new Date("2020-05-02").getTime(),
  new Date("2020-10-02").getTime(),
  new Date("2021-05-02").getTime(),
  new Date("2021-10-02").getTime(),
  new Date("2022-05-02").getTime(),
  new Date("2022-10-02").getTime(),
  new Date("2023-05-02").getTime(),
  new Date("2023-10-02").getTime(),
];

// colors
const aColor = "#007681" // color for "analytical"
const hColor = "#63666A" // color for "hybrid"
const mColor = "#E04E39" // color for "mass balance"
const activeAlpha = 0.9
const inactiveAlpha = 0.1
const mAlpha = 0.75
const inactiveStroke = "none"

function TransferSection() {

  // data
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  let results;
  const [mae1, setMAE1] = useState("MAE")
  const [mae2, setMAE2] = useState("MAE")
  // visualization
  const [aAlpha, set_aAlpha] = useState(inactiveAlpha)
  const [hAlpha, set_hAlpha] = useState(inactiveAlpha)
  const [aStroke, set_aStroke] = useState(inactiveStroke)
  const [hStroke, set_hStroke] = useState(inactiveStroke)
  
  useEffect(() => {
    // Parse data1
    Papa.parse('/data/timeseries/prediction_ER-PHS1.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      delimeter: ",",
      skipEmptyLines: true,
      complete: function(data) {
        // select relevant columns
        results = data.data.map(({ 
          datetime, doy, et_mb_swc, et_pm_mo, et_pm_ml_mean }) => ({ 
          datetime, doy, et_mb_swc, et_pm_mo, et_pm_ml_mean }));
        // format time
        results = results.map(d => ({
          datenum: new Date(d.datetime).getTime(), ...d
        }));
        // filter time
        results = results.filter(d => {
          return (timeStart <= d.datenum && d.datenum <= timeEnd);
          });
        results = results.filter(d => {
          return (doyStart <= d.doy && d.doy <= doyEnd);
          }); 
        setData1(results)
      }
    });
    // Parse data2
    Papa.parse('/data/timeseries/prediction_ER-PHS2.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      delimeter: ",",
      skipEmptyLines: true,
      complete: function(data) {
        // select relevant columns
        results = data.data.map(({ 
          datetime, doy, et_mb_swc, et_pm_mo, et_pm_ml_mean }) => ({ 
          datetime, doy, et_mb_swc, et_pm_mo, et_pm_ml_mean }));
        // format time
        results = results.map(d => ({
          datenum: new Date(d.datetime).getTime(), ...d
        }));
        // filter time
        results = results.filter(d => {
          return (timeStart <= d.datenum && d.datenum <= timeEnd);
          });
        results = results.filter(d => {
          return (doyStart <= d.doy && d.doy <= doyEnd);
          }); 
        setData2(results)
      }
    });
  }, []);

  const handleModel = (e) => {
    const selectedTick = e.target.value;
    if (selectedTick === "analytical") {
      set_aAlpha(activeAlpha)
      set_hAlpha(inactiveAlpha)
      set_aStroke(aColor)
      set_hStroke(inactiveStroke)
      setMAE1("MAE 1.41 [mm/d]")
      setMAE2("MAE 1.71 [mm/d]")
    } else if (selectedTick === "hybrid") {
      set_aAlpha(inactiveAlpha)
      set_hAlpha(activeAlpha)
      set_aStroke(inactiveStroke)
      set_hStroke(hColor)
      setMAE1("MAE 0.82 [mm/d]")
      setMAE2("MAE 1.08 [mm/d]")
    }
  }

  return(
    <section className="transfer-section">
        <div className="transfer-description">
            <h2 className="transfer-title">Model Transferability</h2>
            <h5 className="transfer-title">Improving field ET prediction with the hybrid model developed from SMARTSoils Testbed</h5>
            <div className="transfer-image-container">
                <img src={'https://smartsoils-testbed.s3.amazonaws.com/assets/field_low.png'}
                />
            </div>
            <div className="transfer-description-bullets">
                <ul>
                    <li>Two shrub-dominating hillslope sites with a simplified sensor suite at the East River Watershed, Crested Butte, Colorado (Watershed Function SFA) were selected to evaluate the applicability of the hyrbid model.</li>
                    <li>Mass balance ET calculated from daily changes in the measured soil water content was taken as the observed daily ET for evaluating model performance.</li>
                    <li>Daily ET predictions from the analytical and hybrid PM models were compared against mass balance ET during snow-free periods, with the mean difference between the modeled and observed ET reported as MAE.</li>
                </ul>
            </div>
            <div className="transfer-plots">
                <div className="transfer-model-options">
                    <legend>Select ET prediction based on</legend>
                    <input className="transfer-radio" type="radio" id="analytical" name="model" value="analytical" onClick={handleModel}/>
                    <label className="transfer-radio-text" for="analytical">Analytical Solutions</label>
                    <input className="transfer-radio" type="radio" id="hybrid" name="model" value="hybrid" onClick={handleModel}/>
                    <label className="transfer-radio-text" for="hybrid">Hybrid Solutions</label>
                </div>
                <div>
                    <h5 className="transfer-title">Time-Series: Modeled vs Observed ET</h5>
                </div>
                <div>
                    <h5 className="transfer-title">Overall Comparison</h5>
                </div>
                <div className="transfer-timelapse">
                    <h6>Site 1: Shrub, NE-Facing Hillslope</h6>
                    <ResponsiveContainer debounce={200} width="99%" height={225}>
                        <ComposedChart data={data1} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="datenum"
                              type="number"
                              domain={[timeStart, timeEnd]}
                              ticks={timeTicks}
                              tickFormatter = {(unixTime) => moment(unixTime).format('YY-MMM')}
                              angle={-30}
                              textAnchor={"end"}/>
                        <YAxis domain={[0,9]}>
                            <Label style={{textAnchor: "middle"}} angle={270} dx={-25} value={"Daily ET [mm/d]"} />
                        </YAxis>
                        <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                        <Area dataKey="et_pm_mo" name="PM (Analytical)" 
                                type="number" stroke={aStroke} fill={aColor} fillOpacity={aAlpha} />
                        <Area dataKey="et_pm_ml_mean" name="PM (Hybrid)" 
                                type="number" stroke={hStroke} fill={hColor} fillOpacity={hAlpha} />
                        <Area dataKey="et_mb_swc" name="Mass Balance (SWC)" 
                                type="number" stroke={mColor} fill={mColor} fillOpacity={mAlpha} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="transfer-mismatch">
                    <h6>Site 1: {mae1}</h6>
                    <ResponsiveContainer debounce={200} width="99%" height={225} >
                        <ComposedChart margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="et_mb_swc" type="number" domain={[0,9]}>
                            <Label style={{textAnchor: "middle", fill: aColor}} dy={25} value={"Mass Balance"} />
                        </XAxis>
                        <YAxis domain={[0,9]}>
                            <Label style={{textAnchor: "middle"}} angle={270} dx={-15} value={"Modeled"} />
                        </YAxis>
                        <Line data={one2one} dataKey="1:1" stroke="#000000" dot={false} />
                        <Scatter data={data1} dataKey="et_pm_mo" name="PM (Analytical)" 
                                type="number" fill={aColor} fillOpacity={aAlpha} isAnimationActive={false} />
                        <Scatter data={data1} dataKey="et_pm_ml_mean" name="PM (Hybrid)" 
                                type="number" fill={hColor} fillOpacity={hAlpha} isAnimationActive={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="transfer-timelapse">
                    <h6>Site 2: Shrub, SW-Facing Hillslope</h6>
                    <ResponsiveContainer debounce={200} width="99%" height={225}>
                        <ComposedChart data={data2} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="datenum"
                              type="number"
                              domain={[timeStart, timeEnd]}
                              ticks={timeTicks}
                              tickFormatter = {(unixTime) => moment(unixTime).format('YY-MMM')}
                              angle={-30}
                              textAnchor={"end"}/>
                        <YAxis domain={[0,9]}>
                            <Label style={{textAnchor: "middle"}} angle={270} dx={-25} value={"Daily ET [mm/d]"} />
                        </YAxis>
                        <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                        <Area dataKey="et_pm_mo" name="PM (Analytical)" 
                                type="number" stroke={aStroke} fill={aColor} fillOpacity={aAlpha} />
                        <Area dataKey="et_pm_ml_mean" name="PM (Hybrid)" 
                                type="number" stroke={hStroke} fill={hColor} fillOpacity={hAlpha} />
                        <Area dataKey="et_mb_swc" name="Mass Balance (SWC)" 
                                type="number" stroke={mColor} fill={mColor} fillOpacity={mAlpha} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="transfer-mismatch">
                    <h6>Site 2: {mae2}</h6>
                    <ResponsiveContainer debounce={200} width="99%" height={225} >
                        <ComposedChart margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="et_mb_swc" type="number" domain={[0,9]}>
                            <Label style={{textAnchor: "middle", fill: aColor}} dy={25} value={"Mass Balance"} />
                        </XAxis>
                        <YAxis domain={[0,9]}>
                            <Label style={{textAnchor: "middle"}} angle={270} dx={-15} value={"Modeled"} />
                        </YAxis>
                        <Line data={one2one} dataKey="1:1" stroke="#000000" dot={false} />
                        <Scatter data={data2} dataKey="et_pm_mo" name="PM (Analytical)" 
                                type="number" fill={aColor} fillOpacity={aAlpha} isAnimationActive={false} />
                        <Scatter data={data2} dataKey="et_pm_ml_mean" name="PM (Hybrid)" 
                                type="number" fill={hColor} fillOpacity={hAlpha} isAnimationActive={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="transfer-model-bullets">
                    <ul>
                        <li>While the machine learning model to the PM resistance terms were not trained on these field data, the mismatch between modeled and observed ET was reduced, especially during early vegetation growth and senescence.</li>
                        <li>Further investigation into re-parametrizing the analytical model using the hybrid approach could improve model transferability.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
  )

}

export default TransferSection