import {
    DELETE_NOTIFICATION,
    GET_NOTIFICATIONS,
   GET_PENDING_REQUESTS,
} from '../actions/notifications';

import { formatNotificationsArrayOfObjects } from '../../constants/utils';

const initialState = {
    notifications: [],
    pendingRequests: []
}

const notificationsReducer = (state = initialState, action) => {
    let notisArr = [...state.notifications]
    switch (action.type) {
        case GET_NOTIFICATIONS:
            return { ...state, notifications: action.notis }
        case DELETE_NOTIFICATION: {
            return {...state, notifications: notisArr}
        }
        case GET_PENDING_REQUESTS: {
            return { ...state, pendingRequests: action.pendingRequests }
        }
        default:
            return state
    }

}

export default notificationsReducer;
