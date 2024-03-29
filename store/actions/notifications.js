import { db } from "../../firebase/firestore";
import {sendPushNotificationHandler} from "../../push_notifications/push_notifications";

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

        notisRef.where("from.id", "==", userId).where("pendingAction", "==", true)
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

export const sendBetOffer = async (betData, type) => {

    let notiData = {
        date: Date.now(),
        from: betData.creator,
        to: betData.other_bettor,
        type: type,
        data: betData,
        pendingAction: true,
        seen: false
    }
    notisRef.add(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!')
            let pushNotiData = {
                pushId: notiData.to.pushId,
                title: 'New Bet Offer',
                body: `${betData.creator.firstName} has sent you a bet offer for $${betData.amount}`
            }
            sendPushNotificationHandler(pushNotiData)

        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

export const sendCommentAddedNotification = async (data, type) => {

    let notiData = {
        date: Date.now(),
        from: data.commentor,
        to: data.creator,
        type: type,
        data: data,
        pendingAction: true,
        seen: false
    }
    if(data.commentor.id != data.creator.id){
        notisRef.add(notiData)
            .then((docRef) => {
                console.log('Notification successfully sent!')
                let pushNotiData = {
                    pushId: notiData.to.pushId,
                    title: 'New Comment',
                    body: `${data.commentor.firstName} has commented on your bet`
                }
                sendPushNotificationHandler(pushNotiData)

            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
    if(data.other_bettor.id != 0 && data.other_bettor.id != data.commentor.id){
        let notiData2 = {
            date: Date.now(),
            from: data.commentor,
            to: data.other_bettor,
            type: type,
            data: data,
            pendingAction: true,
            seen: false
        }
        notisRef.add(notiData2)
            .then((docRef) => {
                console.log('Notification successfully sent!')
                let pushNotiData = {
                    pushId: notiData2.to.pushId,
                    title: 'New Comment',
                    body: `${data.commentor.firstName} has commented on your bet`
                }
                sendPushNotificationHandler(pushNotiData)

            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
}

export const sendBetUpdate = async (betData, user, other_bettor, type) => {

    let notiData = {
        date: Date.now(),
        from: user,
        to: other_bettor,
        type: type,
        data: betData,
        pendingAction: true,
        seen: false
    }

    notisRef.add(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!')
            let pushNotiData = {
                pushId: notiData.to.pushId,
                title: 'Bet Update Request',
                body: `${notiData.from.firstName} has requested a change to your bet for $${parseFloat(betData.amount).toFixed(2)}`
            }
            sendPushNotificationHandler(pushNotiData)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

export const sendBetDeleteRequest = async (betData, user, other_bettor, type) => {

    let notiData = {
        date: Date.now(),
        from: user,
        to: other_bettor,
        type: type,
        data: betData,
        pendingAction: true,
        seen: false
    }

    notisRef.add(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!')
            let pushNotiData = {
                pushId: notiData.to.pushId,
                title: 'Bet Delete Request',
                body: `${notiData.from.firstName} has requested to delete your bet for $${parseFloat(betData.amount).toFixed(2)}`
            }
            sendPushNotificationHandler(pushNotiData)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

export const sendBetDeleteResponse = async (betData, user, other_bettor, type) => {

    let notiData = {
        date: Date.now(),
        from: user,
        to: other_bettor,
        type: type,
        data: betData,
        pendingAction: false,
        seen: false
    }

    notisRef.add(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!')
            let pushNotiData = {
                pushId: notiData.to.pushId,
                title: 'Bet Deletion Update',
                body: `${notiData.from.firstName} responded to your request to delete your bet for $${parseFloat(betData.amount).toFixed(2)}`
            }
            sendPushNotificationHandler(pushNotiData)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

export const sendBetUpdateResponse = async (betData, user, other_bettor, type) => {

    let notiData = {
        date: Date.now(),
        from: user,
        to: other_bettor,
        type: type,
        data: betData,
        pendingAction: false,
        seen: false
    }

    notisRef.add(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!')
            let pushNotiData = {
                pushId: notiData.to.pushId,
                title: 'Bet Update Response',
                body: `${notiData.from.firstName} has responded to your proposal to update your bet for $${parseFloat(betData.amount).toFixed(2)}`
            }
            sendPushNotificationHandler(pushNotiData)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

export const sendBetResponse = async (betData, type) => {

    let notiData = {
        date: Date.now(),
        from: betData.other_bettor,
        to: betData.creator,
        type: type,
        data: betData,
        pendingAction: false,
        seen: false
    }

    notisRef.add(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!')
            let pushNotiData = {
                pushId: notiData.to.pushId,
                title: 'Bet Offer Response',
                body: `${notiData.from.firstName} has responded to your bet offer for $${parseFloat(betData.amount).toFixed(2)}`
            }
            sendPushNotificationHandler(pushNotiData)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

}

export const sendFriendRequest = async (user, person, type) => {

    let notiData = {
        date: Date.now(),
        from: user,
        to: person,
        type: type,
        data: {},
        pendingAction: true,
        seen: false
    }


    notisRef.add(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!')
            let pushNotiData = {
                pushId: notiData.to.pushId,
                title: '',
                body: `${notiData.from.firstName} has sent you a friend request`
            }
            sendPushNotificationHandler(pushNotiData)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

export const sendFriendRequestAccepted = async (user, person, type) => {

    let notiData = {
        date: Date.now(),
        from: user,
        to: person,
        type: type,
        data: {},
        pendingAction: false,
        seen: false
    }


    notisRef.add(notiData)
        .then((docRef) => {
            console.log('Notification successfully sent!')
            let pushNotiData = {
                pushId: notiData.to.pushId,
                title: '',
                body: `${notiData.from.firstName} accepted your friend request`
            }
            sendPushNotificationHandler(pushNotiData)
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

export const deleteNotification = (id) => {

    notisRef.doc(id).delete()
        .then(() => {
            console.log('Notification successfully deleted!')
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });


}

export const markAsSeen = (noti) => {
    noti.seen = true

    notisRef.doc(noti.id).update(noti)
        .then((res) => {
            console.log('Marked as Seen')
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });


}

