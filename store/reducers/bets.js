import {
    DELETE_BET,
    GET_BETS,
    UPDATE_BET,
    CREATE_BET,
    REMOVE_DATA
} from '../actions/bets';

const initialState = {
    bets: [],
}

const betsReducer = (state = initialState, action) => {
    let updatedArr = [...state.bets]
    switch (action.type) {
        case REMOVE_DATA: {
            return initialState
        }
        case GET_BETS:
            const loadedBets = [];
            for (const key in action.bets) {
                let bet = {
                    id: key,
                    other_bettors: action.bets[key].other_bettors,
                    amount: action.bets[key].amount,
                    date: action.bets[key].date,
                    description: action.bets[key].description,
                    is_complete: action.bets[key].is_complete,
                    won_bet: action.bets[key].won_bet,
                    date_complete: action.bets[key].date_complete

                }
                loadedBets.push(bet)
            }

            loadedBets.sort(function (x, y) {
                return y.date_complete - x.date_complete;
            })
            return { ...state, bets: loadedBets }

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
                let placeToTop = bet.is_complete != newData.is_complete ? true : false
                if (bet.id === newData.id) {
                    bet.amount = newData.amount
                    bet.other_bettors = newData.other_bettors
                    bet.description = newData.description
                    bet.is_complete = newData.is_complete
                    bet.won_bet = newData.won_bet
                    bet.date = newData.date


                    if (placeToTop) {
                        updatedArr.splice(index, 1)
                        updatedArr.unshift(bet)
                    }
                }

            })

            return { ...state, bets: updatedArr }
        default:
            return state
    }

}

export default betsReducer;