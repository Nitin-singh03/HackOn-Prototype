import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Users, DollarSign } from 'lucide-react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import '../Css/JoinGroup.css';

// Hardcoded "my" location near Delhi
const MY_LOCATION = [28.645, 77.215];

// Hardcoded group data near Delhi
const GROUPS = [
  { id: 'grp1', name: 'Gadget Collectors', joined: 4, threshold: 2000, location: 'Connaught Place', totalAmount: 2000, lat: 28.6315, lng: 77.2167 },
  { id: 'grp2', name: 'Organic Veggies Co-op', joined: 6, threshold: 2000, location: 'Lajpat Nagar', totalAmount: 3600, lat: 28.5630, lng: 77.2430 },
  { id: 'grp3', name: 'Home Essentials Hub', joined: 8, threshold: 2000, location: 'Karol Bagh', totalAmount: 4800, lat: 28.6515, lng: 77.1887 }
];

// Configure default Leaflet icon paths
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// Haversine formula for distance in meters
function getDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function JoinGroup() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Receive items, coins, cost from BuyOptions
  const items = state?.items || [];
  const coins = state?.coins || { gecko: 0, canopy: 0 };
  const cost = state?.cost || { subtotal: 0, shipping: 0, total: 0 };

  const [nearby, setNearby] = useState([]);
  const [selected, setSelected] = useState(null);

  // Distinct colours for group markers
  const colours = ['#e74c3c', '#27ae60', '#f1c40f'];

  // Compute radius so all groups within
  const distances = GROUPS.map(g => getDistance(MY_LOCATION, [g.lat, g.lng]));
  const radius = Math.max(...distances) + 500;
  const bounds = [MY_LOCATION, ...GROUPS.map(g => [g.lat, g.lng])];

  // On mount, filter
  useEffect(() => {
    const filtered = GROUPS.filter((_, idx) => distances[idx] <= radius);
    const list = filtered.length ? filtered : GROUPS;
    setNearby(list);
    setSelected(list[0]);
  }, []);

  const handleJoin = () => {
    if (selected) {
      navigate('/create-group', {
        state: { 
          group: selected,
          items,
          coins,
          cost
        }
      });
    }
  };

  const selIdx = selected ? nearby.findIndex(g => g.id === selected.id) : 0;
  const selColor = colours[selIdx % colours.length];

  return (
    <div className="jg-container">
      {/* List Panel */}
      <div className="jg-list-panel">
        <h2 style={{ color: selColor }}>Nearby Groups</h2>
        {nearby.map((grp, idx) => (
          <div
            key={grp.id}
            className={`jg-card ${selected?.id === grp.id ? 'selected' : ''}`}
            onClick={() => setSelected(grp)}
            style={selected?.id === grp.id ? { borderColor: selColor } : {}}
          >
            <h3 style={{ color: selected?.id === grp.id ? selColor : '#333' }}>{grp.name}</h3>
            <div className="jg-info"><Users className="jg-icon"/><span>{grp.joined} joined</span></div>
            <div className="jg-info"><MapPin className="jg-icon"/><span>{grp.location}</span></div>
            <div className="jg-info"><DollarSign className="jg-icon"/><span>₹{grp.totalAmount}</span></div>
          </div>
        ))}
        <button
          className="jg-join-button"
          onClick={handleJoin}
          disabled={!selected}
          style={{ backgroundColor: selColor }}
        >
          Join Selected Group
        </button>
      </div>

      {/* Map Panel */}
      <div className="jg-detail-panel">
        <MapContainer
          bounds={bounds}
          className="jg-map"
          style={{ width: '70%', height: '300px', margin: '1rem auto', border: `2px solid ${selColor}`, borderRadius: '8px' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <CircleMarker center={MY_LOCATION} radius={12} pathOptions={{ color: '#2980b9', fillColor: '#2980b9', fillOpacity: 0.7 }}>
            <Popup>My Location</Popup>
          </CircleMarker>
          <Circle center={MY_LOCATION} radius={radius} pathOptions={{ color: selColor, fillOpacity: 0.1 }}/>
          {nearby.map((grp, idx) => (
            <CircleMarker
              key={grp.id}
              center={[grp.lat, grp.lng]}
              radius={10}
              pathOptions={{ color: colours[idx], fillColor: colours[idx], fillOpacity: 0.9 }}
              eventHandlers={{ click: () => setSelected(grp) }}
            >
              <Popup>{grp.name}</Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        {selected && (
          <div className="jg-summary" style={{ borderLeft: `4px solid ${selColor}`, paddingLeft: '1rem' }}>
            <h2 style={{ color: selColor }}>{selected.name}</h2>
            <div><Users className="jg-icon"/> Participants: {selected.joined}</div>
            <div><DollarSign className="jg-icon"/> ₹{selected.totalAmount}</div>
            <div><MapPin className="jg-icon"/> {selected.location}</div>
          </div>
        )}
      </div>
    </div>
  );
}
