import React, { useEffect, useState } from 'react';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      (error) => {
        console.log('Error:', error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div>
      <p>Latitude: {currentLocation?.latitude}</p>
      <p>Longitude: {currentLocation?.longitude}</p>
    </div>
  );
};

export default App;
