import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { reportIncident } from '../services/api';
import { getCurrentLocation } from '../utils/location';

export default function ReportScreen({ navigation }) {
  const [anonymous, setAnonymous] = useState(true);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [spireId, setSpireId] = useState('');
  const [fullName, setFullName] = useState('');
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.captureButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo);
    }
  };

  const submitReport = async () => {
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      const location = await getCurrentLocation();
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        category,
        description,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        anonymous,
      }));
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }

      await reportIncident(formData);
      Alert.alert('Report submitted', 'Thank you for your report');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={facing}
      />
      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

      <View style={styles.switchContainer}>
        <Text>Report Anonymously</Text>
        <Switch value={anonymous} onValueChange={setAnonymous} />
      </View>

      {!anonymous && (
        <>
          <TextInput style={styles.input} placeholder="Spire ID" value={spireId} onChangeText={setSpireId} />
          <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        </>
      )}

      <TextInput style={styles.input} placeholder="Category (e.g., FIRE, SHOOTING)" value={category} onChangeText={setCategory} />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Description" multiline value={description} onChangeText={setDescription} />

      <TouchableOpacity onPress={submitReport} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  camera: { height: 200, marginBottom: 10 },
  captureButton: { backgroundColor: '#2196F3', padding: 10, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  preview: { width: '100%', height: 200, marginBottom: 10 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  textArea: { height: 80 },
  submitButton: { backgroundColor: '#4CAF50', padding: 15, alignItems: 'center', borderRadius: 5 },
  submitText: { color: 'white', fontWeight: 'bold' },
});