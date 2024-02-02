import admin from 'firebase-admin';
import serviceAccount from '@/lib/firebase/serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const firestore_db = admin.firestore();

export default firestore_db;


