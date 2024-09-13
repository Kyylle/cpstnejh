const admin = require('firebase-admin');
const serviceAccount = require('../keys/productKey');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
