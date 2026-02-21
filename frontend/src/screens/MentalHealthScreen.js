import { useEffect, useState } from 'react';
import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getResources } from '../services/api';

export default function MentalHealthScreen() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await getResources();
      setResources(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const makeCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => makeCall(item.number)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.number}>{item.number}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mental Health & Support Resources</Text>
      <FlatList
        data={resources}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', margin: 20, color: '#2c3e50' },
  list: { paddingHorizontal: 20 },
  card: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#3498db' },
  number: { fontSize: 16, color: '#2c3e50', marginVertical: 5 },
  description: { fontSize: 14, color: '#7f8c8d' },
});