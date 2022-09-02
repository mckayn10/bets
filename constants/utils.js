import React from 'react'
import { View, Text } from 'react-native';

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
      date: notisArr[key].date,
      from: notisArr[key].from,
      to: notisArr[key].to,
      type: notisArr[key].type,
      pending: notisArr[key].pending

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

export const checkIfShared = (bet, personId, userId) => {
  return bet.other_id === personId && bet.creator_id === userId || bet.other_id === userId && bet.creator_id === personId
}

export function formatTimeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

export const timezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const formatDate = (date) => {

// ET timezone offset in hours.
  var timezone = date.getTimezoneOffset() / -60;
// Timezone offset in minutes + the desired offset in minutes, converted to ms.
// This offset should be the same for ALL date calculations, so you should only need to calculate it once.
  var offset = (date.getTimezoneOffset() + (timezone * 60)) * 60 * 1000;

let finalTime = new Date().setTime(date.getTime() + offset);

  return new Date(finalTime).toLocaleString()
}

