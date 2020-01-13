import React, { Component } from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Animated,
	I18nManager,
	Dimensions,
	KeyboardAvoidingView,
	ScrollView,
	Slider,
	Keyboard,
	Linking,
	NativeModules,
	Platform,
	StatusBarIOS,
	ActivityIndicator
} from "react-native";
import {Container, Content, Header, Left, Right, Body, Item, Input} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import themeImages from '../consts/Images'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import MapView from 'react-native-maps';
import { Video, Audio } from 'expo-av';
import {Recorder, Player} from 'react-native-audio-player-recorder-no-linking';
import * as Location from 'expo-location';
import axios from 'axios'
import Modal from "react-native-modal";
import * as Permissions from "expo-permissions";
import { connect } from 'react-redux';
import {DoubleBounce} from "react-native-loader";
import CONST from '../consts';
import firebase from 'react-native-firebase';

window.navigator.userAgent = 'react-native';
import SocketIOClient from 'socket.io-client';

const height                = Dimensions.get('window').height;
const width                 = Dimensions.get('window').width;
const IS_IPHONE_X 	        = (height === 812 || height === 896) && Platform.OS === 'ios';
const {StatusBarManager}    = NativeModules;


class Inbox extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: 1,
            isTimePickerVisible: false,
            timeType: 'start',
            fadeAnim: new Animated.Value(-100),
            availabel: 0,
            search: '',
            messages: [],
            lat: null,
            long: null,
            playedVideo: null,
            playedAudio: null,
            audioPath: null,
            startRecord: false,
            finishRecord: false,
            resetRecord: false,
            isModalVisible: false,
            location: '',
            mapRegion: null,
            initMap: true,
            loader: false,
            bottom: 0,
            is_active: false,
			statusBarHeight: 0,
			videoLoader: false
        };

        const data = this.props.navigation.state.params.data;
        this.socket = SocketIOClient('http://cross.4hoste.com:8892', {jsonp: false});
        this.joinRoom(data);
        this.socket.on('get_message', (data) => this.getMessages(data));
        this.socket.on('offline', (data) => { this.setState({ is_active: data.is_active }) });
    }

    getMessages(){
        const data = this.props.navigation.state.params.data;
        axios.post(CONST.url + 'room', { room: data.room, user_id: this.props.user.id, r_id: data.other }).then(response => {
            this.setState({ messages: response.data.data, loader: false });
        });
    }

	componentWillUnmount() {
		this.statusBarListener.remove();
	}

    async componentWillMount() {
    //    this.setState({ loader: true });
        const data = this.props.navigation.state.params.data;
        axios.post(CONST.url + 'room', { room: data.room, user_id: this.props.user.id, r_id: data.other, lang: this.props.lang }).then(response => {
           this.setState({ messages: response.data.data, loader: false });
        });

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation = { latitude, longitude };
            this.setState({  mapRegion: userLocation, initMap: false });
        }

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
        getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

        try {
            const { data } = await axios.get(getCity);
            this.setState({ location: data.results[0].formatted_address });
        } catch (e) {
            console.log(e);
        }
        // this.playAudio(1, 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540m_shams%252Fim-fine/Audio/recording-d35cb168-49ab-42f0-96ab-dde3202d4fa9.m4a')
    }

	linkingToGoogleMap(lat, lng){
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${lat},${lng}`;
		const label = 'Custom Label';
		const url = Platform.select({
			ios : `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});

		Linking.openURL(url);
    }

    joinRoom(data){
        this.socket.emit('subscribe', { room: data.room });
    }

    componentDidMount() {
		StatusBarManager.getHeight((statusBarFrameData) => {
			this.setState({statusBarHeight: statusBarFrameData.height});
		});
		this.statusBarListener = StatusBarIOS.addListener('statusBarFrameWillChange', (statusBarData) => {
			this.setState({statusBarHeight: statusBarData.frame.height});
		});


		this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => this._keyboardDidShow(),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => this._keyboardDidHide(),
        );
    }

    _keyboardDidShow(){
        this.setState({ bottom: 65 });
    }

    _keyboardDidHide(){
        this.setState({ bottom: 0 });
    }

    _handleMapRegionChange  = async (mapRegion) =>  {
        this.setState({ mapRegion });

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += mapRegion.latitude + ',' + mapRegion.longitude;
        getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

        console.log('locations data', getCity);

        try {
            const { data } = await axios.get(getCity);
            this.setState({ location: data.results[0].formatted_address });

        } catch (e) {
            console.log(e);
        }
    }

    videoControl(id){
        if (this.state.playedVideo == id)
            this.setState({ playedVideo: null })
        else
            this.setState({ playedVideo: id })
    }

    async playAudio(id, info){
        console.log(info);
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync({ uri: info.url });
            await soundObject.playAsync();

            const status = await soundObject.getStatusAsync();
            console.log('status....', status)

        } catch (error) {
            console.log('fuck error', error)
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
                    toValue: -100,
                    duration: 800,
                },
            ).start();
            this.setState({ availabel: 0 });
        }
    }


    renderMsg(message, i, styles, colors, images){
        if (message.s_id == this.props.user.id){
            if (message.type == 0){
                return (
                    <View key={i} style={{ width: (width*80)/100, backgroundColor: colors.sendMsg, borderRadius: 20, alignSelf: 'flex-start', marginHorizontal: 20, marginVertical: 10, padding: 10, marginBottom: (this.state.messages).length == i+1 ? 65 : 0 }}>
                        <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', alignSelf: 'flex-start' }}>{message.msg}</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 5 }}>
                            <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.date}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2, marginHorizontal: 4  }} />
                        </View>
                    </View>
                );
            }else if (message.type == 4){
                return (
                    <View key={i} style={{ width: (width*80)/100, height: 200, backgroundColor: colors.sendMsg, borderRadius: 20, alignSelf: 'flex-start', marginHorizontal: 20, marginVertical: 10, marginBottom: (this.state.messages).length == i+1 ? 65 : 0 }}>
                        <TouchableOpacity onPress={() => this.linkingToGoogleMap(message.lat, message.lng)} style={{ width: '100%', height: 160 }}>
                            <View  style={{ width: '100%', height: 160, backgroundColor: 'transparent' , zIndex: 1, position: 'absolute' }} />
                            {
                                !this.state.initMap ? (
                                    <MapView
                                        style={{ flex: 1, width: '100%', height: 160, borderRadius: 20 }}
                                        initialRegion={{
                                            latitude: Number(message.lat),
                                            longitude: Number(message.lng),
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    />
                                ) : (<View />)
                            }
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ padding: 10, flex: 2 }}>
                                <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', alignSelf: 'flex-start' }}>{message.msg}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', padding: 10, flex: 1 }}>
                                <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.date}</Text>
                                <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2, marginHorizontal: 4 }} />
                            </View>
                        </View>
                    </View>
                )
            }else if (message.type == 2){
                return (
                    <View key={i} style={{ width: (width*80)/100, height: 200, backgroundColor: colors.sendMsg, borderRadius: 20, alignSelf: 'flex-start', marginHorizontal: 20, marginVertical: 10, marginBottom: (this.state.messages).length == i+1 ? 65 : 0 }}>
                        <View style={{ width: '100%', height: 160 }}>
                            <Video
                                source={{ uri: message.msg }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                shouldPlay={this.state.playedVideo == message.id ? true: false}
                                isLooping
                                style={{ width: '100%', height: 160 }}
                            />
                            <TouchableOpacity onPress={() => this.videoControl(message.id)} style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', flex: 1, top: '30%', right: '41%' }}>
                                <Image source={this.state.playedVideo == message.id ? images.pause_button : images.play_button_big} style={{ width: 50, height: 50, alignSelf: 'center' }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', padding: 10 }}>
                            <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.date}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2, marginHorizontal: 4  }} />
                        </View>
                    </View>
                )
            }else if(message.type == 1){
                return (
                    <View key={i} style={{ width: (width*80)/100, backgroundColor: colors.sendMsg, borderRadius: 20, alignSelf: 'flex-start', marginHorizontal: 20, marginVertical: 10, padding: 10, marginBottom: (this.state.messages).length == i+1 ? 65 : 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ height: 35, width: 35, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: message.sender_img }} resizeMode={'contain'} style={{ width: 50, height: 50 }} />
                            </View>
                            <Player
                                style={{ flex: 1 }}
                                completeButtonText={'Return Home'}
                                sender={true}
                                uri={message.msg}
                                plyImg={images.play_button_big}
                                pusImg={images.pause_button}
                                showDebug={false}
                                showTimeStamp={false}
                                showBackButton={true}
                                playbackSlider={(renderProps) => {
                                    return (
                                        <Slider
                                            style={{ width: '88%' }}
                                            thumbTintColor={'#ffffff'}
                                            maximumTrackTintColor={"#ffffff"}
                                            minimimValue={0}
                                            maximumValue={renderProps.maximumValue}
                                            onValueChange={renderProps.onSliderValueChange}
                                            value={renderProps.value}
                                            disabled={true}
                                        />
                                    );
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 5 }}>
                            <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.date}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2, marginHorizontal: 4  }} />
                        </View>
                    </View>
                );
            }
        } else{
            if (message.type == 0){
                return (
                    <View key={i} style={{ width: (width*80)/100, backgroundColor: colors.receiverMsg, borderRadius: 20, alignSelf: 'flex-end', marginHorizontal: 20, marginVertical: 10, padding: 10, marginBottom: (this.state.messages).length == i+1 ? 65 : 0 }}>
                        <Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{message.msg}</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 5 }}>
                            <Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.date}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2, marginHorizontal: 4  }} />
                        </View>
                    </View>
                );
            }else if(message.type == 4){ //
                return (
                    <View key={i} style={{ width: (width*80)/100, height: 200, backgroundColor: colors.receiverMsg, borderRadius: 20, alignSelf: 'flex-end', marginHorizontal: 20, marginVertical: 10, marginBottom: (this.state.messages).length == i+1 ? 65 : 0}}>
                        <TouchableOpacity onPress={() => this.linkingToGoogleMap(message.lat, message.lng)} style={{ width: '100%', height: 160 }}>
							<View  style={{ width: '100%', height: 160, zIndex: 1, position: 'absolute' }} />
                            {
                                !this.state.initMap ? (
                                    <MapView
                                        style={{ flex: 1, width: '100%', height: 160, borderRadius: 20 }}
                                        initialRegion={{
                                            latitude: Number(message.lat),
                                            longitude: Number(message.lng),
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    />
                                ) : (<View />)
                            }
                        </TouchableOpacity>
						<View style={{ flexDirection: 'row' }}>
							<View style={{ flexDirection: 'row', alignSelf: 'flex-start', padding: 10, flex: 1 }}>
								<Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.date}</Text>
								<Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2, marginHorizontal: 4  }} />
							</View>
                            <View style={{ padding: 10, flex: 2 }}>
								<Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', alignSelf: 'flex-end' }}>{message.msg}</Text>
							</View>
                        </View>
                    </View>
                )
            }else if(message.type == 2){
                return (
                    <View key={i} style={{ width: (width*80)/100, height: 200, backgroundColor: colors.sendMsg, borderRadius: 20, alignSelf: 'flex-start', marginHorizontal: 20, marginVertical: 10, marginBottom: (this.state.messages).length == i+1 ? 65 : 0 }}>
                        <View style={{ width: '100%', height: 160 }}>
                            <Video
                                source={{ uri: message.msg }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                shouldPlay={this.state.playedVideo == message.id ? true: false}
                                isLooping
                                style={{ width: '100%', height: 160 }}
                            />
                            <TouchableOpacity onPress={() => this.videoControl(message.id)} style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', flex: 1, top: '30%', right: '41%' }}>
                                <Image source={this.state.playedVideo == message.id ? images.pause_button : images.play_button_big} style={{ width: 50, height: 50, alignSelf: 'center' }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', padding: 10 }}>
                            <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.date}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2, marginHorizontal: 4  }} />
                        </View>
                    </View>
                )
            }else if(message.type == 1){
                return (
                    <View key={i} style={{ width: (width*80)/100, backgroundColor: colors.receiverMsg, borderRadius: 20, alignSelf: 'flex-end', marginHorizontal: 20, marginVertical: 10, padding: 10, marginBottom: (this.state.messages).length == i+1 ? 65 : 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Player
                                style={{ flex: 1 }}
                                completeButtonText={'Return Home'}
                                uri={message.msg}
                                plyImg={images.play_button_big}
                                pusImg={images.pause_button}
                                showDebug={false}
                                showTimeStamp={false}
                                showBackButton={true}
                                playbackSlider={(renderProps) => {
                                    return (
                                        <Slider
                                            style={{ width: '90%' }}
                                            thumbTintColor={colors.orange}
                                            maximumTrackTintColor={"#ffffff"}
                                            minimumTrackTintColor={colors.orange}
                                            minimimValue={0}
                                            maximumValue={renderProps.maximumValue}
                                            onValueChange={renderProps.onSliderValueChange}
                                            value={renderProps.value}
                                            disabled={true}
                                        />
                                    );
                                }}
                            />
                            <View style={{ height: 35, width: 35, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                <Image source={{ uri: message.receiver_img }} resizeMode={'contain'} style={{ width: 50, height: 50 }} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 5 }}>
                            <Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.date}  {message.id}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2, marginHorizontal: 4  }} />
                        </View>
                    </View>
                );
            }
        }
    }

    startRecord(){
        this.setAnimate();
        this.setState({ startRecord: true, finishRecord: false, resetRecord: false, })
    }

    cansleRecord(){
        this.setAnimate();
        this.setState({ resetRecord: true, startRecord: false, finishRecord: false  })
    }

    renderLoader(colors){
        if (this.state.loader){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: colors.darkBackground , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <DoubleBounce size={20} color={COLORS.lightColors.orange} />
                </View>
            );
        }
    }

    sendMsg(msgType, uri = null){
        const data = this.props.navigation.state.params.data;
        this.setState({ isModalVisible: false });
        let formData = new FormData();

        if (msgType == 1)
            this.cansleRecord();


        if (uri){
			this.setState({ videoLoader: true });
            let localUri = uri;
            filename = localUri.split('/').pop();

            let match = /\.(\w+)$/.exec(filename);
            console.log(match);
            let type = msgType == 1 ? `audio/${match[1]}` : 'video';
            formData.append('files', { uri: localUri, name: filename, type });
        }

        axios.post(CONST.url + 'send', {
            user_id: this.props.user.id,
            r_id: data.other,
            message: this.state.message,
            type: msgType,
            lat: this.state.mapRegion.latitude,
            lng: this.state.mapRegion.longitude,
            seen:0,
            status:0,
            lang: this.props.lang,
            connected:1
        }).then(response => {
            console.log('dam msgType...', msgType);

            if(msgType == 1 || msgType == 2){
                formData.append('id', JSON.stringify([ response.data.data.id ]));
                axios.post(CONST.url + 'upload', formData).then(res => {
					this.setState({ videoLoader: false });
                    this.emitSendMsg(response.data.data.room, response.data.data.msg);
                    this.scrollView.scrollToEnd({animated: true});
                    return this.componentWillMount();
                });
            }

            this.setState({ message: '' });
            this.emitSendMsg(response.data.data.room, response.data.data.msg);
            this.scrollView.scrollToEnd({animated: true});
            this.componentWillMount();
        })
    }

    emitSendMsg(room, msg){
        this.socket.emit('send_message', { room, msg });
    }

    leave(){
        const room = this.props.navigation.state.params.room;
        this.socket.emit('disconnect', { room });
        this.props.navigation.goBack();
    }

    behavior(){
        if (IS_IPHONE_X) return 'position';
        else if(Platform.OS == 'ios') return 'padding';
        else return 'height';
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

    onFocus(){

    }

    render() {

        console.log('behavior __', this.behavior(), this.state.bottom);

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

        const data = this.props.navigation.state.params.data;

        return (
            <Container style={{ backgroundColor: colors.darkBackground }}>
				{ this.renderVideoLoader() }
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header , styles.plateformMarginTop, { height: IS_IPHONE_X ? 90 : 75 }]} noShadow>
                    <View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
                        <Right style={[styles.flex0, { height: 64, marginTop: 10 }]}>
                            <View style={{ flexDirection: 'row', marginTop: 33 }}>
                                <View style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={{ uri: data.image }} resizeMode={'cover'} style={{ width: 80, height: 80 }} />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 }}>{ data.username }</Text>
                                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{  this.state.is_active ? i18n.t('online') : i18n.t('offline') }</Text>
                                </View>
                            </View>
                        </Right>
                        <Body style={[styles.headerText , styles.headerTitle]}></Body>
                        <Left style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.leave()} style={{ marginTop: 20 }}>
                                <Image source={images.back} style={{ width: 25, height: 25, margin: 5, marginTop: 15, transform: I18nManager.isRTL ? [{rotateY : '0deg'}] : [{rotateY : '-180deg'}] }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Left>
                    </View>
                </Header>

                <Content bounces={false} scrollEnabled={false} style={{ backgroundColor: colors.darkBackground, marginTop: IS_IPHONE_X ? -10 : -30,  }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                        <View style={{ backgroundColor: colors.lightBackground, borderTopColor: colors.pageBorder, borderTopWidth: 1, height: IS_IPHONE_X ? height-150 : height-80}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: colors.pageBorder, transform: I18nManager.isRTL ? [{ rotate: '45deg'}] : [{ rotate: '-45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            { this.renderLoader(colors) }
                            <KeyboardAvoidingView keyboardVerticalOffset={50 + this.state.statusBarHeight} behavior={this.behavior()} style={{width:'100%', flexDirection:'column', flex: 1, zIndex: -1, marginTop: -77 }}>
                                <ScrollView
                                    style={{ height: IS_IPHONE_X ? height-150 : height-80 }}
                                    ref={ref => this.scrollView = ref}
                                    onContentSizeChange={(contentWidth, contentHeight)=>{
                                        this.scrollView.scrollToEnd({animated: true});
                                    }} >
                                    {
                                        this.state.messages.map((msg, i) => this.renderMsg(msg, i, styles, colors, images))
                                    }
                                </ScrollView>

                                <View style={{ backgroundColor: colors.inboxInputBackground, flexDirection:'row' , flex: 1, width: '100%',height:55, position:'absolute' , bottom: Platform.OS != 'ios' ? this.state.bottom : 0, padding: 3 }}>
                                    <View style={{ width: '84%', paddingHorizontal: 20, paddingBottom: 10, marginLeft: -15 }}>
                                        <View style={{ borderRadius: 30, borderWidth: 1, borderColor: colors.labelFont, height: 40, marginTop: 5, padding: 5, flexDirection: 'row', backgroundColor: colors.inboxInput  }}>
                                            <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5,  }} bordered>
                                                <Input value={this.state.message} placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('message') + '...'} onChangeText={(message) => this.setState({message})} style={{ width: '100%', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 10 }}  />
                                            </Item>
                                            <TouchableOpacity onPress={() => this.sendMsg(0)} disabled={this.state.message === '' ? true : false} style={{ position: 'absolute', flex: 1, right: 10, top: 5 }}>
                                                <Image source={images.send} style={{ height: 27, width: 27 }} resizeMode={'contain'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{ flex: 1, marginTop: 15, marginLeft: -7 }} onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })}>
                                        <Image source={images.location_irbble} style={{ width: 25, height: 25 }} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                    <View style={{ height: 40, width: 1, backgroundColor: '#ddd', marginRight: 9, marginTop: 7 }} />
                                    <TouchableOpacity style={{ flex: 1, marginTop: 15, marginRight: -10 }} onPress={() => this.startRecord()}>
                                        <Image source={images.microphone} style={{ width: 25, height: 25 }} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>
                                <Animated.View style={{ backgroundColor: colors.inboxInputBackground, flexDirection:'row' , flex: 1, width: '100%',height: 55, position:'absolute' , bottom: this.state.fadeAnim, padding: 3 }}>
                                    <View style={{ width: '84%', paddingHorizontal: 20, paddingBottom: 10, marginLeft: -15 }}>
                                        <Recorder
                                            style={{flex: 1}}
                                            onComplete={(i) => this.sendMsg(1, i.uri)}
                                            maxDurationMillis={150000}
                                            showDebug={false}
                                            startRecord={this.state.startRecord}
                                            resetRecord={this.state.resetRecord}
                                            finishRecord={this.state.finishRecord}
                                            showBackButton={true}
                                            audioMode={{
                                                allowsRecordingIOS: true,
												extension: '.m4a',
                                                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                                                playsInSilentModeIOS: true,
                                                playsInSilentLockedModeIOS: true,
                                                staysActiveInBackground: true,
                                                shouldDuckAndroid: true,
                                                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                                                playThroughEarpieceAndroid: false
                                            }}
                                            recordingCompleteButton={(renderProps) => {
                                                return (
                                                    <TouchableOpacity style={{ marginTop: 15, position: 'absolute', right: -80 }} onPress={renderProps.onPress}>
                                                        <Image source={images.sendRecord} style={{ width: 30, height: 30 }} resizeMode={'contain'} />
                                                    </TouchableOpacity>
                                                );
                                            }}
                                            playbackSlider={(renderProps) => {
                                                return (
                                                    <Slider
                                                        minimimValue={0}
                                                        maximumValue={renderProps.maximumValue}
                                                        onValueChange={renderProps.onSliderValueChange}
                                                        value={renderProps.value}
                                                        style={{ width: '100%', position: 'absolute' }}
                                                        thumbTintColor={colors.orange}
                                                        maximumTrackTintColor={"#dddddd"}
                                                        minimumTrackTintColor={colors.orange}
                                                    />
                                                );
                                            }}
                                        />
                                    </View>
                                    <TouchableOpacity style={{ marginTop: 19, marginLeft: -7 }} onPress={() => this.cansleRecord() }>
                                        <Image source={images.cansle} style={{ width: 20, height: 20 }} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                    <View style={{ height: 35, width: 1, backgroundColor: '#ddd', marginRight: 9, marginTop: 10, marginLeft: 12 }} />
                                </Animated.View>
                            </KeyboardAvoidingView>
                        </View>
                    </View>
                </Content>
                <Modal onBackdropPress={()=> this.setState({ isModalVisible : false })} isVisible={this.state.isModalVisible}>
                    <View style={{ height, width: '115%', backgroundColor: colors.darkBackground, right: 20 }}>
                        <Right style={[ styles.flex0, { alignSelf: 'flex-start', marginLeft: 20 }]}>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <View style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={{ uri: data.image }} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 }}>{ data.username }</Text>
                                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ i18n.t('online') }</Text>
                                </View>
                            </View>
                        </Right>
                        <TouchableOpacity onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} style={{ height: 45, width: 45, right: 35, position: 'absolute', flex: 1, }}>
                            <Image source={images.cross} style={{ width: 25, height: 25, margin: 20,}} resizeMode={'contain'}/>
                        </TouchableOpacity>

                        <View style={{ marginTop: 10, height, backgroundColor: colors.lightBackground, borderTopColor: '#ddd', borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', zIndex:1, top: -1 }} />
                            <View style={{ height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: '#ddd', transform: I18nManager.isRTL ? [{ rotate: '45deg'}] : [{ rotate: '-45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            <View style={{ width: '100%', height: height-80, marginTop: -80 }}>
                                {
                                    !this.state.initMap ? (
                                        <MapView
                                            style={{ flex: 1, width: '100%', height }}
                                            initialRegion={{
                                                latitude: this.state.mapRegion.latitude,
                                                longitude: this.state.mapRegion.longitude,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421,
                                            }}
                                        >
                                            <MapView.Marker draggable
                                                            coordinate={this.state.mapRegion}
                                                            onDragEnd={(e) =>  this._handleMapRegionChange(e.nativeEvent.coordinate)}
                                            >
                                                <Image source={images.my_location_map} resizeMode={'contain'} style={{ width: 50, height: 50 }}/>
                                            </MapView.Marker>
                                        </MapView>
                                    ) : (<View />)
                                }
                            </View>
                        </View>
                        <View style={{ backgroundColor: colors.inboxInputBackground, flexDirection:'row' , flex: 1, width: '100%',height:65, position:'absolute' , bottom:0, padding: 3, marginBottom: 6}}>
                            <View style={{ width: '90%', paddingHorizontal: 20, paddingBottom: 10, marginLeft: -15 }}>
                                <View style={{ borderRadius: 30, borderWidth: 1, borderColor: colors.labelFont, height: 40, marginTop: 5, padding: 5, flexDirection: 'row', backgroundColor: colors.inboxInput  }}>
                                    <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5,  }} bordered>
                                        <Input disabled value={this.state.location} placeholderTextColor={'#e5d7bb'} style={{ width: '100%', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 10, marginLeft: 30 }}  />
                                    </Item>
                                    <Image source={images.location_irbble} style={{ height: 27, width: 27, left: 5 }} resizeMode={'contain'} />
                                </View>
                            </View>
                            <TouchableOpacity style={{ flex: 1, marginTop: 15, marginRight: -10 }} onPress={() => this.sendMsg(4)}>
                                <Image source={images.tick} style={{ width: 25, height: 25 }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Container>
        );
    }
}

const mapStateToProps = ({ lang, profile, theme }) => {
    return {
        lang: lang.lang,
        user: profile.user,
        theme: theme.theme
    };
};

export default connect(mapStateToProps, {  })(Inbox);
