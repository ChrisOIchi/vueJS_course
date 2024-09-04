import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDnSuxYHjEWb_cj1AXJCMJMJBaD4Ei2lHo",
  authDomain: "music-b5214.firebaseapp.com",
  projectId: "music-b5214",
  storageBucket: "music-b5214.appspot.com",
  appId: "1:858958951368:web:9f6753e710dd7a4f0206fd"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);


// Obtén las referencias a Firestore, Auth y Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Accede a la colección 'users'
const usersCollection = collection(db, 'users');
const songsCollection = collection(db, 'songs');
const commentsCollection = collection(db, 'comments');

// Exporta las referencias para usarlas en otras partes de tu proyecto
export { db, auth, storage, usersCollection, songsCollection, commentsCollection };
