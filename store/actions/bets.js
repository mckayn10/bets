// import { db } from "../../firebase/config";
import { db } from "../../firebase/firestore";
import { useDispatch } from "react-redux";
import { sendBetOffer } from "./notifications";
import { completedCriteria } from "../../constants/utils";
import {fetchAllFriendsIds} from "./friends";

export const CREATE_BET = 'CREATE_BET';
export const UPDATE_MODAL = 'UPDATE_MODAL';
export const UPDATE_BET = 'UPDATE_BET';
export const DELETE_BET = 'DELETE_BET';
export const GET_BETS = 'GET_BETS';
export const GET_FEED_BETS = 'GET_FEED_BETS';
export const REMOVE_DATA = 'REMOVE_DATA'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`
const betsRef = db.collection('bets')
const friendsRef = db.collection('friends')




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

const setUserBets = (allFeedBets, userId) => {
        let betsArr = []

        allFeedBets.forEach(bet => {
            if(bet.creator_id === userId || bet.other_id === userId){
                betsArr.push(bet)
            }
        })
        dispatch({ type: GET_BETS, bets: betsArr })
}

export const fetchFeedBets = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        let idsList = []
        friendsRef.doc(userId).collection('friendsList')
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    idsList.unshift(doc.id)
                });

                function sliceIntoChunks(arr, chunkSize) {
                    const res = [];
                    for (let i = 0; i < arr.length; i += chunkSize) {
                        const chunk = arr.slice(i, i + chunkSize);
                        res.push(chunk);
                    }
                    return res;
                }
                idsList.push(userId)
                let chunkedArr = sliceIntoChunks(idsList, 10)

                let betsArr = []
                let feedBets = []
                let userBets = []
                chunkedArr.forEach(chunk => {
                    betsRef.where('creator_id', 'in', chunk).get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(doc => {
                                let bet = doc.data()
                                bet.id = doc.id
                                betsArr.unshift(bet)
                                if(bet.creator_id === userId || bet.other_id === userId){
                                    userBets.unshift(bet)
                                }
                            })
                            betsRef.where('other_id', 'in', chunk).get()
                                .then(querySnapshot => {
                                    querySnapshot.forEach(doc => {
                                        let bet = doc.data()
                                        bet.id = doc.id
                                        betsArr.unshift(bet)
                                        if(bet.creator_id === userId || bet.other_id === userId){
                                            userBets.unshift(bet)
                                        }
                                    })
                                    let uniqueIds = []
                                    feedBets = betsArr.filter(element => {
                                        const isDuplicate = uniqueIds.includes(element.id);

                                        if (!isDuplicate) {
                                            uniqueIds.push(element.id);
                                            return true;
                                        }
                                        return false;
                                    });
                                    dispatch({
                                        type: GET_FEED_BETS,
                                        feedBets: feedBets,
                                        userBets: userBets
                                    })
                                })
                        })
                })
            })
    }
}


export const createBet = (betData, sendBetNotification) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        betData.date_complete = completedCriteria(betData) ? Date.now() : 0
        betData.date = Date.now()
        betData.creator_id = userId
        betData.is_double_or_nothing = false
        betData.other_id = betData.other_bettor.id

        betsRef.add(betData)
            .then((docRef) => {
                betData.id = docRef.id

                if (sendBetNotification) {
                    let notificationType = 'betRequest'
                    sendBetOffer(betData, notificationType)
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