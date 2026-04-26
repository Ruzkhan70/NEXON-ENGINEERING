/**
 * firebase-config.js
 * Centralized Firebase configuration and synchronization logic.
 */

// Your web app's Firebase configuration
// REPLACE THE BELOW PLACEHOLDERS WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDmK7a4cAoFHT2fNlnt_0MerotKEYLkQIU",
  authDomain: "nexon-admin.firebaseapp.com",
  databaseURL: "https://nexon-admin-default-rtdb.firebaseio.com",
  projectId: "nexon-admin",
  storageBucket: "nexon-admin.firebasestorage.app",
  messagingSenderId: "641077732544",
  appId: "1:641077732544:web:6000a67fa448fc188bb925"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

/**
 * Global Real-time Sync Helper
 * Listens to a path in Firebase and executes a callback on every update.
 */
function syncWithFirebase(path, callback) {
  const ref = db.ref(path);
  ref.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
}

/**
 * Write data to Firebase - for admin portal to sync changes
 */
function writeToFirebase(path, data) {
  return db.ref(path).set(data);
}

/**
 * Update specific path in Firebase
 */
function updateFirebase(path, data) {
  return db.ref(path).update(data);
}

/**
 * Visitor Tracking logic
 */
function trackVisitors() {
  const visitorRef = db.ref('stats/activeVisitors');
  const connectedRef = db.ref('.info/connected');
  
  connectedRef.on('value', (snap) => {
    if (snap.val() === true) {
      // Add a new session
      const con = visitorRef.push();
      // Remove the session when disconnected
      con.onDisconnect().remove();
      con.set(true);
    }
  });
}
