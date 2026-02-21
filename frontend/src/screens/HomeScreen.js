import { useEffect, useState } from 'react';
import { RefreshControl, SectionList, Text, View } from 'react-native';
import IncidentCard from '../components/IncidentCard';
import QuickActionBar from '../components/QuickActionBar';
import colors from '../constants/colors';
import { getFeed } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [feed, setFeed] = useState({ critical: [], highMedium: [], low: [] });
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async () => {
    try {
      const response = await getFeed();
      setFeed(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const sections = [
    { title: 'CRITICAL', data: feed.critical, color: colors.critical },
    { title: 'HIGH / MEDIUM', data: feed.highMedium, color: colors.high },
    { title: 'LOW', data: feed.low, color: colors.low },
  ];

  return (
    <View style={{ flex: 1 }}>
      <QuickActionBar navigation={navigation} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <IncidentCard incident={item} onPress={() => navigation.navigate('IncidentDetail', { id: item.id })} />
        )}
        renderSectionHeader={({ section: { title, color } }) => (
          <Text style={{ backgroundColor: color, color: 'white', padding: 8, fontWeight: 'bold' }}>
            {title}
          </Text>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadFeed} />}
      />
    </View>
  );
}