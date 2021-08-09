import {
    DELETE_BET,
    GET_BETS,
    UPDATE_BET,
    CREATE_BET
} from '../actions/bets';

const initialState = {
    bets: [],
}

const betsReducer = (state = initialState, action) => {
    let updatedArr = [...state.bets]
    let sortedByLastUpdated = []
    switch (action.type) {
        case GET_BETS:
            sortedByLastUpdated = action.bets.sort((a,b) => b.lastUpdated - a.lastUpdated)
            return {...state, bets: sortedByLastUpdated}

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
                let placeToTop = bet.complete != newData.complete ? true : false
                if (bet.id === newData.id) {
                    bet.amount = newData.amount
                    bet.otherBettor = newData.otherBettor
                    bet.description = newData.description
                    bet.complete = newData.complete
                    bet.wonBet = newData.wonBet

                    if (placeToTop) {
                        updatedArr.splice(index, 1)
                        updatedArr.unshift(bet)
                    }
                }

            })
            sortedByLastUpdated = updatedArr.sort((a,b) => b.lastUpdated - a.lastUpdated)

            return { ...state, bets: updatedArr }
        default:
            return state
    }

}

export default betsReducer;