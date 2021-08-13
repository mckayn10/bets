import AsyncStorage from '@react-native-async-storage/async-storage';

export const SIGN_UP = 'SIGN_UP'
export const SIGN_IN = 'SIGN_IN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

export const authenticate = (userId, token, userInfo) => {
    return {
        type: AUTHENTICATE,
        userId: userId,
        token: token,
        userInfo: userInfo
    }
}

const createPerson = async (userId, token, userData) => {

    const response = await fetch(`https://mybets-f9188-default-rtdb.firebaseio.com/people/${userId}.json?auth=${token}`, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                username: userData.username

            })
        })
        if (!response.ok) {
            throw new Error('Error saving new user to the database')
        }
        const resData = await response.json()
        return resData
}

export const signUp = (userInfo) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBZ9IxUy8gB79DYcixiUnvymEmxGrPppsQ',
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
            if(errorId === 'EMAIL_EXISTS'){
                message = 'Email address already exists.'
            } else if (errorId === 'WEAK_PASSWORD : Password should be at least 6 characters'){
                message = 'Password must be at least 6 characters.'
            }
            throw new Error(message)
        }
        const resData = await response.json()

        const newPerson = await createPerson(resData.localId, resData.idToken, userInfo)

        dispatch(authenticate(resData.localId, resData.idToken, userInfo))

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)

    }
}

export const signIn = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBZ9IxUy8gB79DYcixiUnvymEmxGrPppsQ',
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

            if(errorId === 'EMAIL_NOT_FOUND'){
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
        expiryDate: expirationDate.toISOString()
    }))
}