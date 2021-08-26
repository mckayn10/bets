// import db from "../../firebase/config";
import db from "../../firebase/firestore";
import { useDispatch } from "react-redux";
import { sendBetOffer } from "./notifications";

export const CREATE_BET = 'CREATE_BET';
export const UPDATE_MODAL = 'UPDATE_MODAL';
export const UPDATE_BET = 'UPDATE_BET';
export const DELETE_BET = 'DELETE_BET';
export const GET_BETS = 'GET_BETS';
export const REMOVE_DATA = 'REMOVE_DATA'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`
const betsRef = db.collection('bets')



export const fetchBets = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        let betsArr = []

        betsRef.where("creator_id", "==", userId).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let bet = doc.data()
                    bet.id = doc.id
                    betsArr.unshift(bet)
                });
                betsRef.where("other_id", "==", userId).where("is_accepted", "==", true).get()
                    .then(querySnapshot => {
                        querySnapshot.forEach((doc) => {
                            let bet = doc.data()
                            bet.id = doc.id
                            betsArr.unshift(bet)
                        });

                        dispatch({ type: GET_BETS, bets: betsArr })
                    })
            })
    }
}


export const createBet = (betData, sendBetNotification) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        betData.date_complete = betData.is_complete ? Date.now() : 0
        betData.date = Date.now()
        betData.creator_id = userId
        betData.is_double_or_nothing = false
        betData.other_id = betData.other_bettor.id

        betsRef.add(betData)
            .then((docRef) => {
                betData.id = docRef.id

                if (sendBetNotification) {
                    sendBetOffer(betData)
                }

                dispatch({
                    type: CREATE_BET,
                    bet: betData
                })
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
}

export const updateBet = (betData, statusChanged) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        betData.date_complete = statusChanged && betData.is_complete ? Date.now() : betData.date_complete

        betsRef.doc(betData.id).update(betData)
            .then(() => {
                console.log("Document successfully updated!");
                dispatch({
                    type: UPDATE_BET,
                    bet: betData
                })
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}

export const deleteBet = (betId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        betsRef.doc(betId).delete()
            .then(() => {
                console.log("Document successfully deleted!");
                dispatch({
                    type: DELETE_BET,
                    id: betId
                })
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
    }
}

export const removeData = () => {
    return {
        type: REMOVE_DATA
    }
}