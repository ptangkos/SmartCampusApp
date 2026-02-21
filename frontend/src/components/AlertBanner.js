import { StyleSheet, Text, View } from 'react-native';

export default function AlertBanner({ message }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>🚨 {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: 'red', padding: 15, alignItems: 'center' },
  text: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});