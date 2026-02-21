import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function IncidentCard({ incident, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.category}>{incident.category}</Text>
      <Text style={styles.description} numberOfLines={2}>{incident.description}</Text>
      <Text style={styles.time}>{new Date(incident.createdAt).toLocaleTimeString()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 15, marginHorizontal: 10, marginVertical: 5, borderRadius: 8, elevation: 2 },
  category: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 14, color: '#555', marginBottom: 5 },
  time: { fontSize: 12, color: '#999' },
});