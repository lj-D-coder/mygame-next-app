import admin from 'firebase-admin';
import serviceAccount from '@/lib/firebase/serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db_firestore = admin.firestore();

export default db_firestore;


