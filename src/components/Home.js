import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Animated, I18nManager, Dimensions, Platform, ScrollView, ActivityIndicator } from "react-native";
import {Container, Content, Header, Left, Right, Body, Item, Label, Input, Toast} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import DateTimePicker from "react-native-modal-datetime-picker";
import themeImages from '../consts/Images'
import { connect } from 'react-redux';
import {DoubleBounce} from "react-native-loader";
import {Notifications} from "expo";
import axios from 'axios';
import CONST from '../consts';
import * as Audio from "expo-av/build/Audio";
import * as Battery from "expo-battery";
import { Appearance, AppearanceProvider, useColorScheme } from 'react-native-appearance';
import NotFine from './NotFine'
import firebase from 'react-native-firebase';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const colorScheme = Appearance.getColorScheme();

const IS_IPHONE_X = (height === 812 || height === 896) && Platform.OS === 'ios';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: 1,
            isTimePickerVisible: false,
            startTime: '',
            endTime: '',
            tfTime: '',
            timeType: 'start',
            fadeAnim: new Animated.Value(-height),
            availabel: 0,
            search: '',
            rooms: [],
            loader: false,
            standBySubmit: false,
            dailySubmit: false,
			videoLoader: false
        }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('home')  ,
        drawerIcon: (<Image source={require('../../assets/images/light_mode/home_fine.png')} style={{width:22 , height:22}} resizeMode={'contain'} /> )
    });

    showTimePicker = (timeType) => {
        this.setState({ isTimePickerVisible: true, timeType });
    };

    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    };

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
			this.props.navigation.navigate('areUFine');
			// Alert.alert(title, body)
		});

		/*
		* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		* */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			const { title, body } = notificationOpen.notification;
			console.log('getInitialNotification:', notificationOpen);
			this.props.navigation.navigate('areUFine');
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

    handleTimePicked = time => {
        console.log("A time has been picked: ", time);
        let formatedTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

        if (this.state.timeType == 'start')
            this.setState({ startTime : formatedTime });
        else if(this.state.timeType == 'end')
            this.setState({ endTime : formatedTime });
        else
            this.setState({ tfTime : formatedTime });

        this.hideTimePicker();
    };


	async _subscribe(){
		let batteryLevel = await Battery.getBatteryLevelAsync();

		if (!this.props.battery){
			this._interval = setInterval(() => {
				if ((batteryLevel*100) <= 15){
					// this.sendNotificationImmediately()
				}
			}, 60000);
		}

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

    search(search){
        this.setState({ loader: true });
        axios.post(CONST.url + 'search_chat', { username: search, user_id: this.props.user ? this.props.user.id : this.props.auth.data.id, lang: this.props.lang }).then(response => {
            this.setState({ loader: false, rooms: response.data.data, type: 1 });
        })
    }

    renderVideoLoader(){
    	if (this.state.videoLoader){
    		return(
    			<View style={{ width, height, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000b5', position: 'absolute', zIndex: 1 }}>
					<ActivityIndicator size="large" color="#ddd" />
					<Text style={{ color: '#ddd', marginTop: 10 , fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ i18n.t('videoUpload') + '...' }</Text>
				</View>
			)
		}
	}

    renderStandBySubmit(colors){
        if (this.state.startTime == '' || this.state.endTime == ''){
            return (
                <View style={{ bottom: IS_IPHONE_X ? 80 : 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                    <TouchableOpacity disabled onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} style={{ backgroundColor: '#ddd', width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                    </TouchableOpacity>
                </View>
            )
        }

        if(this.state.standBySubmit){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <DoubleBounce size={20} color={colors.orange} />
                </View>
            )
        }

        return(
            <View style={{ bottom: IS_IPHONE_X ? 80 : 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                <TouchableOpacity onPress={() => this.onStandBy()} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                </TouchableOpacity>
            </View>
        )
    }

    renderDailySubmit(colors){
        if (this.state.tfTime == ''){
            return (
                <View style={{ bottom: IS_IPHONE_X ? 80 : 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                    <TouchableOpacity disabled onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} style={{ backgroundColor: '#ddd', width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                    </TouchableOpacity>
                </View>
            )
        }

        if(this.state.standBySubmit){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <DoubleBounce size={20} color={colors.orange} />
                </View>
            )
        }

        return(
            <View style={{ bottom: IS_IPHONE_X ? 80 : 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                <TouchableOpacity onPress={() => this.onDaily()} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                </TouchableOpacity>
            </View>
        )
    }

    onStandBy(){
        this.setState({ standBySubmit: true });
        axios.post(CONST.url + 'set_ready_time', { user_id: this.props.user ? this.props.user.id : this.props.auth.data.id , time: this.state.startTime, lang: this.props.lang }).then(response => {
            this.setState({ standBySubmit: false, startTime: '', endTime: '' });
            console.log(response.data)
            Toast.show({
                text: response.data.msg,
                type: "success",
                duration: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					textAlign   	: 'center'
				}
            });
        })
    }


    onDaily(){
        this.setState({ DailySubmit: true });
        axios.post(CONST.url + 'everyday', { user_id: this.props.user ? this.props.user.id : this.props.auth.data.id , time: this.state.tfTime, lang: this.props.lang }).then(response => {
            this.setState({ standBySubmit: false, tfTime: '' });
            Toast.show({
                text: response.data.msg,
                type: "success",
                duration: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					textAlign   	: 'center'
				}
            });
        })
    }

    componentWillMount(){
        this.setState({ loader: true });
        axios.post(CONST.url + 'chat', { user_id: this.props.user ? this.props.user.id : this.props.auth.data.id, lang: this.props.lang  }).then(response => {
            this.setState({ rooms: response.data.data, loader: false })
        });
    }

	sendMsg(uri = null, mapRegion){
		let formData = new FormData();


		if (uri){
			let localUri = uri;
			let filename = localUri.split('/').pop();

			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `video/${match[1]}` : video;

			formData.append('files', { uri: localUri, name: filename, type });
		}

		axios.post(CONST.url + 'send', {
			user_id: this.props.user.id,
			r_id: null,
			message: i18n.t('imNotFine') + ' : ' + i18n.t('record_video'),
			type: 2,
			lat: mapRegion.latitude,
			lng: mapRegion.longitude,
			seen:0,
			status: 6,
			connected: 1,
			lang: this.props.lang
		}).then(response => {
			formData.append('id', JSON.stringify(response.data.data));
			formData.append('user_id', JSON.stringify(this.props.user.id));
			axios.post(CONST.url + 'upload', formData).then(res => {
				this.setState({ videoLoader: false });
				this.scrollView.scrollToEnd({animated: true});
				return this.componentWillMount();
			});

			axios.post(CONST.url + 'stop_ready', { user_id: this.props.user.id, lang: this.props.lang }).then(response => {
				this.setState({ setCallBack: 200 });
			});

			this.setState({ message: '' });
			this.emitSendMsg(response.data.data.room, response.data.data.msg);
			this.scrollView.scrollToEnd({animated: true});
			this.componentWillMount();
		})
	}

    componentWillReceiveProps(nextProps) {
		if (nextProps.navigation.state.params && nextProps.navigation.state.params.recording !== undefined){
			this.setState({ videoLoader: true });
			const uri = nextProps.navigation.state.params.recording.uri;
			const mapRegion = nextProps.navigation.state.params.mapRegion;
			this.sendMsg(uri, mapRegion);
		}
	}

	async playAudio(){
		const soundObject = new Audio.Sound();
		try {
			await soundObject.loadAsync(require('../../assets/sounds/alarm.wav'), { shouldPlay: true });
			await soundObject.playAsync();

		} catch (error) {
			console.log('fuck error', error)
		}
	}

	async componentDidMount(){
		this.createNotificationListeners();
	}

	handleNotification = (notification) => {
			console.log('test notification', notification);
			this.playAudio();

		if (notification && notification.origin !== 'received') {
			const { data } = notification;

			if (data.type && data.type === 'areUFine') {
				const userId = data.user_id;
				this.props.navigation.navigate('areUFine');
			}
		}
	};

    renderLoader(colors){
        if (this.state.loader){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: colors.darkBackground , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <DoubleBounce size={20} color={COLORS.lightColors.orange} />
                </View>
            );
        }
    }

    setAnimate(){
        if (this.state.availabel === 0){
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: 0,
                    duration: 800,
                },
            ).start();
            this.setState({ availabel: 1 });
        }else {
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: -(height),
                    duration: 800,
                },
            ).start();
            this.setState({ availabel: 0 });
        }
    }

    renderMsg(room, images, colors){
        if (room.type == 0){
            return (
                <View>
					<Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ room.msg }</Text>
                </View>
            )
        } else if(room.type == 1){
			return (
				<View style={{ flexDirection: 'row' }}>
					<Image source={images.music_player} style={{ width: 20, height: 20, marginHorizontal: 5 }} resizeMode={'contain'}/>
					<Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ i18n.t('audio') }</Text>
				</View>
			)
        } else if(room.type == 2){
			return (
				<View style={{ flexDirection: 'row' }}>
					<Image source={images.video_player} style={{ width: 20, height: 20, marginHorizontal: 5 }} resizeMode={'contain'}/>
					<Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ i18n.t('video') }</Text>
				</View>
			)
        } else if(room.type == 4){
            return (
				<View style={{ flexDirection: 'row' }}>
                    <Image source={images.pin} style={{ width: 20, height: 20, marginHorizontal: 5 }} resizeMode={'contain'}/>
					<Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ i18n.t('location') }</Text>
				</View>
            )
        }
    }

    renderContent(styles, images, colors){
        if(this.state.type == 1){
        	return (
        		<NotFine navigation={this.props.navigation} />
			)
		}else if (this.state.type == 2){
            return (
                <View style={{ padding: 25, marginTop: -77 }}>
                    <View>
                        {
                            this.state.rooms.map((room,i) => (
                                <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('inbox', { data: room })} style={{ flexDirection: 'row', borderBottomColor: '#f0e2c0', borderBottomWidth: 1, paddingVertical: 10 }}>
                                    <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: room.image }} resizeMode={'cover'} style={{ width: 80, height: 80 }} />
                                    </View>
                                    <View style={{ padding: 10 }}>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15, alignSelf: 'flex-start' }}>{ room.username }</Text>
                                        { this.renderMsg(room, images, colors) }
                                    </View>
                                    <View style={{ marginHorizontal: 20 , position: 'absolute', right: 2, top: 10}}>
                                        <Text style={{ color: colors.orange, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ room.date }</Text>
										{
											room.count != 0 ?
												<View style={{ backgroundColor: colors.orange, borderRadius: 20, height: 20, width: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 10 }}>
													<Text style={{ color: '#7b6c60', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', marginTop: Platform.OS == 'ios' ? 5 : 0 }}>{ room.count }</Text>
												</View> : <View />

										}
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            );
        }else if(this.state.type == 3){
            return (
                <View style={{ padding: 25, marginTop: -77, height: height-120 }}>
                    <Image source={images.stop_watch_time} style={{ width: 100, height: 100, alignSelf: 'center' }} resizeMode={'contain'} />
                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', textAlign: 'center', fontSize: 16, marginTop: 10 }}>{ i18n.t('chooseTime') }</Text>

                    <View style={{ marginTop: 50, width: '100%' }}>
                        <TouchableOpacity onPress={() => this.showTimePicker('start')} style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row',}}>
                            <TouchableOpacity onPress={() => this.showTimePicker('start')} style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5, zIndex: 1 }} bordered>
                                <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute', paddingRight: 5, paddingLeft: 5 }}>{ i18n.t('startTime') }</Label>
                                <View>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 34, }}>{ this.state.startTime.toString() }</Text>
                                </View>
                            </TouchableOpacity>
                            <Image source={images.choose_time} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <DateTimePicker
							cancelTextIOS={i18n.t('cancel')}
							confirmTextIOS={i18n.t('confirm')}
							titleIOS={i18n.t('pickDate')}
							isDarkModeEnabled={colorScheme === 'dark'}
							datePickerContainerStyleIOS={{ color: '#000' }}
                            isVisible={this.state.isTimePickerVisible}
                            onConfirm={this.handleTimePicked}
                            onCancel={this.hideTimePicker}
                            mode={'time'}
                        />
                    </View>

                    <View style={{ marginTop: 20, width: '100%' }}>
                        <TouchableOpacity onPress={() => this.showTimePicker('end')} style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                            <TouchableOpacity onPress={() => this.showTimePicker('end')} style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute', paddingRight: 5, paddingLeft: 5  }}>{ i18n.t('endTime') }</Label>
								<View>
									<Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 34, }}>{this.state.endTime.toString()}</Text>
								</View>
                            </TouchableOpacity>
                            <Image source={images.choose_time} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <DateTimePicker
							cancelTextIOS={i18n.t('cancel')}
							confirmTextIOS={i18n.t('confirm')}
							titleIOS={i18n.t('pickDate')}
							isDarkModeEnabled={colorScheme === 'dark'}
                            isVisible={this.state.isTimePickerVisible}
                            onConfirm={this.handleTimePicked}
                            onCancel={this.hideTimePicker}
                            mode={'time'}
                        />
                    </View>

                    { this.renderStandBySubmit(colors) }
                </View>
            )
        }else{
            return (
                <View style={{ padding: 25, marginTop: -77, height: height-120 }}>
                    <Image source={images.timer_twinty_four} style={{ width: 100, height: 100, alignSelf: 'center' }} resizeMode={'contain'} />
                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', textAlign: 'center', fontSize: 16, marginTop: 10 }}>{ i18n.t('chooseTime') }</Text>

                    <View style={{ marginTop: 50, width: '100%' }}>
                        <TouchableOpacity onPress={() => this.showTimePicker('tfTime')} style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                            <TouchableOpacity onPress={() => this.showTimePicker('tfTime')} style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute', paddingRight: 5, paddingLeft: 5  }}>{ i18n.t('startTime') }</Label>
								<View>
									<Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 34, }}>{this.state.tfTime.toString()}</Text>
								</View>
                            </TouchableOpacity>
                            <Image source={images.choose_time} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <DateTimePicker
							cancelTextIOS={i18n.t('cancel')}
							confirmTextIOS={i18n.t('confirm')}
							titleIOS={i18n.t('pickDate')}
							isDarkModeEnabled={colorScheme === 'dark'}
                            isVisible={this.state.isTimePickerVisible}
                            onConfirm={this.handleTimePicked}
                            onCancel={this.hideTimePicker}
                            mode={'time'}
                        />
                    </View>

                    { this.renderDailySubmit(colors) }
                </View>
            )
        }
    }

    onFocus(){
        this.componentWillMount();
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
				{ this.renderVideoLoader() }
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
                        <Right style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Image source={images.drawer} style={{ width: 25, height: 25, marginTop: 35, marginHorizontal: 8 }} resizeMode={'contain'} />
                                <Image source={images.logo_tittle} style={{ width: 90, height: 90 }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Right>
                        <Body style={[styles.headerText , styles.headerTitle]}></Body>
                        <Left style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.setAnimate()} style={{ marginTop: 20 }}>
                                <Image source={this.state.availabel === 0 ? images.search : images.cross} style={{ width: 25, height: 25, margin: 5, marginTop: 15 }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Left>
                    </View>
                </Header>
                <Content bounces={false} scrollEnabled={false} style={{ backgroundColor: colors.darkBackground, marginTop: -25 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <Animated.View style={{ height, width, position: 'absolute', top: this.state.fadeAnim, backgroundColor: '#0000005e', zIndex: 2 }}>
                        <View style={{ width: '100%', backgroundColor: colors.darkBackground, paddingHorizontal: 20, paddingBottom: 10 }}>
                            <View style={{ borderRadius: 30, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 5, padding: 5, flexDirection: 'row'  }}>
                                <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                    <Input placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('search') + '...'} onChangeText={(search) => this.search(search)} style={{ width: '100%', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                                </Item>
                                <Image source={images.search} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                            </View>
                        </View>
                    </Animated.View>
                    <View>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
							<TouchableOpacity onPress={() => [ this.setState({ type: 1 }), this.componentWillMount() ]} style={{ flexDirection: 'row', marginHorizontal: 5 }}>
								<Image source={this.state.type == 1 ? images.home_active : images.home_unactive} style={{ width: 25, height: 25, margin: 5 }} resizeMode={'contain'} />
								<Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', marginTop:  Platform.OS == 'ios' ? 10 : 5, color: this.state.type == 1 ? colors.active : colors.unActive }}>{ i18n.t('home') }</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => [ this.setState({ type: 2 }), this.componentWillMount() ]} style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                <Image source={this.state.type == 2 ? images.chat_active : images.chat_non} style={{ width: 25, height: 25, margin: 5 }} resizeMode={'contain'} />
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', marginTop:  Platform.OS == 'ios' ? 10 : 5, color: this.state.type == 2 ? colors.active : colors.unActive }}>{ i18n.t('chat') }</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ type: 3 })} style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                <Image source={this.state.type == 3 ? images.bell_active : images.bell_non} style={{ width: 25, height: 25, margin: 5 }} resizeMode={'contain'} />
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', marginTop: Platform.OS == 'ios' ? 10 : 5, color: this.state.type == 3 ? colors.active : colors.unActive }}>{ i18n.t('standBy') }</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ type: 4 })} style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                <Image source={this.state.type == 4 ? images.stopwatch_active : images.stopwatch_non} style={{ width: 25, height: 25, margin: 5 }} resizeMode={'contain'} />
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', marginTop: Platform.OS == 'ios' ? 10 : 5, color: this.state.type == 4 ? colors.active : colors.unActive }}>{ i18n.t('tfAlert') }</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        <View style={{ marginTop: 10, backgroundColor: colors.lightBackground, borderTopColor: colors.pageBorder, borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ flex: 1, height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: colors.pageBorder, transform: I18nManager.isRTL ? [{ rotate: '45deg'}] : [{ rotate: '-45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            { this.renderLoader(colors) }
                            <View style={{ height: height-190 }}>
                                { this.renderContent(styles, images, colors) }
                            </View>
                        </View>
                    </View>
                </Content>
                {/*{*/}
                    {/*this.state.type == 1 ? (*/}
                        {/*<View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>*/}
                            {/*<TouchableOpacity onPress={() => this.props.navigation.navigate('notFine')} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>*/}
                                {/*<Image source={require('../../assets/images/dark_mode/emergency.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                    {/*) : (<View />)*/}
                {/*}*/}
            </Container>
        );
    }
}

const mapStateToProps = ({ lang, profile, auth, theme, battery }) => {
    return {
        lang: lang.lang,
        theme: theme.theme,
		battery: battery.batteryNotify,
        user: profile.user,
        auth: auth.user
    };
};

export default connect(mapStateToProps, {  })(Home);
