import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import NavBar from '../components/NavBar';
import Completed_Bets_Screen from './Completed_Bets_Screen';
import Incomplete_Bets_Screen from './Incomplete_Bets_Screen';
import Colors from '../constants/colors'
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBets } from '../store/actions/bets';
import { getUser } from '../store/actions/auth';
import { fetchAllFriends } from '../store/actions/friends';
import { fetchNotifications, fetchPendingRequests } from '../store/actions/notifications';
import HeaderText from '../components/HeaderText';
import { Ionicons } from '@expo/vector-icons';
import db from '../firebase/config'
import TestComponent from '../components/TestComponent';
import Create_Bet_Screen from './Create_Bet_Screen';
import BetList from '../components/BetList';
import { completedCriteria, pendingCriteria } from '../constants/utils';

function Home_Screen(props) {

  const [showComplete, setShowComplete] = useState(true);
  const [completedBets, setCompletedBets] = useState([]);
  const [pendingBets, setPendingBets] = useState([]);

  const dispatch = useDispatch()

  const bets = useSelector(state => state.bets.bets)

  useEffect(() => {
    dispatch(fetchBets())
    dispatch(getUser())
    dispatch(fetchAllFriends())
    dispatch(fetchNotifications())
    dispatch(fetchPendingRequests())
  }, [])

  useEffect(() => {
    try {
      if (props.route.params) {
        setShowComplete(props.route.params.showComplete)
      }
    }
    catch (err) {
      console.error(err)
    }

  }, [props.route.params])

  useEffect(() => {
    getCompletedBets()
    getPendingBets()
  }, [bets])

  const getCompletedBets = () => {
    let completed = []
    bets.forEach((bet) => {
      let isComplete = completedCriteria(bet)
      if (isComplete) {
        completed.push(bet)
      }
    })
    completed.sort(function (x, y) {
      return y.date_complete - x.date_complete;
    })

    setCompletedBets(completed)
  }

  const getPendingBets = () => {
    let pending = []
    bets.forEach((bet) => {
      let isPending = pendingCriteria(bet)
      if (isPending) {
        pending.push(bet)
      }
    })
    pending.sort(function (x, y) {
      return y.date - x.date
    })

    setPendingBets(pending)
  }

  return (

    <View style={styles.container}>
      <NavBar props={props} />
      <View style={styles.toggleScreenContainer}>
        <HeaderText style={showComplete ? styles.activeToggleText : styles.toggleText} onPress={() => setShowComplete(true)}>COMPLETE</HeaderText>
        <HeaderText style={!showComplete ? styles.activeToggleText : styles.toggleText} onPress={() => setShowComplete(false)}>PENDING</HeaderText>
      </View>
      {/* <TestComponent /> */}
      {showComplete
        ? <BetList bets={completedBets} permissions={true} />
        : <BetList bets={pendingBets} permissions={true} />
      }

      <TouchableOpacity
        style={styles.btnContainer}
      >
        <Ionicons
          name="create-outline"
          size={26}
          color='white'
          onPress={() => props.navigation.navigate('Create Bet')}
        />
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleScreenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayDark,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDark
  },
  btnContainer: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    top: 45,
    right: 15,
    borderRadius: 50,
    alignSelf: 'center',
  },
  toggleText: {
    flex: 1,
    color: Colors.backgroundColor,
    paddingTop: 12,
    paddingBottom: 13,
    fontSize: 12,
    textAlign: 'center',
  },
  activeToggleText: {
    flex: 1,
    color: Colors.primaryColor,
    backgroundColor: Colors.backgroundColor,
    paddingTop: 12,
    paddingBottom: 13,
    fontSize: 12,
    textAlign: 'center',
  }

});

export default Home_Screen