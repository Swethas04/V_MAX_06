import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_DISTRICT_HEAT, MOCK_CATEGORIES } from '../api';
import { Layers } from 'lucide-react';

// Fix Leaflet default marker icons in React
const customMarkerIcon = (count: number) => {
  const size = Math.min(48, Math.max(30, 24 + count * 0.6));
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${count > 25 ? '#d32f2f' : count > 15 ? '#f57c00' : '#1a6b3c'};
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size > 36 ? '13px' : '11px'};
        font-weight: 800;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export const Heatmap: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Jharkhand center
  const JHARKHAND_CENTER: [number, number] = [23.6102, 85.2799];

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '14px 20px',
        borderRadius: '14px',
        border: '1px solid var(--border)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--primary)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
            GIS Layer: Jharkhand Civic Hotspots
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Domain Filter:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: '#f8faf8',
              color: 'var(--text-main)',
            }}
          >
            <option value="all">All Domains (142)</option>
            {MOCK_CATEGORIES.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map & District Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '18px', flex: 1, minHeight: 0 }}>
        {/* Leaflet Map */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
        }}>
          <MapContainer
            center={JHARKHAND_CENTER}
            zoom={8}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {MOCK_DISTRICT_HEAT.map((d) => (
              <Marker
                key={d.district}
                position={[d.lat, d.lng]}
                icon={customMarkerIcon(d.count)}
                eventHandlers={{
                  click: () => setSelectedDistrict(d.district),
                }}
              >
                <Popup>
                  <div style={{ padding: '4px', minWidth: '160px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 4px', color: '#1a6b3c' }}>
                      {d.district}
                    </h4>
                    <p style={{ fontSize: '12px', margin: '2px 0', color: '#444' }}>
                      Reported Challenges: <strong>{d.count}</strong>
                    </p>
                    <p style={{ fontSize: '12px', margin: '2px 0', color: '#2e7d32' }}>
                      Resolved: <strong>{d.resolved}</strong>
                    </p>
                    <div style={{
                      marginTop: '8px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#f0f7f0',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#1a6b3c',
                    }}>
                      Primary Need: Water & Mining Env
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend Floating Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            fontSize: '11.5px',
          }}>
            <p style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
              Jharkhand Problem Density
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d32f2f' }} />
                <span>Critical Density (&gt; 25 reports)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f57c00' }} />
                <span>Medium Density (15-25 reports)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1a6b3c' }} />
                <span>Moderate Density (&lt; 15 reports)</span>
              </div>
            </div>
          </div>
        </div>

        {/* District Breakdown List */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '4px', color: 'var(--text-main)' }}>
            District Problem Distribution
          </h4>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Click a district to focus on GIS map
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_DISTRICT_HEAT.map((d) => {
              const isSelected = selectedDistrict === d.district;
              return (
                <div
                  key={d.district}
                  onClick={() => setSelectedDistrict(d.district)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid #edf2ed',
                    backgroundColor: isSelected ? 'rgba(26, 107, 60, 0.05)' : '#fcfdfc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {d.district}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: d.count > 25 ? '#d32f2f' : '#1a6b3c',
                    }}>
                      {d.count} issues
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Resolved: {d.resolved}</span>
                    <span>Rate: {Math.round((d.resolved / d.count) * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
