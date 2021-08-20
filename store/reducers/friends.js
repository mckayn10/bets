import {
    GET_PEOPLE,
    ADD_FRIEND,
    GET_FRIENDS
} from '../actions/friends';

const initialState = {
    people: [],
    friends: []
}

const peopleReducer = (state = initialState, action) => {
    let friendsArr = state.friends
    switch (action.type) {
        case GET_PEOPLE:
            const loadedPeople = [];
            for (const key in action.people) {
                let person = {
                    id: key,
                    firstName: action.people[key].firstName,
                    lastName: action.people[key].lastName,
                    email: action.people[key].email,
                    username: action.people[key].username,
                }
                loadedPeople.push(person)
            }
            return { ...state, people: loadedPeople }
        case ADD_FRIEND:
            friendsArr.push(action.friend)
            return { ...state, friends: friendsArr }
        case GET_FRIENDS:
            const loadedFriends = [];
            for (const key in action.friends) {
                let friend = {
                    id: key,
                    firstName: action.friends[key].firstName,
                    lastName: action.friends[key].lastName,
                    email: action.friends[key].email,
                    username: action.friends[key].username,
                }
                loadedFriends.push(friend)
            }
            return { ...state, friends: loadedFriends }
        default:
            return state
    }

}

export default peopleReducer;