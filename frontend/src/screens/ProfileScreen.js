import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user?.isGuest ? (
        <Text style={styles.info}>Browsing as Guest</Text>
      ) : (
        <Text style={styles.info}>Logged in as: {user?.spireId || 'Unknown'}</Text>
      )}
      <TouchableOpacity onPress={logout} style={styles.button}>
        <Text style={styles.buttonText}>{user?.isGuest ? 'Exit Guest Mode' : 'Logout'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  info: { fontSize: 16, color: '#666', marginBottom: 20 },
  button: { backgroundColor: '#e74c3c', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});