import { formatBetArrayOfObjects } from '../../constants/utils';
import {
    DELETE_BET,
    GET_BETS,
    UPDATE_BET,
    CREATE_BET,
    REMOVE_DATA, GET_FEED_BETS,
    ADD_COMMENT,
    GET_COMMENTS
} from '../actions/bets';

const initialState = {
    bets: [],
    feedBets: [],
    comments: []
}

const betsReducer = (state = initialState, action) => {
    let updatedArr = [...state.bets]
    let updatedFeedArr = [...state.feedBets]
    let commentsArr = [...state.comments]
    switch (action.type) {
        case REMOVE_DATA: {
            return initialState
        }
        case GET_COMMENTS:
            return { ...state, comments: action.comments }
        case GET_BETS:
            return { ...state, bets: action.bets }
        case GET_FEED_BETS:
            return {...state, bets: action.userBets, feedBets: action.feedBets }
        case CREATE_BET:
            updatedArr.unshift(action.bet)
            updatedFeedArr.unshift(action.bet)
            return { ...state, bets: updatedArr, feedBets: updatedFeedArr }

        case DELETE_BET:
            updatedArr.forEach((bet, index) => {
                if (bet.id === action.id) {
                    updatedArr.splice(index, 1)
                }
            })
            updatedFeedArr.forEach((bet, index) => {
                if (bet.id === action.id) {
                    updatedFeedArr.splice(index, 1)
                }
            })
            return { ...state, bets: updatedArr, feedBets: updatedFeedArr }

        case UPDATE_BET:

            const newData = action.bet
            updatedArr.forEach((bet, index) => {
                if (bet.id === newData.id) {
                    bet = newData
                }
            })
            updatedFeedArr.forEach((bet, index) => {
                if (bet.id === newData.id) {
                    bet = newData
                }
            })
            return { ...state, bets: updatedArr, feedBets: updatedFeedArr }
        case ADD_COMMENT:
            commentsArr.unshift(action.comment)
            return { ...state,  comments: commentsArr}
        default:
            return state
    }

}

export default betsReducer;