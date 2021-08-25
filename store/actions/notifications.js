import db from "../../firebase/firestore";

export const SEND_BET = 'GET_PEOPLE';
export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS'
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION'
export const GET_PENDING_REQUESTS = 'GET_SENT_REQUESTS'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`
const notisRef = db.collection('notifications')

export const fetchNotifications = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        notisRef.where('to.id', '==', userId)
            .onSnapshot(querySnapshot => {
                let notisArr = []
                querySnapshot.forEach((doc) => {
                    let noti = doc.data()
                    noti.id = doc.id
                    notisArr.unshift(noti)
                });
                dispatch({ type: GET_NOTIFICATIONS, notis: notisArr })
            })

    }
}

export const fetchPendingRequests = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        notisRef.where("from.id", "==", userId).where("pending", "==", true)
            .onSnapshot((querySnapshot) => {
                let pendingArr = []
                querySnapshot.forEach((doc) => {
                    let noti = doc.data()
                    noti.id = doc.id
                    pendingArr.unshift(noti)
                });
                dispatch({
                    type: GET_PENDING_REQUESTS,
                    pendingRequests: pendingArr
                })
            })
    }
}

export const sendBetOffer = async (betData) => {

    let notiData = {
        date: Date.now(),
        from: betData.creator,
        to: betData.other_bettor,
        type: 'bet',
        data: {
            bet_id: betData.id,
            description: betData.description,
            amount: betData.amount
        }
    }

    notisRef.doc(betData.other_id).set(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!', docRef)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

}

export const sendFriendRequest = async (user, person) => {

    let notiData = {
        date: Date.now(),
        from: user,
        to: person,
        type: 'friend',
        data: {},
        pending: true,
    }


    notisRef.doc(person.id).set(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!', docRef)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

}

export const deleteNotification = (id) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        notisRef.doc(id).delete()
            .then(() => {
                dispatch({
                    type: DELETE_NOTIFICATION,
                    id: id
                })
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });




    }
}

