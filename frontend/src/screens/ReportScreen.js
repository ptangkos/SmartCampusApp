import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { reportIncident } from '../services/api';
import { getCurrentLocation } from '../utils/location';

// Fix #25: Predefined categories that match backend severity classification
const CATEGORIES = [
  { label: 'ICE', value: 'ICE', color: '#d32f2f' },
  { label: 'Shooting', value: 'SHOOTING', color: '#d32f2f' },
  { label: 'Fire', value: 'FIRE', color: '#d32f2f' },
  { label: 'Medical', value: 'MEDICAL', color: '#f57c00' },
  { label: 'Mental Health', value: 'MENTAL_HEALTH', color: '#f57c00' },
  { label: 'Theft', value: 'THEFT', color: '#fbc02d' },
  { label: 'Other', value: 'OTHER', color: '#388e3c' },
];

export default function ReportScreen({ navigation }) {
  const { user } = useAuth();
  const [anonymous, setAnonymous] = useState(user?.isGuest ? true : true);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setImage(photo);
      setShowCamera(false);
    }
  };

  const submitReport = async () => {
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!description) {
      Alert.alert('Error', 'Please add a description');
      return;
    }

    const isCritical = ['ICE', 'SHOOTING', 'FIRE'].includes(category);
    if (isCritical) {
      Alert.alert(
        'Emergency Alert',
        'This will trigger an emergency alert to all campus users. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', style: 'destructive', onPress: doSubmit },
        ]
      );
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    setSubmitting(true);
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
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Camera permission handling
  if (showCamera) {
    if (!permission) return <View />;
    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Camera access is needed to take incident photos</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Camera Access</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCamera(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <View style={styles.cameraButtons}>
          <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Photo Evidence</Text>
      {image ? (
        <View>
          <Image source={{ uri: image.uri }} style={styles.preview} />
          <TouchableOpacity onPress={() => { setImage(null); setShowCamera(true); }} style={styles.retakeButton}>
            <Text style={styles.retakeText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowCamera(true)} style={styles.cameraOpenButton}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      )}

      {/* Anonymous toggle - guests are forced anonymous */}
      {!user?.isGuest && (
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Report Anonymously</Text>
          <Switch value={anonymous} onValueChange={setAnonymous} trackColor={{ true: '#1976d2' }} />
        </View>
      )}
      {user?.isGuest && (
        <Text style={styles.guestNote}>Reporting as guest (anonymous only)</Text>
      )}

      {!anonymous && !user?.isGuest && (
        <View style={styles.identityNote}>
          <Text style={styles.noteText}>Your identity will only be shared with authorities, never publicly.</Text>
        </View>
      )}

      {/* Fix #25: Category picker */}
      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryChip,
              category === cat.value && { backgroundColor: cat.color, borderColor: cat.color },
            ]}
            onPress={() => setCategory(cat.value)}
          >
            <Text style={[styles.categoryText, category === cat.value && { color: 'white' }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="What happened? Provide details..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        onPress={submitReport}
        style={[styles.submitButton, submitting && styles.disabledButton]}
        disabled={submitting}
      >
        <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit Report'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 15, color: '#333' },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  cameraButtons: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: 'black' },
  captureButton: { backgroundColor: '#d32f2f', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  cameraOpenButton: { backgroundColor: '#1976d2', padding: 15, alignItems: 'center', borderRadius: 8, marginBottom: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 5 },
  retakeButton: { alignItems: 'center', padding: 8 },
  retakeText: { color: '#1976d2', fontWeight: '600' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, padding: 10, backgroundColor: 'white', borderRadius: 8 },
  switchLabel: { fontSize: 16, color: '#333' },
  guestNote: { color: '#666', fontStyle: 'italic', marginVertical: 10 },
  identityNote: { backgroundColor: '#e3f2fd', padding: 10, borderRadius: 8, marginVertical: 5 },
  noteText: { color: '#1565c0', fontSize: 13 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { borderWidth: 1.5, borderColor: '#ccc', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'white' },
  categoryText: { fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, backgroundColor: 'white' },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#d32f2f', padding: 16, alignItems: 'center', borderRadius: 8, marginTop: 20, marginBottom: 40 },
  disabledButton: { opacity: 0.6 },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#333' },
  button: { backgroundColor: '#1976d2', padding: 15, borderRadius: 8, marginBottom: 10 },
  cancelButton: { padding: 12 },
  cancelText: { color: '#999', fontSize: 16 },
});