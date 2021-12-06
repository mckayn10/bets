import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import NavBar from '../components/NavBar';
import Colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBets } from '../store/actions/bets';
import { getUser, getUserPic } from '../store/actions/auth';
import { fetchAllFriends } from '../store/actions/friends';
import { fetchNotifications, fetchPendingRequests } from '../store/actions/notifications';
import HeaderText from '../components/HeaderText';
import { Ionicons } from '@expo/vector-icons';
import TestComponent from '../components/TestComponent';
import BetList from '../components/BetList';
import { completedCriteria, pendingCriteria } from '../constants/utils';
import UploadImage from '../components/UploadImage';

function Home_Screen(props) {

  const [showComplete, setShowComplete] = useState(true);
  const [completedBets, setCompletedBets] = useState([]);
  const [pendingBets, setPendingBets] = useState([]);

  const dispatch = useDispatch()

  const bets = useSelector(state => state.bets.bets)
  const userId = useSelector(state => state.auth.userId)

  useEffect(() => {
    dispatch(fetchBets())
    dispatch(getUser())
    dispatch(fetchAllFriends())
    dispatch(fetchNotifications())
    dispatch(fetchPendingRequests())
    // dispatch(getUserPic())

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
      return x.date_complete - y.date_complete;
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
      return x.date - y.date
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
      {/* <UploadImage /> */}
      {/* <TestComponent /> */}
      {showComplete
        ? <BetList {...props} bets={completedBets} permissions={true} personId={userId}/>
        : <BetList {...props} bets={pendingBets} permissions={true} personId={userId}/>
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