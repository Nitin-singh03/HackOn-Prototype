import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_BACKEND_URL;

import axios from "axios";
import {
  TreeDeciduous as Tree,
  Gift,
  TrendingUp,
  PieChart as PieIcon,
  Award,
  Leaf
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import '../Css/Dashboard.css';

// canopy levels definition
const levels = [
  { name: "Seedling", min: 0, max: 499, icon: "🌱" },
  { name: "Sapling", min: 500, max: 999, icon: "🌿" },
  { name: "Young Grove", min: 1000, max: 1499, icon: "🪴" },
  { name: "Forest", min: 1500, max: 2499, icon: "🌲" },
  { name: "Canopy", min: 2500, max: 3999, icon: "🌴" },
  { name: "Rainforest", min: 4000, max: 5999, icon: "🌳" },
];

// sample chart data (you may replace these with dynamic data as needed)
const co2Data = [
  { name: "Jan", CO2: 12 },
  { name: "Feb", CO2: 9 },
  { name: "Mar", CO2: 14 },
  { name: "Apr", CO2: 10 },
  { name: "May", CO2: 16 }
];
const gradeDistribution = [
  { name: "A+", value: 40 },
  { name: "A", value: 30 },
  { name: "B", value: 20 },
  { name: "C", value: 10 }
];
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [geckoPoints, setGeckoPoints] = useState(0);
  const [canopyCoins, setCanopyCoins] = useState(0);
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [certificates, setCertificates] = useState([]);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${API_BASE}/api/bought/full`);
        const records = res.data; // expected: array of objects: { productId, qty, totalCanopy, totalGecko }
        console.log("Fetched records:", records);

        // Sum totalGecko and totalCanopy directly from each record:
        const totalGeckoSum = records.reduce((sum, r) => sum + (r.totalGecko || 0), 0);
        const totalCanopySum = records.reduce((sum, r) => sum + (r.totalCanopy || 0), 0);

        // Trees planted logic: e.g., 1 tree per 200 canopy coins
        const planted = Math.floor(totalCanopySum / 200);

        setGeckoPoints(totalGeckoSum);
        setCanopyCoins(totalCanopySum);
        setTreesPlanted(planted);

        // Generate dummy certificates for each planted tree:
        // Hardcoded example URLs; ensure corresponding PDF files exist under /public/certs
        setCertificates(Array.from({ length: planted }, (_, i) => ({
          id: i,
          location: i % 2 ? 'Tropical Forest' : 'Amazon Rainforest',
          date: i % 2 ? '2025-04-08' : '2025-05-12',
          url: `/certs/TREE-${(i % 2) ? 2 : 1}.pdf` // e.g., place TREE-1.pdf, TREE-2.pdf in public/certs
        })));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }
    fetchData();
  }, []);

  // Redeem handler for Gecko Points
  const handleRedeem = () => {
    if (geckoPoints <= 0) {
      alert('No Gecko Points to redeem.');
      return;
    }
    navigate('/redeem');
  };

  // Determine current canopy level based on canopyCoins:
  const currentLevel = levels.find(l => canopyCoins >= l.min && canopyCoins <= l.max) || levels[0];
  const inLevel = canopyCoins - currentLevel.min;
  const levelRange = currentLevel.max - currentLevel.min;
  const progress = levelRange > 0 ? Math.min(100, (inLevel / levelRange) * 100) : 100;

  // Compute cumulative CO2 for line chart:
  const cumulative = co2Data.map((d, i) => ({
    name: d.name,
    total: co2Data.slice(0, i + 1).reduce((s, x) => s + x.CO2, 0)
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <Leaf className="title-icon" />
          Amazon Green Dashboard
        </h1>
        <p className="dashboard-subtitle">Track your environmental impact and rewards</p>
      </div>

      {/* Top Cards: Level, Gecko Points (with redeem button), Trees Planted */}
      <div className="top-cards">
        <div className="card level-card">
          <div className="card-header">
            <h3>Current Level</h3>
          </div>
          <div className="level-content">
            <div className="level-display">
              <span className="level-icon">{currentLevel.icon}</span>
              <div className="level-text">
                <h2>{currentLevel.name}</h2>
                <small>Next: {currentLevel.max} TP</small>
              </div>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-text">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        <div className="card points-card">
          <div className="card-header">
            <h3>Gecko Coins</h3>
          </div>
          <div className="points-content">
            <div className="points-display">
              <img src="/images/gecko_coin.png" alt="Gecko Coin" className="gecko-icon" />
              <p className="points-value">{geckoPoints}</p>
            </div>
            <button
              className="redeem-button"
              onClick={handleRedeem}
              disabled={isRedeeming || geckoPoints <= 0}
            >
              {isRedeeming ? 'Redeeming...' : 'Redeem Now'}
            </button>
          </div>
        </div>

        <div className="card trees-card">
          <div className="card-header">
            <h3>Trees Planted</h3>
          </div>
          <div className="trees-content">
            <Tree className="trees-icon" />
            <div className="trees-display">
              <p className="points-value">{treesPlanted}</p>
              <small>Making a difference</small>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Certificates & Eco Stats */}
      <div className="middle-section">
        <div className="card certificates">
          <div className="card-header">
            <h3>
              <Award className="header-icon" />
              Certificates
            </h3>
          </div>
          <div className="cert-list">
            {certificates.length > 0 ? (
              certificates.map(c => (
                <div key={c.id} className="cert-item">
                  <div className="cert-info">
                    <span className="cert-location">{c.location}</span>
                    <small className="cert-date">{c.date}</small>
                  </div>
                  <a href={c.url} download className="download-button">
                    Download
                  </a>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Award className="empty-icon" />
                <p>No certificates yet</p>
                <small>Plant more trees to earn certificates</small>
              </div>
            )}
          </div>
        </div>

        <div className="card eco-stats">
          <div className="card-header">
            <h3>
              <Leaf className="header-icon" />
              Eco Stats
            </h3>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <strong>61kg</strong>
              <span>CO₂ Saved</span>
            </div>
            <div className="stat-item">
              <strong>2.4kg</strong>
              <span>Plastic Avoided</span>
            </div>
            <div className="stat-item">
              <strong>38%</strong>
              <span>Recycled</span>
            </div>
            <div className="stat-item">
              <strong>2</strong>
              <span>Group Buys</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts: CO₂ Reduction, Eco-Grade Distribution, Cumulative CO₂ */}
      <div className="bottom-charts">
        <div className="card chart-card">
          <div className="card-header">
            <h3>
              <TrendingUp className="header-icon" />
              CO₂ Reduction
            </h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={co2Data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  unit="kg" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Tooltip 
                  formatter={v => [`${v}kg`, 'CO₂ Saved']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="CO2" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3>
              <PieIcon className="header-icon" />
              Eco-Grade Distribution
            </h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {gradeDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={v => [`${v}%`, 'Grade']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3>
              <TrendingUp className="header-icon" />
              Cumulative CO₂
            </h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={cumulative} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Tooltip 
                  formatter={v => [`${v}kg`, 'Total CO₂ Saved']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  dataKey="total" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}