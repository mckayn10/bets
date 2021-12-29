import { storage } from '../../firebase/firestore'

// import { db } from '../../firebase/config';
import { db } from '../../firebase/firestore';

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`
var categoriesRef = db.collection("categories")

export const addCategory = (category) => {
    return (dispatch, getState) => {
        const userId = getState().auth.userId
        const userInfo = getState().auth.userInfo


        categoriesRef.doc(userId).collection('categoryList').doc(category.name)
            .then((docRef) => {
                console.log(docRef)
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
}

export const addBetToCategory = (category, bet) => {
    return (dispatch, getState) => {
        const userId = getState().auth.userId
        const userInfo = getState().auth.userInfo


        categoriesRef.doc(userId).collection('categoryList').doc(category.name).collection('betList').doc(bet.id).set(bet)
            .then((docRef) => {
                console.log(docRef)
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
}