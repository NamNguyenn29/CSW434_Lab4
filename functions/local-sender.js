const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const serviceAccount = require('./service-account-key.json');

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);
const messaging = getMessaging(app);

console.log('Firebase Admin initialized');
console.log('Watching notes collection...');

let isInitialSnapshot = true;

db.collection('notes').onSnapshot(
  async snapshot => {
    // Bỏ qua những Note đã tồn tại khi script vừa khởi động
    if (isInitialSnapshot) {
      isInitialSnapshot = false;
      console.log('Initial snapshot loaded, count:', snapshot.docs.length);
      return;
    }

    for (const change of snapshot.docChanges()) {
      if (change.type !== 'added') {
        continue;
      }

      const note = change.doc.data();

      const title = note.title || 'New Note Added';
      const body = note.content || note.text || 'A new note was created';

      const message = {
        notification: {
          title: 'New Note Added',
          body: `${title}: ${body}`.substring(0, 200),
        },
        topic: 'notes',
      };

      try {
        const response = await messaging.send(message);

        console.log('Notification sent successfully:', response);
        console.log('New note:', change.doc.id);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  },
  error => {
    console.error('Firestore listener error:', error);
  },
);
