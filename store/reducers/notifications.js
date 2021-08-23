import {
    GET_NOTIFICATIONS,
} from '../actions/notifications';

import { formatNotificationsArrayOfObjects } from '../../constants/utils';

const initialState = {
    notifications: [],
}

const notificationsReducer = (state = initialState, action) => {
    let notisArr = state.notifications
    switch (action.type) {
        case GET_NOTIFICATIONS:
            const notifications = formatNotificationsArrayOfObjects(action.notis)
            return { ...state, notifications: notifications }
        default:
            return state
    }

}

export default notificationsReducer;
