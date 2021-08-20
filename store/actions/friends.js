import db from '../../firebase/config';

export const GET_PEOPLE = 'GET_PEOPLE';
export const ADD_FRIEND = 'ADD_FRIEND';
export const GET_FRIENDS = 'GET_FRIENDS';

const url = `https://mybets-f9188-default-rtdb.firebaseio.com`

export const fetchAllPeople = () => {
    return async (dispatch, getState) => {
        const response = await fetch(`${url}/people.json`)

        if (!response.ok) {
            throw new Error('error creating bet')
        }
        const resData = await response.json()

        dispatch({
            type: GET_PEOPLE,
            people: resData
        })

    }
}

export const fetchAllFriends = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        const response = await fetch(`${url}/friends/${userId}.json`)

        if (!response.ok) {
            throw new Error('error creating bet')
        }
        const resData = await response.json()

        dispatch({
            type: GET_FRIENDS,
            friends: resData
        })

    }
}


export const addFriend = (friend) => {
    return (dispatch, getState) => {
        const userId = getState().auth.userId
        console.log(friend)

        db.ref('friends/' + userId + '/' + friend.id).set(friend)
            .then(res => {
                return true
            })
            .catch(err => {
                throw new Error('Error saving new friend to database. ' + err)
            })

        dispatch({
            type: ADD_FRIEND,
            friend: friend
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