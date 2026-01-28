const admin = require('firebase-admin');
const path = require('path');
// Go up two levels to find the JSON file (../../)
const serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Replace with your actual bucket name from Firebase Console
  storageBucket: 'postly-9d3c5.firebasestorage.app' 
});

const bucket = admin.storage().bucket();

module.exports = bucket;