// src/components/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [readings, setReadings] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchReadings = async () => {
    try {
      const res = await API.get('/energy-data/');
      const sorted = [...res.data].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setReadings(sorted.slice(-10)); // last 10 readings
    } catch (err) {
      console.error('Error fetching readings:', err);
    }
  };

  useEffect(() => {
    fetchReadings();
    const id = setInterval(fetchReadings, 5000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await API.post(
        '/auth/token/logout/',
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('login', { replace: true });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Energy Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="charts-container">
        <h3 className="chart-title">Live Energy Metrics</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={readings}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <YAxis />
            <Tooltip

            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="power"
              stroke="#8884d8"
              name="Power (W)"
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#82ca9d"
              name="Voltage (V)"
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#ffc658"
              name="Current (A)"
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#ff7300"
              name="Energy (kWh)"
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
