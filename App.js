import React from 'react';
import {View, AsyncStorage, Platform} from 'react-native';
import { Root } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Route from './src/routes'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import './ReactotronConfig'
import {Notifications} from "expo";
import * as Battery from 'expo-battery';
import * as Permissions from "expo-permissions";
import i18n from "./locale/i18n";



export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
		};

		// AsyncStorage.clear()
	}

	async componentDidMount() {
		console.disableYellowBox = true;
		if (Platform.OS === 'android') {
			Notifications.createChannelAndroidAsync('battery-notify', {
				name: 'Chat messages',
				sound: true,
			});
		}

		AsyncStorage.getItem('theme').then(theme => {
			if (theme == null) {
				AsyncStorage.setItem('theme', 'light');
			}
		});

		this._subscribe()

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

	async _subscribe(){
		let batteryLevel = await Battery.getBatteryLevelAsync();

		// this._interval = setInterval(() => {
		// 	if ((batteryLevel*100) < 15){
		// 		this.sendNotificationImmediately()
		// 	}
		// }, 60000);

	};

	sendNotificationImmediately = async () => {
		let notificationId = await Notifications.presentLocalNotificationAsync({
			title: i18n.t('batteryLow'),
			body: i18n.t('batteryLowBody'),
			android: {
				channelId: 'battery-notify'
			}
		});
		console.log(notificationId); // can be saved in AsyncStorage or send to server
	};

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