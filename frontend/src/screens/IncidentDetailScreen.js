import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';

export default function IncidentDetailScreen({ route }) {
  const { id } = route.params;
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    // Fetch incident details by id
    // For simplicity, we'll use a placeholder
    // In real app, call api
  }, []);

  if (!incident) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.category}>{incident.category}</Text>
      <Text style={styles.severity}>Severity: {incident.severity}</Text>
      <Text style={styles.description}>{incident.description}</Text>
      {incident.image && <Image source={{ uri: `data:image/jpeg;base64,${incident.image}` }} style={styles.image} />}
      <Text style={styles.location}>Location: {incident.latitude}, {incident.longitude}</Text>
      <Text style={styles.time}>Reported: {new Date(incident.createdAt).toLocaleString()}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  category: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  severity: { fontSize: 18, color: '#555', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  image: { width: '100%', height: 200, marginBottom: 20 },
  location: { fontSize: 14, color: '#777', marginBottom: 5 },
  time: { fontSize: 14, color: '#777' },
});