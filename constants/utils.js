export const formatBetArrayOfObjects = (betsArr) => {
    const newBetsArr = [];
    for (const key in betsArr) {
        let bet = {
            id: key,
            other_bettor: betsArr[key].other_bettor,
            amount: betsArr[key].amount,
            date: betsArr[key].date,
            description: betsArr[key].description,
            is_complete: betsArr[key].is_complete,
            is_double_or_nothing: betsArr[key].is_double_or_nothing,
            is_verified: betsArr[key].is_verified,
            is_accepted: betsArr[key].is_accepted,
            won_bet: betsArr[key].won_bet,
            date_complete: betsArr[key].date_complete,
            creator_id: betsArr[key].creator_id,
            creator: betsArr[key].creator,
            other_id: betsArr[key].other_id
        }
        newBetsArr.push(bet)
    }
    newBetsArr.sort(function (x, y) {
        return y.date_complete - x.date_complete;
    })

    return newBetsArr
}

export const formatNotificationsArrayOfObjects = (notisArr) => {
    const newNotisArr = [];
    for (const key in notisArr) {
        let noti = {
            id: key,
            data: notisArr[key].data,
            date: Date(notisArr[key].date),
            from: notisArr[key].from,
            to: notisArr[key].to,
            type: notisArr[key].type,

        }
        newNotisArr.unshift(noti)
    }

    return newNotisArr
}


export const completedCriteria = (bet) => {   
    return bet.is_complete && !bet.is_verified || bet.is_complete && bet.is_accepted
}

export const pendingCriteria = (bet) => {   
    return !bet.is_complete && !bet.is_verified || bet.is_verified && !bet.is_accepted || bet.is_accepted && !bet.is_complete
}
