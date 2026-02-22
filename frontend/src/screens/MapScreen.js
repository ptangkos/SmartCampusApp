import { useEffect, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getIncidents } from '../services/api';

// Fix #18: UMass Amherst coordinates
const UMASS_REGION = {
  latitude: 42.3912,
  longitude: -72.5267,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const severityColor = (severity) => {
  switch (severity) {
    case 'CRITICAL': return 'red';
    case 'HIGH': return 'orange';
    case 'MEDIUM': return 'yellow';
    default: return 'green';
  }
};

export default function MapScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);

  const loadIncidents = async () => {
    try {
      const response = await getIncidents();
      setIncidents(response.data);
    } catch (error) {
      console.error('Failed to load incidents:', error);
    }
  };

  useEffect(() => {
    loadIncidents();

    // Fix #22: Listen for real-time incident updates from WebSocket
    const subscription = DeviceEventEmitter.addListener('NEW_INCIDENT', (incident) => {
      setIncidents((prev) => {
        const exists = prev.find((i) => i.id === incident.id);
        if (exists) {
          return prev.map((i) => (i.id === incident.id ? incident : i));
        }
        return [incident, ...prev];
      });
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={UMASS_REGION}>
        {incidents.map((inc) => (
          <Marker
            key={inc.id}
            coordinate={{ latitude: inc.latitude, longitude: inc.longitude }}
            pinColor={severityColor(inc.severity)}
            title={inc.category}
            description={inc.description}
            onCalloutPress={() => navigation?.navigate('IncidentDetail', { id: inc.id })}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});