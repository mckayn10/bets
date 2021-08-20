export const formatBetArrayOfObjects = (betsArr) => {
    const newBetsArr = [];
    for (const key in betsArr) {
        let bet = {
            id: key,
            other_bettors: betsArr[key].other_bettors,
            amount: betsArr[key].amount,
            date: betsArr[key].date,
            description: betsArr[key].description,
            is_complete: betsArr[key].is_complete,
            won_bet: betsArr[key].won_bet,
            date_complete: betsArr[key].date_complete,
            is_double_or_nothing: betsArr[key].is_double_or_nothing,
            is_verified: betsArr[key].is_verified,
            user_id: betsArr[key].user_id
        }
        newBetsArr.push(bet)
    }
    newBetsArr.sort(function (x, y) {
        return y.date_complete - x.date_complete;
    })

    return newBetsArr
}