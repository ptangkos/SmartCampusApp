import { useEffect, useState } from 'react';
import { DeviceEventEmitter, RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';
import IncidentCard from '../components/IncidentCard';
import QuickActionBar from '../components/QuickActionBar';
import colors from '../constants/colors';
import { getFeed } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [feed, setFeed] = useState({ critical: [], highMedium: [], low: [] });
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async () => {
    try {
      setRefreshing(true);
      const response = await getFeed();
      setFeed(response.data);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed();

    // Fix #22: Listen for real-time updates and refresh feed
    const subscription = DeviceEventEmitter.addListener('NEW_INCIDENT', () => {
      loadFeed();
    });

    return () => subscription.remove();
  }, []);

  const sections = [
    { title: 'CRITICAL', data: feed.critical || [], color: colors.critical },
    { title: 'HIGH / MEDIUM', data: feed.highMedium || [], color: colors.high },
    { title: 'LOW', data: feed.low || [], color: colors.low },
  ].filter((s) => s.data.length > 0);

  return (
    <View style={styles.container}>
      <QuickActionBar navigation={navigation} />
      {sections.length === 0 && !refreshing ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No incidents reported</Text>
          <Text style={styles.emptySubtext}>Pull down to refresh</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <IncidentCard incident={item} onPress={() => navigation.navigate('IncidentDetail', { id: item.id })} />
          )}
          renderSectionHeader={({ section: { title, color } }) => (
            <Text style={[styles.sectionHeader, { backgroundColor: color }]}>
              {title}
            </Text>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadFeed} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  sectionHeader: { color: 'white', padding: 10, fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 5 },
  emptySubtext: { fontSize: 14, color: '#999' },
});