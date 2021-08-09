export const SIGN_UP = 'SIGN_UP'
export const SIGN_IN = 'SIGN_IN'

export const signUp = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBZ9IxUy8gB79DYcixiUnvymEmxGrPppsQ',
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
            throw new Error('Something went wrong with user sign up')
        }
        const resData = await response.json()
        console.log('resdata', resData)
        dispatch({
            type: SIGN_UP,
            user: resData
        })
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
            throw new Error('Something went wrong with user signin', response)
        }
        const resData = await response.json()
        console.log('resdata', resData)
        dispatch({
            type: SIGN_IN,
            user: resData
        })

    }
}