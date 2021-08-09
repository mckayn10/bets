import {
    SIGN_UP,
    SIGN_IN
} from '../actions/auth';

const initialState = {
    loggedInUser: {},
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_UP:
            return { ...state, loggedInUser: action.user }
        case SIGN_IN:
            return { ...state, loggedInUser: action.user }

        default:
            return state
    }

}

export default authReducer;