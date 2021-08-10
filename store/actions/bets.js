export const CREATE_BET = 'CREATE_BET';
export const UPDATE_MODAL = 'UPDATE_MODAL';
export const UPDATE_BET = 'UPDATE_BET';
export const DELETE_BET = 'DELETE_BET';
export const GET_BETS = 'GET_BETS';

export const fetchBets = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        const response = await fetch(`https://mybets-f9188-default-rtdb.firebaseio.com/bets/${userId}/.json`)

        if (!response.ok) {
            throw new Error('error creating bet')
        }
        const resData = await response.json()

        const loadedBets = [];
        for (const key in resData) {
            let bet = {
                id: key,
                otherBettor: resData[key].otherBettor,
                amount: resData[key].amount,
                date: resData[key].date,
                description: resData[key].description,
                complete: resData[key].complete,
                wonBet: resData[key].wonBet,
            }
            loadedBets.push(bet)
            
        }

        dispatch({
            type: GET_BETS,
            bets: loadedBets
        })

    }
}


export const createBet = (betData) => {
    const { otherBettor, description, amount, wonBet, complete } = betData
    const date = new Date().toLocaleDateString()
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId
        const response = await fetch(`https://mybets-f9188-default-rtdb.firebaseio.com/bets/${userId}.json?auth=${token}`, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                otherBettor,
                description,
                amount,
                date: date,
                wonBet,
                complete,
                userId: userId
            })
        })

        if (!response.ok) {
            throw new Error('error creating bet')
        }
        const resData = await response.json()
        dispatch({
            type: CREATE_BET,
            bet: {
                id: resData.name,
                date,
                otherBettor,
                description,
                amount,
                wonBet,
                complete,
            }
        })

    }
}

export const updateBet = (betData) => {
    const { otherBettor, description, amount, wonBet, complete, date} = betData

    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId
    
        const response = await fetch(
            `https://mybets-f9188-default-rtdb.firebaseio.com/bets/${userId}/${betData.id}.json?auth=${token}`, {
            method: 'PUT',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                otherBettor,
                description,
                amount,
                date,
                wonBet,
                complete,
            })
        })
        if (!response.ok) {
            throw new Error('error updating bet')
        }
        const resData = await response.json()
        dispatch({
            type: UPDATE_BET,
            bet: betData
        })
    }
}

export const deleteBet = (id) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const response = await fetch(
            `https://mybets-f9188-default-rtdb.firebaseio.com/bets/${id}.json?auth=${token}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error('error deleting bet')
        }
        const resData = await response.json()
        dispatch({
            type: DELETE_BET,
            id: id
        })
    }
}