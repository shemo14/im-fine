import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Animated, I18nManager, Dimensions, FlatList, Slider, Platform} from "react-native";
import {Container, Content, Header, Left, Right, Body, Button, Icon, Item, Label, Input} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import axios from 'axios'
import themeImages from '../consts/Images'
import {Audio} from "expo-av";
import {Recorder} from 'react-native-audio-player-recorder-no-linking';
import VideoRecorder from "./VideoRecorder";
import {connect} from "react-redux";
import CONST from "../consts";

const height 	= Dimensions.get('window').height;
const width 	= Dimensions.get('window').width;

const IS_IPHONE_X 	= (height === 812 || height === 896) && Platform.OS === 'ios';

class NotFine extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: 1,
            isTimePickerVisible: false,
            startTime: '',
            endTime: '',
            tfTime: '',
            timeType: 'start',
            fadeAnim: new Animated.Value(-55),
            availabel: 0,
            search: '',
            refreshed: false,
            mapRegion: [],
            location: '',
            startRecord: false,
            finishRecord: false,
            resetRecord: false,
            item: null,
            setCallBack: null,
            status: [
				{
					title: i18n.t('sick'),
					image: themeImages.lightImages.patient,
					type: 1
				},{
					title: i18n.t('lost'),
					image: themeImages.lightImages.lost,
					type: 2
				},{
					title: i18n.t('in_danger'),
					image: themeImages.lightImages.caution,
					type: 3
				},{
					title: i18n.t('call_me'),
					image: themeImages.lightImages.support,
					type: 4
				},{
					title: i18n.t('message_me'),
					image: themeImages.lightImages.message_me,
					type: 5
				},{
					title: i18n.t('record_video'),
					image: themeImages.lightImages.vedio_call,
					type: 6
				},{
					title: i18n.t('kidnapped'),
					image: themeImages.lightImages.kidnapping,
					type: 7
				},{
					title: i18n.t('record_voice'),
					image: themeImages.lightImages.recourdStatus,
					type: 8
				},{
					title: i18n.t('accident'),
					image: themeImages.lightImages.accident,
					type: 9
				},
			]
        }
    }

    _keyExtractor = (item, index) => item.id;

    setAnimate(){
        if (this.state.availabel === 0){
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: IS_IPHONE_X ? -6 : 0,
                    duration: 800,
                },
            ).start();
            this.setState({ availabel: 1 });
        }else {
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: -55,
                    duration: 800,
                },
            ).start();
            this.setState({ availabel: 0 });
        }
    }

    startRecord(){
        this.setAnimate();
        this.setState({ startRecord: true, finishRecord: false, resetRecord: false, })
    }

    cansleRecord(){
        this.setAnimate();
        this.setState({ resetRecord: true, startRecord: false, finishRecord: false,  })
    }

    setStatus(type, image, item){
        if (type === 8){
            this.setAnimate();
            this.startRecord();
            this.setState({ item })
        } else if (type === 6){
			this.setState({ item });
            this.props.navigation.navigate('VideoRecorder', { mapRegion: this.state.mapRegion });
        }else{
			this.playAudio();
            this.sendMsg(null, item);
			this.props.navigation.navigate('confirmStatus', { image });
        }
    }

	async playAudio(){
		const soundObject = new Audio.Sound();
		try {
			await soundObject.loadAsync(require('../../assets/sounds/notFine.mp3'));
			await soundObject.playAsync();

		} catch (error) {
			console.log('fuck error', error)
		}
	}

    renderItems(item, colors){
        return (
            <TouchableOpacity onPress={() => this.setStatus(item.type, item.image, item)} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, margin: 10 }}>
                <View style={{ height: 80, width: 80, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: colors.border, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={item.image} resizeMode={'contain'} style={{ width: 50, height: 50 }} />
                </View>
                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, marginTop: 10 }}>{ item.title }</Text>
            </TouchableOpacity>
        )
    }

    async componentWillMount() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation = { latitude, longitude };
            this.setState({  mapRegion: userLocation });
        }


        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
        getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=' + this.props.lang + '&sensor=true';

        try {
            const { data } = await axios.get(getCity);
            this.setState({ location: data.results[0].formatted_address });
        } catch (e) {
            console.log(e);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params && nextProps.navigation.state.params.recording !== undefined){
            const uri = nextProps.navigation.state.params.recording.uri;
            this.sendMsg(uri, this.state.item);
        }
	}


	sendMsg(uri = null, status){
		let formData = new FormData();

		let msgType = 4;
		if (status.type == 6)
			msgType = 2;
		else if(status.type == 8){
			this.cansleRecord();
			msgType = 1;
        }

		if (uri){
			let localUri = uri;
			let filename = localUri.split('/').pop();

			let match = /\.(\w+)$/.exec(filename);

			let type = match ? `audio/${match[1]}` : audio;
			if (msgType === 2)
				type = match ? `video/${match[1]}` : video;

			formData.append('files', { uri: localUri, name: filename, type });
		}


		axios.post(CONST.url + 'send', {
			user_id: this.props.user.id,
			r_id: null,
			message: i18n.t('imNotFine') + ' : ' + status.title,
			type: msgType,
			lat: this.state.mapRegion.latitude,
			lng: this.state.mapRegion.longitude,
			seen:0,
			status: status.type,
			connected: 1,
			lang: this.props.lang
		}).then(response => {
			if(msgType == 1 || msgType == 2){
				formData.append('id', JSON.stringify(response.data.data));
				axios.post(CONST.url + 'upload', formData).then(res => {
					this.emitSendMsg(response.data.data.room, response.data.data.msg);
					this.scrollView.scrollToEnd({animated: true});
					return this.componentWillMount();
				});
			}

			axios.post(CONST.url + 'stop_ready', { user_id: this.props.user.id, lang: this.props.lang }).then(response => {
				this.setState({ setCallBack: 200 });
			});

			this.setState({ message: '' });
			this.emitSendMsg(response.data.data.room, response.data.data.msg);
			this.scrollView.scrollToEnd({animated: true});
			this.componentWillMount();
		})
	}

    onFocus(){

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
			<View style={{ flexDirection: 'column', justifyContent: 'space-between', height: IS_IPHONE_X ? height-250 : height-135, marginTop: IS_IPHONE_X ? 0 : -50}}>
				<View>
					<Text style={{ fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', color: colors.labelFont, fontSize: 18, marginHorizontal: 20, marginBottom: 40, textAlign: I18nManager.isRTL ? 'right' : 'left', alignSelf: 'flex-start'  }}>{ i18n.t('whyNotFine') }</Text>

					<FlatList
						style={{ alignSelf: 'center', width: '100%'}}
						data={this.state.status}
						renderItem={({ item }) => this.renderItems(item, colors)}
						numColumns={3}
						keyExtractor={this._keyExtractor}
						extraData={this.state.refreshed}
					/>

				</View>


				<View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20, borderWidth: 1, borderRadius: 30, borderColor: colors.border, padding: 5, marginBottom: 10, bottom: 10, position: 'absolute' }}>
					<Image source={images.place} style={{ height: 25, width: 25, marginHorizontal: 10 }} resizeMode={'contain'} />
					<Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, marginTop: 5 }}>{ (this.state.location).substring(1, 40) + '...' }</Text>
				</View>

				<Animated.View style={{ backgroundColor: colors.inboxInputBackground, flexDirection:'row' , flex: 1, width: '100%',height: 50, position:'absolute' , bottom: this.state.fadeAnim, padding: 3, paddingBottom: 6 }}>
					<View style={{ width: '84%', paddingHorizontal: 20, paddingBottom: 10, marginLeft: -15 }}>
						<Recorder
							style={{flex: 1}}
							onComplete={(i) => this.sendMsg(i.uri, this.state.item)}
							maxDurationMillis={150000}
							showDebug={false}
							startRecord={this.state.startRecord}
							resetRecord={this.state.resetRecord}
							finishRecord={this.state.finishRecord}
							showBackButton={true}
							audioMode={{
								allowsRecordingIOS: true,
								interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
								playsInSilentModeIOS: true,
								playsInSilentLockedModeIOS: true,
								staysActiveInBackground: true,
								shouldDuckAndroid: true,
								interruptionModeAndroid:
								Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
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
			</View>
        );
    }
}

const mapStateToProps = ({ lang, profile, auth, theme }) => {
    return {
        lang: lang.lang,
        theme: theme.theme,
        user: profile.user,
        auth: auth.user
    };
};

export default connect(mapStateToProps, {  })(NotFine);
