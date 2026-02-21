import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [spireId, setSpireId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (isLogin) {
      const result = await login(spireId, password);
      if (!result.success) Alert.alert('Login failed', result.error);
    } else {
      // call register (you'll need to add register to context)
      Alert.alert('Info', 'Registration not implemented in this demo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Campus Emergency</Text>
      <TextInput style={styles.input} placeholder="Spire ID" value={spireId} onChangeText={setSpireId} autoCapitalize="none" />
      {!isLogin && <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />}
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>{isLogin ? 'Need an account? Register' : 'Have an account? Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  button: { backgroundColor: '#3498db', padding: 15, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  switchText: { marginTop: 15, textAlign: 'center', color: '#3498db' },
});