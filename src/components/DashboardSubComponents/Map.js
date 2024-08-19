import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 6.9270786,
  lng: 79.861243,
};

const apiKey = REACT_APP_GOOGLE_MAPS_API_KEY;

function Map() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
      {selectedLocation && (
        <div>
          <p>Selected Latitude: {selectedLocation.lat}</p>
          <p>Selected Longitude: {selectedLocation.lng}</p>
        </div>
      )}
    </LoadScript>
  );
}

export default Map;
