import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [spireId, setSpireId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { login, register, continueAsGuest } = useAuth();

  const handleSubmit = async () => {
    if (!spireId || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isLogin) {
      const result = await login(spireId, password);
      if (!result.success) Alert.alert('Login failed', result.error);
    } else {
      // Fix #20: Wire up registration
      if (!fullName) {
        Alert.alert('Error', 'Please enter your full name');
        return;
      }
      const result = await register(spireId, fullName, password);
      if (!result.success) Alert.alert('Registration failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Campus Emergency</Text>
      <Text style={styles.subtitle}>Stay safe. Stay informed.</Text>

      <TextInput style={styles.input} placeholder="Spire ID" value={spireId} onChangeText={setSpireId} autoCapitalize="none" />
      {!isLogin && <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />}
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>{isLogin ? 'Need an account? Register' : 'Have an account? Login'}</Text>
      </TouchableOpacity>

      {/* Fix #21: Guest mode for anonymous reporting */}
      <TouchableOpacity style={styles.guestButton} onPress={continueAsGuest}>
        <Text style={styles.guestText}>Continue as Guest (Anonymous Reporting Only)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#1976d2' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 40, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8, backgroundColor: 'white' },
  button: { backgroundColor: '#1976d2', padding: 15, alignItems: 'center', borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  switchText: { marginTop: 15, textAlign: 'center', color: '#1976d2' },
  guestButton: { marginTop: 30, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#999', borderRadius: 8 },
  guestText: { color: '#666', fontSize: 14 },
});