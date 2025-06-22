// File: AmazonGreenDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.BACKEND_URL;

import axios from "axios";
import {
  TreeDeciduous as Tree,
  Gift,
  TrendingUp,
  PieChart as PieIcon
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
const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'];
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
      fontSize={14}
      fontWeight="bold"
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
      <h1>Amazon Green Dashboard</h1>

      {/* Top Cards: Level, Gecko Points (with redeem button), Trees Planted */}
      <div className="top-cards">
        <div className="card level-card">
          <div className="level-content">
            <span className="level-icon">{currentLevel.icon}</span>
            <div className="level-text">
              <h2>{currentLevel.name}</h2>
              <small>Next: {currentLevel.max} TP</small>
            </div>
            <div className="progress-bar">
              <div className="fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="card points-card">
          <div className="points-content">
            <img src="/images/gecko_coin.png" alt="Gecko Coin" className="gecko-icon" />
            <div className="points-text">
              <h2>Gecko Coins</h2>
              <p className="points-value">{geckoPoints} pts</p>
            </div>
          </div>
          <button
            className="redeem-button"
            onClick={handleRedeem}
            disabled={isRedeeming || geckoPoints <= 0}
          >
            {isRedeeming ? 'Redeeming...' : 'Redeem'}
          </button>
        </div>

        <div className="card trees-card">
          <div className="trees-content">
            <Tree className="icon" />
            <div>
              <h2>Trees Planted</h2>
              <p className="points-value">{treesPlanted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Certificates & Eco Stats */}
      <div className="middle-section">
        <div className="certificates card">
          <h3>Certificates</h3>
          <div className="cert-list">
            {certificates.length > 0 ? (
              certificates.map(c => (
                <div key={c.id} className="cert-item">
                  <div className="cert-info">
                    <span>{c.location}</span>
                    <small>{c.date}</small>
                  </div>
                  <a href={c.url} download className="download-button">Download</a>
                </div>
              ))
            ) : (
              <p>No certificates yet</p>
            )}
          </div>
        </div>

        <div className="eco-stats card">
          <h3>Eco Stats</h3>
          <div className="stats-grid">
            <div><strong>61kg</strong><span>CO₂ Saved</span></div>
            <div><strong>2.4kg</strong><span>Plastic Avoided</span></div>
            <div><strong>38%</strong><span>Recycled</span></div>
            <div><strong>2</strong><span>Group Buys</span></div>
          </div>
        </div>
      </div>

      {/* Bottom Charts: CO₂ Reduction, Eco-Grade Distribution, Cumulative CO₂ */}
      <div className="bottom-charts">
        <div className="card chart-card">
          <h3><TrendingUp /> CO₂ Reduction</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={co2Data}>
              <XAxis dataKey="name" />
              <YAxis unit="kg" />
              <Tooltip formatter={v => `${v}kg`} />
              <Bar dataKey="CO2" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3><PieIcon /> Eco-Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {gradeDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3>Cumulative CO₂</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cumulative}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={v => `${v}kg`} />
              <Line dataKey="total" stroke="#22C55E" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
