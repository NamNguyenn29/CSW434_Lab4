import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { addNote, updateNote, deleteNote } from '../services/firestoreService';

export default function EditNoteScreen({ route, navigation }) {
  const note = route.params?.note;
  const isEditing = !!note?.id;

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || note?.text || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Please enter title and content.');
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await updateNote(note.id, title, content);
      } else {
        await addNote(title, content);
      }

      navigation.goBack();
    } catch (error) {
      console.log('Save note error:', error);
      Alert.alert('Error', 'Could not save note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(note.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'Could not delete note.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerButton}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Note' : 'New Note'}
          </Text>

          <TouchableOpacity onPress={isEditing ? handleDelete : handleSave}>
            <Text style={styles.headerButton}>{isEditing ? '⋮' : '✓'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editor}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />

          <TextInput
            style={styles.contentInput}
            placeholder="Start writing your note..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.toolbar}>
          <Text style={styles.tool}>B</Text>
          <Text style={[styles.tool, { fontStyle: 'italic' }]}>I</Text>
          <Text style={styles.tool}>U</Text>
          <Text style={styles.tool}>▧</Text>
          <Text style={styles.tool}>✦</Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Note'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3B9',
  },
  header: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    fontSize: 28,
    color: '#34445A',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34445A',
  },
  editor: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  titleInput: {
    fontSize: 27,
    fontWeight: '700',
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  contentInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 25,
    color: '#777',
  },
  toolbar: {
    height: 48,
    backgroundColor: '#F5E8A8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tool: {
    fontSize: 17,
    fontWeight: '600',
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#E95464',
    margin: 15,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
