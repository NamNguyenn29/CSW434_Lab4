import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from '@react-native-firebase/firestore';

const db = getFirestore();

const notesCollection = collection(db, 'notes');

// CREATE: Add a new note
export const addNote = async (title, content) => {
  try {
    const docRef = await addDoc(notesCollection, {
      title: title,
      content: content,
      createdAt: serverTimestamp(),
    });

    console.log('Note added:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

// READ: Subscribe to notes in real time
export const subscribeNotes = callback => {
  const notesQuery = query(notesCollection, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    notesQuery,
    snapshot => {
      const notes = snapshot.docs.map(item => ({
        id: item.id,
        ...item.data(),
      }));

      callback(notes);
    },
    error => {
      console.error('Error listening to notes:', error);
    },
  );

  return unsubscribe;
};

// DELETE: Delete a note by ID
export const deleteNote = async id => {
  try {
    await deleteDoc(doc(db, 'notes', id));

    console.log('Note deleted:', id);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const updateNote = async (id, title, content) => {
  return updateDoc(doc(db, 'notes', id), {
    title: title.trim(),
    content: content.trim(),
  });
};
