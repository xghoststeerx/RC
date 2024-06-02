const admin = require('firebase-admin');
const firebaseConfig = require('./firebaseConfig');
const serviceAccount = require("./key/registro-calificado-key.json");

const registroCalificadoApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  storageBucket: firebaseConfig.storageBucket
}, 'registroCalificadoApp');

module.exports = registroCalificadoApp;