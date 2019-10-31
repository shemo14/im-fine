import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Root } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Route from './src/routes'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import './ReactotronConfig'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };

      // AsyncStorage.clear()
  }

  async componentDidMount() {
    AsyncStorage.getItem('theme').then(theme => {
      if (theme == null) {
        AsyncStorage.setItem('theme', 'light');
      }
    });

    await Font.loadAsync({
      tajawal: require('./assets/fonts/Tajawal-Regular.ttf'),
      tajawalBold: require('./assets/fonts/Tajawal-Bold.ttf'),
      openSansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
      openSans: require('./assets/fonts/OpenSans-Regular.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <View />;
    }

    return (
        <Provider store={store}>
          <PersistGate persistor={persistedStore}>
            <Root>
              <Route />
            </Root>
          </PersistGate>
        </Provider>
    );
  }
}