import { useState } from 'react';
import Head from 'next/head'
import CoordinatesModel from '@/src/models/Coordinates';

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [handleId, setHandleId] = useState<number|null>(null);
  const [positions, setPositions] = useState<GeolocationPosition[]>([]);

  // Start watching the device's location
  function startTracking() {
    if (navigator.geolocation) {
      console.log('Starting to track the location....');
      const handleId = navigator.geolocation.watchPosition(position => {
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

      setHandleId(handleId);
    } else {
      setMessage('Could not get the current position as the browser does not support this functionality');
    }
  }

  // Stop tracking the device's location
  async function stopTracking() {
    if (navigator.geolocation && handleId) {
      console.log('....ending the location tracking');
      navigator.geolocation.clearWatch(handleId);
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
