import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Logged in as: {user?.spireId}</Text>
      <TouchableOpacity onPress={logout} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: { backgroundColor: '#e74c3c', padding: 10, marginTop: 20 },
  buttonText: { color: 'white' },
});