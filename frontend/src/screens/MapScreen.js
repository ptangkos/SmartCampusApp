import { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { getIncidents } from '../services/api';

export default function MapScreen() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const response = await getIncidents();
      setIncidents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {incidents.map(inc => (
        <Marker
          key={inc.id}
          coordinate={{ latitude: inc.latitude, longitude: inc.longitude }}
          pinColor={inc.severity === 'CRITICAL' ? 'red' : inc.severity === 'HIGH' ? 'orange' : 'green'}
        />
      ))}
    </MapView>
  );
}