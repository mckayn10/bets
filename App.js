import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import betsReducer from './store/reducers/bets';
import authReducer from './store/reducers/auth';
import ReduxThunk from 'redux-thunk'
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './navigation/Navigator'
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font'
import { useFonts } from 'expo-font';

const rootReducer = combineReducers({
  bets: betsReducer,
  auth: authReducer
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)

  const fetchFonts = async () => {
    await Font.loadAsync({
      'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
      'dancing-script': require('./assets/fonts/DancingScript-Regular.ttf'),
      'permanent-marker': require('./assets/fonts/PermanentMarker-Regular.ttf'),
      'chewy': require('./assets/fonts/Chewy-Regular.ttf'),
      'carter': require('./assets/fonts/CarterOne-Regular.ttf'),
      'ethnocentric': require('./assets/fonts/ethnocentric.regular.ttf'),
      'russo': require('./assets/fonts/RussoOne-Regular.ttf')



    })
    console.log('done')
  }

  if (!fontLoaded) {
    return (
      <AppLoading
      startAsync={fetchFonts}
      onFinish={() => setFontLoaded(true)}
      onError={(err) => console.log(err)}
    />
    )
  }

  return (
    <Provider store={store}>
      <StatusBar style='auto' />
      <MainNavigator />
    </Provider>

  );
}

const styles = StyleSheet.create({

});
