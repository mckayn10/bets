export const CREATE_BET = 'CREATE_BET';
export const UPDATE_MODAL = 'UPDATE_MODAL';
export const UPDATE_BET = 'UPDATE_BET';
export const DELETE_BET = 'DELETE_BET';
export const GET_BETS = 'GET_BETS';
export const REMOVE_DATA = 'REMOVE_DATA'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`


export const fetchBets = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        const response = await fetch(`${url}/bets/${userId}.json`)

        if (!response.ok) {
            throw new Error('error creating bet')
        }
        const resData = await response.json()

        dispatch({
            type: GET_BETS,
            bets: resData
        })

    }
}


export const createBet = (betData) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        betData.date_complete = betData.is_complete ? Date.now() : 0
        betData.date = new Date().toLocaleDateString()
        betData.user_id = userId
        betData.is_double_or_nothing = false
        betData.is_verified = false

        const response = await fetch(`${url}/bets/${userId}.json?auth=${token}`, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(betData)
        })

        if (!response.ok) {
            throw new Error('error creating bet')
        }
        const resData = await response.json()
        betData.id = resData.name
        dispatch({
            type: CREATE_BET,
            bet: betData
        })

    }
}

export const updateBet = (betData, statusChanged) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        betData.date_complete = statusChanged && betData.is_complete ? Date.now() : betData.date_complete
        betData.user_id = userId

        const response = await fetch(`${url}/bets/${userId}/${betData.id}.json?auth=${token}`, {
            method: 'PATCH',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(betData)
        })
        if (!response.ok) {
            throw new Error('error updating bet')
        }
        
        dispatch({
            type: UPDATE_BET,
            bet: betData
        })
    }
}

export const deleteBet = (betId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId
        const response = await fetch(`${url}/bets/${userId}/${betId}.json?auth=${token}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error('error deleting bet')
        }
        dispatch({
            type: DELETE_BET,
            id: betId
        })
    }
}

export const removeData = () => {
    return {
        type: REMOVE_DATA
    }
}