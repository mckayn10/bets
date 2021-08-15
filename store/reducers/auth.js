import {
    AUTHENTICATE,
    LOGOUT,
    UPDATE_USER
} from '../actions/auth';

const initialState = {
    userId: null,
    token: null,
    userInfo: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                userInfo: action.userInfo
            }
        case LOGOUT: {
            return initialState
        }
        case UPDATE_USER: {
            return {...state, userInfo: action.userData}
        }

        default:
            return state
    }
}

export default authReducer;