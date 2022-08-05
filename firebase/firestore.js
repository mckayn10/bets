import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDg8XxgR1uPzhTmEZI3X7h8gmg3r_dVJvI",
    authDomain: "betz-1bfb4.firebaseapp.com",
    projectId: "betz-1bfb4",
    storageBucket: "betz-1bfb4.appspot.com",
    messagingSenderId: "27201185871",
    appId: "1:27201185871:web:c5829534be3283fde2223a",
    measurementId: "G-8WVK68KNB9",
    storeageBucket: 'gs://betz-1bfb4.appspot.com'
};

try {
    firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });
} catch (e) {
    console.log('App reloaded, so firebase did not re-initialize');
}


const db = firebase.firestore()
const storage = firebase.storage().ref()


const forgotPassword = (Email) => {
    firebase.auth().sendPasswordResetEmail(Email)
        .then(() => {
            alert(`A password reset email has been sent to ${Email}`)
        }).catch(function (e) {
            alert('Could not find a user with that email. Please enter a different email and try again.')
        })
}

export { db, storage, forgotPassword }



