import { formatBetArrayOfObjects } from '../../constants/utils';
import {
    DELETE_BET,
    GET_BETS,
    UPDATE_BET,
    CREATE_BET,
    REMOVE_DATA, GET_FEED_BETS
} from '../actions/bets';

const initialState = {
    bets: [],
    feedBets: []
}

const betsReducer = (state = initialState, action) => {
    let updatedArr = [...state.bets]
    switch (action.type) {
        case REMOVE_DATA: {
            return initialState
        }
        case GET_BETS:
            return { ...state, bets: action.bets }
        case GET_FEED_BETS:
            return {...state, feedBets: action.bets }
        case CREATE_BET:
            updatedArr.unshift(action.bet)
            return { ...state, bets: updatedArr }

        case DELETE_BET:
            updatedArr.forEach((bet, index) => {
                if (bet.id === action.id) {
                    updatedArr.splice(index, 1)
                }
            })
            return { ...state, bets: updatedArr }

        case UPDATE_BET:

            const newData = action.bet
            updatedArr.forEach((bet, index) => {
                if (bet.id === newData.id) {
                    bet = newData
                }
            })

            return { ...state, bets: updatedArr }
        default:
            return state
    }

}

export default betsReducer;