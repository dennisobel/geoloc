import React, { useEffect, useState } from "react";

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance,setDistance] = useState()

  function calculateDistance(origin, destination) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    const { lat: lat1, lng: lng1 } = origin;
    const { lat: lat2, lng: lng2 } = destination;

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance * 1000; // Convert distance to meters
  }

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      (error) => {
        console.log("Error:", error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(()=>{
    const distance = calculateDistance(
      { lat: -1.3361619, lng: 36.8943361 },
      { lat: currentLocation?.latitude, lng: currentLocation?.longitude }      
    );

    console.log(distance)
    setDistance(distance)
  },[currentLocation])

  return (
    <div>
      <p>Latitude: {currentLocation?.latitude}</p>
      <p>Longitude: {currentLocation?.longitude}</p>
      <p>Distance: {distance && distance}</p>
    </div>
  );
};

export default App;
