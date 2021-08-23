import db from "../../firebase/config";
import { useDispatch } from "react-redux";
import { sendBetOffer } from "./notifications";

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

        let result1 = []
        let result2 = []
        let allResults = []
        db.ref("bets").orderByChild("creator_id").equalTo(userId).on("value", function (snapshot) {
            result1 = snapshot.val()
            db.ref("bets").orderByChild("other_id").equalTo(userId).on("value", function (snapshot) {
                result2 = snapshot.val()
                allResults = {
                    ...result1,
                    ...result2
                }

                dispatch({
                    type: GET_BETS,
                    bets: allResults
                })
            });
        });



    }
}


export const createBet = (betData, sendBetNotification) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        betData.date_complete = betData.is_complete ? Date.now() : 0
        betData.date = new Date().toLocaleDateString()
        betData.creator_id = userId
        betData.is_double_or_nothing = false
        betData.other_id = betData.other_bettor.id

        const response = await fetch(`${url}/bets.json?auth=${token}`, {
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

        if (sendBetNotification) {
            sendBetOffer(betData)
        }

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

        db.ref('bets/' + betData.id).update(betData, (err) => {
            if (err) {
                console.err('Error updating bet')
            } else {
                console.log('Successfully updated bet')
            }
        })

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

        db.ref('bets/' + betId).remove()
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