import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import betsReducer from './store/reducers/bets';
import authReducer from './store/reducers/auth';
import DrawerNavigator from './navigation/DrawerNavigator';
import ReduxThunk from 'redux-thunk'
import { StatusBar } from 'expo-status-bar';
import Logged_Out_Screen from './screens/Logged_Out_Screen'
import { createSwitchNavigator } from 'react-navigation'
import Auth_Screen from './screens/Auth_Screen';



const rootReducer = combineReducers({
  bets: betsReducer,
  auth: authReducer
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


export default function App() {

  return (
    <Provider store={store}>
      <StatusBar style='auto'/>
      {/* <DrawerNavigator /> */}
      {/* <Logged_Out_Screen /> */}
      <Auth_Screen />
    </Provider>

  );
}

const styles = StyleSheet.create({

});
