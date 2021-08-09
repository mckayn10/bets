export const CREATE_BET = 'CREATE_BET';
export const UPDATE_MODAL = 'UPDATE_MODAL';
export const UPDATE_BET = 'UPDATE_BET';
export const DELETE_BET = 'DELETE_BET';
export const GET_BETS = 'GET_BETS';

export const fetchBets = () => {
    return dispatch => {
        fetch('https://mybets-f9188-default-rtdb.firebaseio.com/bets.json')
            .then(response => response.json())
            .then(resData => {
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
                        lastUpdated: Date.now()
                    }
                    loadedBets.push(bet)

                }
                dispatch({
                    type: GET_BETS,
                    bets: loadedBets
                })

            })
            .catch(error => {
                console.log('Error loading bets', error)

            })
    }
}


export const createBet = (betData) => {
    const { otherBettor, description, amount, wonBet, complete } = betData
    const date = new Date().toLocaleDateString()
    const lastUpdated = Date().toString()
    return dispatch => {
        fetch('https://mybets-f9188-default-rtdb.firebaseio.com/bets.json', {
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
                lastUpdated: lastUpdated
            })
        })
            .then(response => response.json())
            .then(resData => {
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
                        lastUpdated
                    }
                })

            })
            .catch(error => {
                console.log('Error saving bet', error)

            })
    }
}

export const updateBet = (betData) => {
    const { otherBettor, description, amount, wonBet, complete, date } = betData

    return async dispatch => {
        const response = await fetch(
            `https://mybets-f9188-default-rtdb.firebaseio.com/bets/${betData.id}.json`, {
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
                lastUpdate: Date().toString()
            })
        })
        const resData = await response.json()
        dispatch({
            type: UPDATE_BET,
            bet: betData
        })
    }
}

export const deleteBet = (id) => {
    return async dispatch => {
        await fetch(
            `https://mybets-f9188-default-rtdb.firebaseio.com/bets/${id}.json`, {
            method: 'DELETE',
        })
        dispatch({
            type: DELETE_BET,
            id: id
        })
    }
}