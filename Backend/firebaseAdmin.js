import admin from 'firebase-admin';
import serviceAccount from './project-firebase.json' with {type:'json'};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export default admin;