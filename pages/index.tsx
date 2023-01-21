import { useEffect, useState } from 'react';
import Head from 'next/head'

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [time, setTime] = useState<number>(0);
  const [positions, setPositions] = useState<GeolocationPosition[]>([]);
  const [isTracking, toggleTrackingFlag] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isTracking) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log([...positions, position]);
        setPositions([...positions, position]);
        setMessage('');
      }, error => {
        if (error.code === 1) {
          setMessage('Could not get the current position as the location permission was denied');
        } else if (error.code === 2) {
          setMessage('Could not get the current position as the position is unavailable');
        } else if (error.code === 3) {
          setMessage('Could not get the current position as the request was timed out');
        } else {
          setMessage('Oops, something went wrong, could not get the current position');
        }
      }, {
        enableHighAccuracy: true, // Use as much device power as required to retrieve the location
        timeout: 5000,
        maximumAge: 0 // Do not use cached locations
      });
    }
  }, [isTracking, time]);

  // Start watching the device's location
  function startTracking() {
    toggleTrackingFlag(true);
  }

  // Stop tracking the device's location
  async function stopTracking() {
    if (isTracking) {
      console.log('....ending the location tracking');
      toggleTrackingFlag(false);
      await fetch('/api/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: Date.now(), timestamp: Date.now(), positions })
      })
    }
  }

  return (
    <>
      <Head>
        <title>Get current location</title>
        <meta name="description" content="Get coordinates for the current location" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <button
            onClick={startTracking}
          >
            Start Tracking
          </button>
          <button
            onClick={stopTracking}
          >
            Stop Tracking
          </button>
        </div>

        <div>
          {message && `Message: ${message}`}
        </div>

        <table>
          <thead>
            <tr>
              <th>Latitude</th>
              <th>Longtitude</th>
              <th>Speed</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, idx) => (
              <tr key={position.timestamp + idx}>
                <td>{position.coords.latitude}</td>
                <td>{position.coords.longitude}</td>
                <td>{position.coords.speed}</td>
                <td>{position.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  )
}
