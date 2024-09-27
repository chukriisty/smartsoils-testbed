// TimeSeriesPlot.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TimeSeriesPlot.css';

// Mock data for different frequencies
const mockHourlyData = [
  { time: '01:00', sensorA: 120, sensorB: 85 },
  { time: '02:00', sensorA: 150, sensorB: 90 },
  { time: '03:00', sensorA: 130, sensorB: 95 },
  // More hourly data...
];

const mockDailyData = [
  { time: '2024-01-01', sensorA: 200, sensorB: 150 },
  { time: '2024-01-02', sensorA: 180, sensorB: 160 },
  { time: '2024-01-03', sensorA: 220, sensorB: 170 },
  // More daily data...
];

const mockMonthlyData = [
  { time: 'January', sensorA: 400, sensorB: 300 },
  { time: 'February', sensorA: 300, sensorB: 200 },
  { time: 'March', sensorA: 200, sensorB: 278 },
  { time: 'April', sensorA: 278, sensorB: 189 },
  { time: 'May', sensorA: 189, sensorB: 239 },
  { time: 'June', sensorA: 239, sensorB: 349 },
  { time: 'July', sensorA: 349, sensorB: 200 },
  { time: 'August', sensorA: 278, sensorB: 189 },
  { time: 'September', sensorA: 400, sensorB: 240 },
  { time: 'October', sensorA: 320, sensorB: 220 },
  { time: 'November', sensorA: 180, sensorB: 320 },
  { time: 'December', sensorA: 430, sensorB: 210 }
];

const TimeSeriesPlot = () => {
  const [yAxis, setYAxis] = useState('sensorA');
  const [xAxis, setXAxis] = useState('monthly');
  const [timePeriod, setTimePeriod] = useState('all');
  const [data, setData] = useState(mockMonthlyData); // Default to monthly data

  const handleYAxisChange = (e) => {
    setYAxis(e.target.value);
  };

  const handleXAxisChange = (e) => {
    const selectedFrequency = e.target.value;
    setXAxis(selectedFrequency);

    // Simulate loading different data sets
    if (selectedFrequency === 'hourly') {
      setData(mockHourlyData);
    } else if (selectedFrequency === 'daily') {
      setData(mockDailyData);
    } else {
      setData(mockMonthlyData);
    }
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  // Placeholder for future data filtering based on time period
  useEffect(() => {
    // Implement logic to filter data based on selected time period
  }, [timePeriod]);

  return (
    <div className="timeseries-container">
      <div className="dropdown-container">
        <label htmlFor="y-axis-select">Y-Axis (Sensor):</label>
        <select id="y-axis-select" value={yAxis} onChange={handleYAxisChange}>
          <option value="sensorA">Sensor A</option>
          <option value="sensorB">Sensor B</option>
          {/* Add more sensors as needed */}
        </select>

        <label htmlFor="x-axis-select">X-Axis (Frequency):</label>
        <select id="x-axis-select" value={xAxis} onChange={handleXAxisChange}>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>

        <label htmlFor="time-period-select">Time Period:</label>
        <select id="time-period-select" value={timePeriod} onChange={handleTimePeriodChange}>
          <option value="all">All</option>
          <option value="last6months">Last 6 Months</option>
          <option value="lastYear">Last Year</option>
          {/* Add more time periods as needed */}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesPlot; /* this component will be referenced by that name */