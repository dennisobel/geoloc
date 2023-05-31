import React, { useEffect, useState, useRef } from "react";

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance,setDistance] = useState()
  const [display,setDisplay] = useState("")

  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');

  const handleCapture = () => {
    const video = videoRef.current;

    if (video) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas image to a data URL
      const dataUrl = canvas.toDataURL('image/png');

      // Set the captured image as the source
      setImageSrc(dataUrl);
    }
  };

  const handleStartCapture = () => {
    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { video: { facingMode: 'environment' } };

      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          const video = videoRef.current;
          if (video) {
            video.srcObject = stream;
            video.play();
          }
        })
        .catch((error) => {
          console.log('Error accessing camera:', error);
        });
    }
  };

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
      <br/>
      <div>
      <div>
        <button onClick={handleStartCapture}>Start Capture</button>
        <button onClick={handleCapture}>Capture Image</button>
      </div>
      <div>
        {imageSrc && <img src={imageSrc} alt="Captured" />}
      </div>
      <video ref={videoRef} style={{ display }}></video>
    </div>
    </div>
  );
};

export default App;
