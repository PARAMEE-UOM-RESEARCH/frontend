import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;

const center = {
  lat: 6.9270786,
  lng: 79.861243,
};

const apiKey = REACT_APP_GOOGLE_MAPS_API_KEY;

function Map({ onLocationChange = () => {}, hotel = null, menuItem = "" }) {
  const [startLocation, setStartLocation] = useState(center); // Initial start point is the center
  const [selectedLocation, setSelectedLocation] = useState(
    menuItem == 5 && hotel
      ? { lat: hotel.latitude, lng: hotel.longitude }
      : null
  );
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const containerStyle = {
    width: menuItem == 5 ? "60%" : "100%",
    height: "400px",
  };

  useEffect(() => {
    if (startLocation && selectedLocation) {
      setTimeout(() => calculateRoute(), [2000]);
    }
  }, [startLocation, selectedLocation]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLocation = { lat, lng };

    if (!startLocation || (startLocation && selectedLocation)) {
      setStartLocation(newLocation); // Set new start point
      setSelectedLocation(null); // Reset destination
    } else {
      setSelectedLocation(newLocation); // Set the destination point
    }

    onLocationChange({ lat, lng });
  };

  const calculateRoute = () => {
    if (startLocation && selectedLocation) {
      let directionsService;
      if (window.google && window.google.maps) {
        directionsService = new window.google.maps.DirectionsService();
      }

      directionsService?.route(
        {
          origin: startLocation,
          destination: selectedLocation,
          travelMode: window.google?.maps.TravelMode.DRIVING, // Change as needed
        },
        (result, status) => {
          if (status === window.google?.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
            const route = result.routes[0].legs[0];
            setDistance(route.distance.text);
            setDuration(route.duration.text);
          } else {
            console.error(`Error fetching directions: ${status}`);
            setDistance(null);
            setDuration(null);
          }
        }
      );
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      onLoad={() => console.log("Google Maps script loaded successfully")}
      onError={() => console.error("Failed to load Google Maps script")}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {startLocation && <Marker position={startLocation} />}
        {selectedLocation && <Marker position={selectedLocation} />}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      {startLocation && selectedLocation && (
        <>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            {distance && (
              <p className="text-gray-800 font-semibold">
                Distance: <span className="text-blue-600">{distance}</span>
              </p>
            )}
            {duration && (
              <p className="text-gray-800 font-semibold">
                Duration: <span className="text-blue-600">{duration}</span>
              </p>
            )}
          </div>
        </>
      )}
    </LoadScript>
  );
}

export default Map;
