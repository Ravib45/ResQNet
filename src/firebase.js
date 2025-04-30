import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    enableIndexedDbPersistence,
    collection,
    query,
    limit,
    getDocs
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAN4VRz8RGqI4Km3aRyVtkpswnTWb2B0bk",
    authDomain: "resqnet-13d7a.firebaseapp.com",
    projectId: "resqnet-13d7a",
    storageBucket: "resqnet-13d7a.firebasestorage.app",
    messagingSenderId: "901561421395",
    appId: "1:901561421395:web:06634e1045ea04330380a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db)
    .then(() => {
        console.log('Offline persistence enabled');
    })
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence enabled in another tab');
        } else if (err.code === 'unimplemented') {
            console.warn('Browser doesn\'t support persistence');
        }
    });

// Initialize Auth
const auth = getAuth(app);

// Initialize Storage with custom settings
const storage = getStorage(app);

// Helper function to check database connection
const checkDatabaseConnection = async () => {
    try {
        // Validate Firestore connection
        const testQuery = query(collection(db, 'emergencyReports'), limit(1));
        await getDocs(testQuery);
        
        // Also check storage access
        const storageRef = storage.ref();
        await storageRef.child('test.txt').putString('test');
        
        return true;
    } catch (error) {
        console.error('Database connection check failed:', error);
        return false;
    }
};

// Helper function to retry failed uploads
const retryUpload = async (file, path, attempts = 3) => {
    for (let i = 0; i < attempts; i++) {
        try {
            const ref = storage.ref().child(path);
            const result = await ref.put(file, {
                contentType: file.type,
                customMetadata: {
                    originalName: file.name
                }
            });
            return await result.ref.getDownloadURL();
        } catch (error) {
            if (i === attempts - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
};

export { db, auth, storage, checkDatabaseConnection, retryUpload };