const admin = require('firebase-admin');
const serviceAccount = require('../keys/productKey'); // Ensure this path is correct

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://auth-jobhub.firebaseio.com'
});

module.exports = admin;
