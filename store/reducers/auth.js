import {
    AUTHENTICATE,
    GET_PROFILE_PICTURE,
    GET_USER,
    LOGOUT,
    UPDATE_USER
} from '../actions/auth';

const initialState = {
    userId: null,
    token: null,
    userInfo: null,
    profPic: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
            }
        case LOGOUT: {
            return initialState
        }
        case UPDATE_USER: {
            return {...state, userInfo: action.userData}
        }
        case GET_USER: {
            return {...state, userInfo: action.user}
        }
        case GET_PROFILE_PICTURE: {
            return {...state, profPic: action.pic}
        }

        default:
            return state
    }
}

export default authReducer;