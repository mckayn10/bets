import db from '../../firebase/config';

export const SEND_BET = 'GET_PEOPLE';
export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS'

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`

export const fetchNotifications = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        db.ref("notifications").orderByChild("to/id").equalTo(userId).on("value", function (snapshot) {
            let results = snapshot.val()

            dispatch({
                type: GET_NOTIFICATIONS,
                notis: results
            })
        });

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

    db.ref('notifications/' + betData.other_id).set(notiData)
        .then(res => {
            console.log(res)
            return true
        })
        .catch(err => {
            throw new Error('Error saving new user to database. ' + err)
        })
}

