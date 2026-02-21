import * as Linking from 'expo-linking';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QuickActionBar({ navigation }) {
  const makeCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Report')} style={styles.button}>
        <Text style={styles.buttonText}>🚨 Report</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => makeCall('911')} style={styles.button}>
        <Text style={styles.buttonText}>👮 UMPD</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => makeCall('988')} style={styles.button}>
        <Text style={styles.buttonText}>💬 988</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => makeCall('555-1234')} style={styles.button}>
        <Text style={styles.buttonText}>🤝 SASA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});