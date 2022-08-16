import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../firebase/firestore'

// import { db } from '../../firebase/config';
import { db } from '../../firebase/firestore';
import {configurePushNotifications} from "../../push_notifications/push_notifications";
export const SIGN_UP = 'SIGN_UP'
export const SIGN_IN = 'SIGN_IN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'
export const UPDATE_USER = 'UPDATE_USER'
export const GET_USER = 'GET_USER'
export const GET_PROFILE_PICTURE = 'GET_PROFILE_PICTURE'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`
var peopleRef = db.collection("people")


export const authenticate = (userId, token) => {
    return {
        type: AUTHENTICATE,
        userId: userId,
        token: token,
    }
}

const createPerson = async (userId, token, userData) => {
    userData.id = userId
    userData.venmo_id = ''
    delete userData.password

    peopleRef.doc(userId).set(userData)
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

const deletePerson = async (userId) => {
    peopleRef.doc(userId).delete()
        .then(() => {
            console.log("Document successfully deleted!");
        })
        .catch((error) => {
            console.error("Error deleting document: ", error);
        });
    return;
}

export const getProfilePic = (userEmail) => {
    return storage.child(`profile_pictures/${userEmail}-profile-picture`).getDownloadURL()
        .then((url) => {
            return url
        })
        .catch(err => {
            storage.child(`profile_pictures/placeholder.png`).getDownloadURL()
                .then((url) => {
                    return url
                })
        })
}

export const getUserPic = () => {
    return async (dispatch, getState) => {
        const user = getState().auth

        storage.child(`profile_pictures/${user.email}-profile-picture`).getDownloadURL()
            .then((url) => {
                dispatch({ type: GET_PROFILE_PICTURE, pic: url })
            })
            .catch(err => {
                storage.child(`profile_pictures/placeholder.png`).getDownloadURL()
                    .then((url) => {
                        dispatch({ type: GET_PROFILE_PICTURE, pic: url })
                    })
            })

    }
}
const checkForUserPushId = async (user) => {
    if(!user.pushId){
        user.pushId = await configurePushNotifications()
        console.log(user.pushId)
        peopleRef.doc(user.id).update(user)
            .then(() => {
                console.log("Updated Push ID");
            }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
}

export const getUser = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        peopleRef.doc(userId)
            .onSnapshot(async (doc) => {
                if (doc.exists) {
                    let user = doc.data()

                    await checkForUserPushId(user)
                    dispatch({ type: GET_USER, user: user })
                } else {
                    console.log("Person document does not exist");
                }
            })
    }
}

export const signUp = (userInfo) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDg8XxgR1uPzhTmEZI3X7h8gmg3r_dVJvI',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'applicaton/json'
                },
                body: JSON.stringify({
                    email: userInfo.email,
                    password: userInfo.password,
                    returnSecureToken: true
                })
            })

        if (!response.ok) {
            const errorResData = await response.json()
            const errorId = errorResData.error.message
            let message = `Error with registration!`
            if (errorId === 'EMAIL_EXISTS') {
                message = 'Email address already exists.'
            } else if (errorId === 'WEAK_PASSWORD : Password should be at least 6 characters') {
                message = 'Password must be at least 6 characters.'
            }
            throw new Error(message)
        }
        const resData = await response.json()

        await createPerson(resData.localId, resData.idToken, userInfo)

        dispatch(authenticate(resData.localId, resData.idToken))

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
        console.log({expirationDate})
        saveDataToStorage(resData.idToken, resData.localId, expirationDate, userInfo)
    }
}

export const signIn = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDg8XxgR1uPzhTmEZI3X7h8gmg3r_dVJvI',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'applicaton/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            })

        if (!response.ok) {
            const errorResData = await response.json()
            const errorId = errorResData.error.message
            let message = `Something went wrong!`

            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'Email could not be found.'
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'Incorrect password.'
            }
            throw new Error(message)
        }
        const resData = await response.json()

        dispatch(authenticate(resData.localId, resData.idToken))

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 10000000)
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    }
}

export async function validateUserName(username) {
    let isValid = false
    return peopleRef.where("username", "==", username).get()
        .then((querySnapshot) => {
            if (querySnapshot.docs.length > 0) {
                return false
            } else {
                return true
            }
        })
}

export const updateUser = (userData) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId
        userData.id = userId
        userData.pushId = getState().auth.userInfo.pushId
        peopleRef.doc(userId).set(userData, { merge: true })
            .then(() => {
                dispatch({ type: UPDATE_USER, userData: userData })
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
}

export const deleteAccount = () => {
    return async () => {
        let userInfoFromStorage = await (AsyncStorage.getItem('userData'))
        let token = JSON.parse(userInfoFromStorage)["token"]
        let data = JSON.stringify({idToken: token})
        let userId = JSON.parse(userInfoFromStorage)["userId"]
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDg8XxgR1uPzhTmEZI3X7h8gmg3r_dVJvI',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'applicaton/json'
                },
                body: data
            })

        if (!response.ok) {
            const errorResData = await response.json()
            const errorId = errorResData.error.message
            let message = `Error deleting this account. Please reach out to mckay.nilsson@gmail.com with help deleting. ` + errorId
            throw new Error(message)
        }
        const resData = await response.json()
        await deletePerson(userId)
    }
}

export const logout = () => {
    AsyncStorage.removeItem('userData')
    return {
        type: LOGOUT
    }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString(),

    }))
}

const removeDataFromStorage = () => {
    AsyncStorage.removeItem('userData').then(() => {
        console.log('removed user data from storage')
    }).catch((err) => {
        console.error('Error removing user data from storage', err)
    })

}