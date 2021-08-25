import {
    GET_PEOPLE,
    ADD_FRIEND,
    GET_FRIENDS,
    REMOVE_FRIEND
} from '../actions/friends';

const initialState = {
    people: [],
    friends: []
}

const peopleReducer = (state = initialState, action) => {
    let friendsArr = state.friends
    switch (action.type) {
        case GET_PEOPLE:
            return { ...state, people: action.people }
        case ADD_FRIEND:
            return { ...state, friends: friendsArr }
        case GET_FRIENDS:
            return { ...state, friends: action.friends }
        case REMOVE_FRIEND:
            friendsArr.forEach((friend, index) => {
                if (friend.id === action.id) {
                    friendsArr.splice(index, 1)
                }
            })
            return { ...state, bets: friendsArr }
        default:
            return state
    }

}

export default peopleReducer;