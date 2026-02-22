import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, Switch, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import { getIncidentById, getComments, addComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://172.31.34.123:8080/api';

const severityBadge = (severity) => {
  const colors = { CRITICAL: '#d32f2f', HIGH: '#f57c00', MEDIUM: '#fbc02d', LOW: '#388e3c' };
  return { backgroundColor: colors[severity] || '#999' };
};

export default function IncidentDetailScreen({ route }) {
  const { id } = route.params;
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchIncident();
    fetchComments();
  }, [id]);

  const fetchIncident = async () => {
    try {
      const response = await getIncidentById(id);
      setIncident(response.data);
    } catch (error) {
      console.error('Failed to load incident:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data);
    } catch (error) {
      console.log('Failed to load comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }
    if (!anonymous && !authorName.trim() && !user?.spireId) {
      Alert.alert('Error', 'Please enter your name or post anonymously');
      return;
    }

    setSubmitting(true);
    try {
      await addComment(id, {
        content: newComment.trim(),
        anonymous,
        authorName: anonymous ? 'Anonymous' : (authorName.trim() || user?.spireId || 'User'),
      });
      setNewComment('');
      setAuthorName('');
      fetchComments(); // Refresh comments
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading incident details...</Text>
      </View>
    );
  }

  if (!incident) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load incident</Text>
      </View>
    );
  }

  const imageUrl = incident.hasImage ? `${API_URL}/incidents/${id}/image` : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.category}>{incident.category}</Text>
          <View style={[styles.badge, severityBadge(incident.severity)]}>
            <Text style={styles.badgeText}>{incident.severity}</Text>
          </View>
        </View>

        <Text style={styles.status}>Status: {incident.status}</Text>
        <Text style={styles.description}>{incident.description}</Text>

        {/* Image */}
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        )}

        <Text style={styles.location}>
          Location: {incident.latitude?.toFixed(4)}, {incident.longitude?.toFixed(4)}
        </Text>
        <Text style={styles.time}>
          Reported: {new Date(incident.createdAt).toLocaleString()}
        </Text>

        {incident.anonymous && (
          <Text style={styles.anonymousLabel}>Reported anonymously</Text>
        )}

        {/* Comments Section */}
        <View style={styles.divider} />
        <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

        {comments.length === 0 ? (
          <Text style={styles.noComments}>No comments yet. Be the first to comment.</Text>
        ) : (
          comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>
                  {comment.anonymous ? '🕶 Anonymous' : comment.authorName}
                </Text>
                <Text style={styles.commentTime}>
                  {new Date(comment.createdAt).toLocaleString()}
                </Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))
        )}

        {/* Add Comment */}
        <View style={styles.addCommentSection}>
          <Text style={styles.addCommentTitle}>Add a Comment</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Post anonymously</Text>
            <Switch value={anonymous} onValueChange={setAnonymous} />
          </View>

          {!anonymous && !user?.spireId && (
            <TextInput
              style={styles.input}
              placeholder="Your name"
              value={authorName}
              onChangeText={setAuthorName}
            />
          )}

          <TextInput
            style={[styles.input, styles.commentInput]}
            placeholder="Write a comment..."
            multiline
            value={newComment}
            onChangeText={setNewComment}
          />

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmitComment}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  errorText: { color: '#d32f2f', fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  category: { fontSize: 24, fontWeight: 'bold', color: '#212121' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  status: { fontSize: 16, color: '#1976d2', marginBottom: 15, fontWeight: '600' },
  description: { fontSize: 16, color: '#333', marginBottom: 20, lineHeight: 22 },
  image: { width: '100%', height: 250, borderRadius: 8, marginBottom: 20 },
  location: { fontSize: 14, color: '#777', marginBottom: 5 },
  time: { fontSize: 14, color: '#777', marginBottom: 5 },
  anonymousLabel: { fontSize: 14, color: '#999', fontStyle: 'italic', marginTop: 10 },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 20 },
  commentsTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 15 },
  noComments: { color: '#999', fontStyle: 'italic', marginBottom: 20 },
  commentCard: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 10, elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  commentAuthor: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  commentTime: { color: '#999', fontSize: 12 },
  commentContent: { color: '#444', fontSize: 14, lineHeight: 20 },
  addCommentSection: { marginTop: 10, backgroundColor: 'white', padding: 15, borderRadius: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  addCommentTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  switchLabel: { fontSize: 14, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 14 },
  commentInput: { height: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#1976d2', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#90caf9' },
  submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});