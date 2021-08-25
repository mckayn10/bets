import firebase from 'firebase'
import firestore from 'firebase/firestore'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDg8XxgR1uPzhTmEZI3X7h8gmg3r_dVJvI",
    authDomain: "betz-1bfb4.firebaseapp.com",
    projectId: "betz-1bfb4",
    storageBucket: "betz-1bfb4.appspot.com",
    messagingSenderId: "27201185871",
    appId: "1:27201185871:web:c5829534be3283fde2223a",
    measurementId: "G-8WVK68KNB9"
};


try {

    firebase.initializeApp(firebaseConfig);

} catch (e) {

    console.log('App reloaded, so firebase did not re-initialize');
}

let db = firebase.firestore()

export default db



