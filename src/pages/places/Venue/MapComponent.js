import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TextField } from '@mui/material';
import 'leaflet/dist/leaflet.css';

// Remove default icon settings
delete L.Icon.Default.prototype._getIconUrl;

// Custom marker icons for different resolutions
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ lat, lng, setCoordinates, draggable, height = 400 }) => {
  // Initialize state with props for latitude and longitude
  const [position, setPosition] = useState([lat, lng]);

  // Effect to update position when props change
  useEffect(() => {
    setPosition([lat, lng]);
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

  const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
  };

  return (
    <>
      <MapContainer
        className="overflow-hidden"
        center={position}
        zoom={13}
        style={{ height: height }}
      >
        <RecenterAutomatically lat={lat} lng={lng} />
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
      {draggable && (
        <div className="mt-5 flex justify-center gap-10">
          <TextField
            value={position[0]}
            onChange={handleLatChange}
            type="number"
            label="Latitude"
            size="small"
          />
          <TextField
            value={position[1]}
            onChange={handleLngChange}
            type="number"
            label="Longitude"
            size="small"
          />
        </div>
      )}
    </>
  );
};

export default MapComponent;
