import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import betsReducer from './store/reducers/bets';
import authReducer from './store/reducers/auth';
import ReduxThunk from 'redux-thunk'
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './navigation/Navigator'



const rootReducer = combineReducers({
  bets: betsReducer,
  auth: authReducer
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


export default function App() {

  return (
    <Provider store={store}>
      <StatusBar style='auto'/>
      <MainNavigator />
    </Provider>

  );
}

const styles = StyleSheet.create({

});
