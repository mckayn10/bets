import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../firebase/firestore'

// import { db } from '../../firebase/config';
import { db } from '../../firebase/firestore';
export const SIGN_UP = 'SIGN_UP'
export const SIGN_IN = 'SIGN_IN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'
export const UPDATE_USER = 'UPDATE_USER'
export const GET_USER = 'GET_USER'
export const GET_PROFILE_PICTURE = 'GET_PROFILE_PICTURE'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`
var peopleRef = db.collection("people");


export const authenticate = (userId, token) => {
    return {
        type: AUTHENTICATE,
        userId: userId,
        token: token,
    }
}

const createPerson = async (userId, token, userData) => {
    userData.id = userId
    delete userData.password

    peopleRef.doc(userId).set(userData)
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
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
        const user = getState().auth.userInfo
        console.log('user', user)

        // storage.child(`profile_pictures/${user.email}-profile-picture`).getDownloadURL()
        // .then((url) => {
        //     dispatch({ type: GET_PROFILE_PICTURE, pic: url })
        // })
        // .catch(err => {
        //     storage.child(`profile_pictures/placeholder.png`).getDownloadURL()
        //         .then((url) => {
        //             dispatch({ type: GET_PROFILE_PICTURE, pic: url })
        //         })
        // })

    }
}

export const getUser = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        peopleRef.doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    let user = doc.data()
                    dispatch({ type: GET_USER, user: user })
                } else {
                    console.log("Person document does not exist");
                }
            })
            .catch((error) => {
                console.log("Error getting User:", error);
            });

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

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)

    }
}

export const updateUser = (userData) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId
        userData.id = userId

        peopleRef.doc(userId).set(userData, { merge: true })
            .then(() => {
                dispatch({ type: UPDATE_USER, userData: userData })
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
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