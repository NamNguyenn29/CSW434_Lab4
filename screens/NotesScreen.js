import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import NoteCard from '../components/NoteCard';
import { subscribeNotes, deleteNote } from '../services/firestoreService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeNotes(
      data => {
        setNotes(data);
        setLoading(false);
      },
      error => {
        console.log('Load notes error:', error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const filteredNotes = notes.filter(note => {
    const title = note.title || '';
    const content = note.content || note.text || '';
    const keyword = search.toLowerCase();

    return (
      title.toLowerCase().includes(keyword) ||
      content.toLowerCase().includes(keyword)
    );
  });

  const handleDelete = (id, title) => {
    Alert.alert('Delete Note', `Are you sure you want to delete "${title || 'this note'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(id);
          } catch (error) {
            Alert.alert('Error', 'Could not delete note.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.headerIcon}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Recent Notes</Text>

          <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
            <Text style={styles.headerIcon}>⌕</Text>
          </TouchableOpacity>
        </View>

        {searchVisible && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#E95464" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <NoteCard
                note={item}
                index={index}
                onPress={() => navigation.navigate('EditNote', { note: item })}
                onLongPress={() => handleDelete(item.id, item.title)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No notes yet. Tap + to create one.
              </Text>
            }
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('EditNote')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
  },
  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    fontSize: 25,
    color: '#333',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#34445A',
  },
  searchInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  list: {
    paddingTop: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EB5264',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  addButtonText: {
    fontSize: 36,
    color: '#FFF',
    lineHeight: 42,
  },
});
