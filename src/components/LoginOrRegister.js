import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage , I18nManager, } from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, Picker} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import { connect } from 'react-redux';
import { chooseTheme, chooseLang } from '../actions'
import firebase from 'react-native-firebase';


const themeImages = {
    lightImages: {
        bg_splash: require('../../assets/images/light_mode/bg_splash.png')
    },
    darkImages: {
        bg_splash: require('../../assets/images/dark_mode/bg_splash.png')
    }
}

class LoginOrRegister extends Component {
    constructor(props){
        super(props);
        this.state = {
            theme: 'light',
            lang: this.props.lang,
            deviceId: ''
        }
    }

    setLang(lang){
        if (lang != this.state.lang){
            this.props.chooseLang(lang)
        }
    }

    async componentWillMount() {

		// setTimeout(() => this.allowNotification(), 10000);
	}

	async componentDidMount() {
		this.checkPermission();
		this.createNotificationListeners()
	}


	async checkPermission() {
		const enabled = await firebase.messaging().hasPermission();
		if (enabled) {
			this.getToken();
		} else {
			this.requestPermission();
		}
	}

	//3
	async getToken() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
			if (fcmToken) {
				// user has a device token
				console.log('fcm token____', fcmToken);
				await AsyncStorage.setItem('fcmToken', fcmToken);
			}
		}
	}

	//2
	async requestPermission() {
		try {
			await firebase.messaging().requestPermission();
			// User has authorised
			this.getToken();
		} catch (error) {
			// User has rejected permissions
			console.log('permission rejected');
		}
	}

	async createNotificationListeners() {
		/*
		* Triggered when a particular notification has been received in foreground
		* */
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			const { title, body } = notification;
			console.log('onNotification:' , notification);

			const localNotification = new firebase.notifications.Notification({
				sound: 'alarm.wav',
				show_in_foreground: true,
			}).setSound('alarm.wav')
				.setNotificationId(notification.notificationId)
				.setTitle(notification.title)
				.setBody(notification.body)
				.android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
				.android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
				.android.setColor('#000000') // you can set a color here
				.android.setPriority(firebase.notifications.Android.Priority.High);

			firebase.notifications()
				.displayNotification(localNotification)
				.catch(err => console.error(err));
		});


		/*
		  * Triggered when a particular notification has been received in foreground
		* */
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			const { title, body } = notification;
		});


		const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
			.setDescription('Demo app description')
			.setSound('alarm.wav');
		firebase.notifications().android.createChannel(channel);

		/*
		* If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		* */
		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			const { title, body } = notificationOpen.notification;
			console.log('onNotificationOpened:', notificationOpen);
			// Alert.alert(title, body)
		});

		/*
		* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		* */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			const { title, body } = notificationOpen.notification;
			console.log('getInitialNotification:', notificationOpen);
		//	Alert.alert(title, body)
		}

		/*
		* Triggered for data only payload in foreground
		* */
		this.messageListener = firebase.messaging().onMessage((message) => {
			//process data message
			console.log("JSON.stringify:", JSON.stringify(message));
		});
	}


	render() {
        let styles  = lightStyles;
        let images  = themeImages.lightImages;
        let colors  = COLORS;

        if (this.props.theme == 'dark') {
            styles = darkStyles;
            images = themeImages.darkImages;
            colors = colors.darkColors
        }else {
            styles = lightStyles;
            images = themeImages.lightImages;
            colors = colors.lightColors
        }

        return (
            <Container style={{ backgroundColor: colors.darkBackground }}>
                <Content contentContainerStyle={{ flexGrow: 1 }}>
                    <ImageBackground source={images.bg_splash} resizeMode={'cover'} style={styles.imageBackgroundStyle}>
                        <Image source={require('../../assets/images/dark_mode/small_logo_login.png')} style={styles.logoStyle} resizeMode={'contain'} />
                        <View style={styles.loginFormContainerStyle}>
                            <View>
                                <Item style={[styles.itemPicker, { borderColor: colors.labelFont, width: '43%' }]} regular >
                                    <Picker
                                        mode="dropdown"
                                        style={[styles.picker, { color: colors.labelFont } ]}
										textStyle={{ color: colors.labelFont }}
                                        selectedValue={this.state.lang}
                                        onValueChange={(value) => this.setLang(value)}
                                    >
                                        <Picker.Item label='العربية' value={'ar'} />
                                        <Picker.Item label='English' value={'en'} />
                                        <Picker.Item label='Urdu' value={'ur'} />
                                        <Picker.Item label='Espanol' value={'sp'} />
                                    </Picker>
                                    <Image source={images.right_wight_arrow_drop} style={styles.pickerImg} resizeMode={'contain'} />
                                </Item>
                            </View>

                            <Button onPress={() => this.props.navigation.navigate('register')} style={[ styles.loginBtn, styles.mt15]}>
                                <Text style={styles.btnTxt}>{ i18n.t('register') }</Text>
                            </Button>

                            <Button onPress={() => this.props.navigation.navigate('login')} style={[ styles.loginBtn, styles.mt15]}>
                                <Text style={styles.btnTxt}>{ i18n.t('login') }</Text>
                            </Button>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}


const mapStateToProps = ({ theme, lang }) => {
    return {
        theme: theme.theme,
        lang: lang.lang,
    };
};

export default connect(mapStateToProps, { chooseTheme, chooseLang })(LoginOrRegister);
