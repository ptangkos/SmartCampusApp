import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AlertBanner({ message, onDismiss }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>🚨 {message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismiss}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#d32f2f', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  text: { color: 'white', fontWeight: 'bold', fontSize: 14, flex: 1 },
  dismiss: { marginLeft: 10, padding: 5 },
  dismissText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});