import { db } from "../../firebase/firestore";

export const GET_PEOPLE = 'GET_PEOPLE';
export const ADD_FRIEND = 'ADD_FRIEND';
export const GET_FRIENDS = 'GET_FRIENDS';
export const REMOVE_FRIEND = 'REMOVE_FRIEND'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`
const friendsRef = db.collection('friends')
const peopleRef = db.collection('people')

export const fetchAllPeople = () => {
    return async (dispatch, getState) => {

        peopleRef.get()
            .then((querySnapshot) => {
                let peopleArr = []
                querySnapshot.forEach((doc) => {
                    let person = doc.data()
                    person.id = doc.id
                    peopleArr.unshift(person)
                });
                dispatch({ type: GET_PEOPLE, people: peopleArr })
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            })
    }
}

export const fetchAllFriends = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        friendsRef.doc(userId).collection('friendsList')
            .onSnapshot((querySnapshot) => {
                let friendsArr = []
                querySnapshot.forEach((doc) => {
                    let friend = doc.data()
                    friend.id = doc.id

                    peopleRef.doc(friend.id).get()
                    .then(friend => {
                        friendsArr.unshift(friend.data())
                    })
                });
                dispatch({ type: GET_FRIENDS, friends: friendsArr })
            })

    }
}


export const addFriend = (friend) => {
    return (dispatch, getState) => {
        const userId = getState().auth.userId
        const userInfo = getState().auth.userInfo


        friendsRef.doc(userId).collection('friendsList').doc(friend.id).set(friend)
            .then((docRef) => {
                friendsRef.doc(friend.id).collection('friendsList').doc(userId).set(userInfo)
                    .then(() => {
                        dispatch({ type: ADD_FRIEND, friend: friend })
                    })
                    .catch(err => {
                        console.error("Error writing document: ", error);
                    })
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
}

export const removeFriend = (friendId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        friendsRef.doc(userId).collection('friendsList').doc(friendId).delete()
            .then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

        friendsRef.doc(friendId).collection('friendsList').doc(userId).delete()
            .then(() => {
                console.log("Document successfully deleted!");
                dispatch({
                    type: REMOVE_FRIEND,
                    id: friendId
                })
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
    }
}
