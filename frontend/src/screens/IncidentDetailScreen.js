import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getIncidentById } from '../services/api';

const severityBadge = (severity) => {
  const colors = { CRITICAL: '#d32f2f', HIGH: '#f57c00', MEDIUM: '#fbc02d', LOW: '#388e3c' };
  return { backgroundColor: colors[severity] || '#999' };
};

export default function IncidentDetailScreen({ route }) {
  const { id } = route.params;
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fix #19: Actually fetch incident details
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await getIncidentById(id);
        setIncident(response.data);
      } catch (error) {
        console.error('Failed to load incident:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading incident details...</Text>
      </View>
    );
  }

  if (!incident) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load incident</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{incident.category}</Text>
        <View style={[styles.badge, severityBadge(incident.severity)]}>
          <Text style={styles.badgeText}>{incident.severity}</Text>
        </View>
      </View>

      <Text style={styles.status}>Status: {incident.status}</Text>
      <Text style={styles.description}>{incident.description}</Text>

      {incident.imageUrl && (
        <Image source={{ uri: incident.imageUrl }} style={styles.image} resizeMode="cover" />
      )}

      <Text style={styles.location}>Location: {incident.latitude?.toFixed(4)}, {incident.longitude?.toFixed(4)}</Text>
      <Text style={styles.time}>Reported: {new Date(incident.createdAt).toLocaleString()}</Text>

      {incident.anonymous && (
        <Text style={styles.anonymous}>Reported anonymously</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  errorText: { color: '#d32f2f', fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  category: { fontSize: 24, fontWeight: 'bold', color: '#212121' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  status: { fontSize: 16, color: '#1976d2', marginBottom: 15, fontWeight: '600' },
  description: { fontSize: 16, color: '#333', marginBottom: 20, lineHeight: 22 },
  image: { width: '100%', height: 250, borderRadius: 8, marginBottom: 20 },
  location: { fontSize: 14, color: '#777', marginBottom: 5 },
  time: { fontSize: 14, color: '#777', marginBottom: 5 },
  anonymous: { fontSize: 14, color: '#999', fontStyle: 'italic', marginTop: 10 },
});