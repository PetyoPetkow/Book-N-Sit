import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Remove default icon settings
delete L.Icon.Default.prototype._getIconUrl;

// Custom marker icons for different resolutions
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ lat, lng, setCoordinates, draggable }) => {
  // Initialize state with props for latitude and longitude
  const [position, setPosition] = useState([lat, lng]);

  // Effect to update position when props change
  useEffect(() => {
    setCoordinates([lat, lng]);
  }, [lat, lng]);

  // Handlers to update latitude and longitude from inputs
  const handleLatChange = (e) => {
    const lat = parseFloat(e.target.value);
    if (!isNaN(lat)) {
      setCoordinates([lat, position[1]]);
    }
  };

  const handleLngChange = (e) => {
    const lng = parseFloat(e.target.value);
    if (!isNaN(lng)) {
      setCoordinates([position[0], lng]);
    }
  };

  return (
    <div>
      {/* MapContainer to render the map */}
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        {/* TileLayer for map background */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Marker with draggable functionality */}
        <Marker
          position={position}
          draggable={draggable}
          eventHandlers={{
            dragend: (event) => {
              const marker = event.target;
              const { lat, lng } = marker.getLatLng();
              setCoordinates([lat, lng]);
            },
          }}
        >
          <Popup>Drag me to change position!</Popup>
        </Marker>
      </MapContainer>
      <div style={{ marginTop: '20px' }}>
        <label>
          Latitude:
          <input type="number" value={position[0]} onChange={handleLatChange} step="0.0001" />
        </label>
        <br />
        <label>
          Longitude:
          <input type="number" value={position[1]} onChange={handleLngChange} step="0.0001" />
        </label>
      </div>
    </div>
  );
};

export default MapComponent;
