// import { db } from "../../firebase/config";
import { db } from "../../firebase/firestore";
import { useDispatch } from "react-redux";
import { sendBetOffer } from "./notifications";
import { completedCriteria } from "../../constants/utils";

export const CREATE_BET = 'CREATE_BET';
export const UPDATE_MODAL = 'UPDATE_MODAL';
export const UPDATE_BET = 'UPDATE_BET';
export const DELETE_BET = 'DELETE_BET';
export const GET_BETS = 'GET_BETS';
export const REMOVE_DATA = 'REMOVE_DATA'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`
const betsRef = db.collection('bets')
var peopleRef = db.collection("people")

export const fetchBets = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        let betsArr = []

        betsRef.where("creator_id", "==", userId).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let bet = doc.data()
                    bet.id = doc.id
                    peopleRef.doc(userId).get().then((person) => {
                        bet.creator = person.data()
                        if (!bet.other_bettor) {
                            peopleRef.doc(bet.other_id).get().then((person) => {
                                bet.other_bettor = person.data()

                            })
                        }
                        betsArr.unshift(bet)

                    })

                });
                betsRef.where("other_id", "==", userId).where("is_accepted", "==", true).get()
                    .then(querySnapshot => {
                        querySnapshot.forEach((doc) => {
                            let bet = doc.data()
                            bet.id = doc.id
                            peopleRef.doc(bet.creator_id).get().then((person) => {
                                bet.creator = person.data()
                                peopleRef.doc(bet.other_id).get().then((person) => {
                                    bet.other_bettor = person.data()
                                    betsArr.unshift(bet)
                                    dispatch({ type: GET_BETS, bets: betsArr })

                                })
                            })

                        });
                    })
            })
    }
}


export const createBet = (betData, sendBetNotification) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId
        const userInfo = getState().auth.userInfo

        betData.date_complete = completedCriteria(betData) ? Date.now() : 0
        betData.date = Date.now()
        betData.is_double_or_nothing = false
        betsRef.add(betData)
            .then((docRef) => {
                betData.id = docRef.id

                if (sendBetNotification) {
                    let notificationType = 'betRequest'
                    sendBetOffer(betData, notificationType)
                }
                betData.creator = userInfo

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

        betData.date_complete = statusChanged && completedCriteria(betData) ? Date.now() : betData.date_complete
        betData.won_bet = betData.is_complete ? betData.won_bet : null

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