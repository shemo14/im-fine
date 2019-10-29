import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Animated, I18nManager, Dimensions, KeyboardAvoidingView, ScrollView, Slider} from "react-native";
import {Container, Content, Header, Left, Right, Body, Button, Icon, Item, Label, Input} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import MapView from 'react-native-maps';
import { Video, Audio } from 'expo-av';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const themeImages = {
    lightImages: {
        big_logo : require('../../assets/images/dark_mode/big_logo.png'),
        drawer: require('../../assets/images/light_mode/drawer.png'),
        logo_tittle: require('../../assets/images/light_mode/logo_tittle.png'),
        search: require('../../assets/images/dark_mode/search.png'),
        chat_non: require('../../assets/images/dark_mode/chat_non.png'),
        chat_active: require('../../assets/images/dark_mode/chat_active.png'),
        bell_non: require('../../assets/images/dark_mode/bell_non.png'),
        bell_active: require('../../assets/images/dark_mode/bell_active.png'),
        stopwatch_non: require('../../assets/images/dark_mode/stopwatch_non.png'),
        stopwatch_active: require('../../assets/images/dark_mode/stopwatch_active.png'),
        person_one: require('../../assets/images/dark_mode/person_one.png'),
        person_two: require('../../assets/images/dark_mode/person_two.png'),
        emergency: require('../../assets/images/dark_mode/emergency.png'),
        stop_watch_time: require('../../assets/images/dark_mode/stop_watch_time.png'),
        choose_time: require('../../assets/images/dark_mode/choose_time.png'),
        timer_twinty_four: require('../../assets/images/dark_mode/timer_twinty_four.png'),
        cross: require('../../assets/images/dark_mode/cross.png'),
        back: require('../../assets/images/dark_mode/back.png'),
        tick_blue: require('../../assets/images/dark_mode/tick_blue.png'),
        play_button_big: require('../../assets/images/dark_mode/play_button_big.png'),
    },
    darkImages: {
        big_logo : require('../../assets/images/dark_mode/big_logo.png'),
        drawer: require('../../assets/images/dark_mode/drawer.png'),
        logo_tittle: require('../../assets/images/light_mode/logo_tittle.png'),
        search: require('../../assets/images/dark_mode/search.png'),
        chat_non: require('../../assets/images/dark_mode/chat_non.png'),
        chat_active: require('../../assets/images/dark_mode/chat_active.png'),
        bell_non: require('../../assets/images/dark_mode/bell_non.png'),
        bell_active: require('../../assets/images/dark_mode/bell_active.png'),
        stopwatch_non: require('../../assets/images/dark_mode/stopwatch_non.png'),
        stopwatch_active: require('../../assets/images/dark_mode/stopwatch_active.png'),
        person_one: require('../../assets/images/dark_mode/person_one.png'),
        person_two: require('../../assets/images/dark_mode/person_two.png'),
        emergency: require('../../assets/images/dark_mode/emergency.png'),
        stop_watch_time: require('../../assets/images/dark_mode/stop_watch_time.png'),
        choose_time: require('../../assets/images/dark_mode/choose_time.png'),
        timer_twinty_four: require('../../assets/images/dark_mode/timer_twinty_four.png'),
        cross: require('../../assets/images/dark_mode/cross.png'),
        back: require('../../assets/images/dark_mode/back.png'),
        tick_blue: require('../../assets/images/dark_mode/tick_blue.png'),
        play_button_big: require('../../assets/images/dark_mode/play_button_big.png'),
    }
}

const messages = [{
    id: 1,
    sender_id: 1,
    receiver_id: 2,
    type: 1, // 1 => text, 2 => location, 3 => video, 4 => record
    message: 'هذا نص لوصف محتوي الرسالة اللي انا باعتها',
    lat: 31.0413814,
    long: 31.3478201,
    file: null,
    time: 'منذ 3 دقائق'
},{
    id: 2,
    sender_id: 2,
    receiver_id: 1,
    type: 2, // 1 => text, 2 => location, 3 => video, 4 => record
    message: null,
    lat: 31.0413814,
    long: 31.3478201,
    file: null,
    time: 'منذ 3 دقائق'
},{
    id: 3,
    sender_id: 1,
    receiver_id: 2,
    type: 3, // 1 => text, 2 => location, 3 => video, 4 => record
    message: null,
    lat: 31.0413814,
    long: 31.3478201,
    file: "http://node.aait.sa/old/I'm_fine/public/uploads/videos/jyMuKOMx6c.mp4",
    time: 'منذ 3 دقائق'
},{
    id: 4,
    sender_id: 2,
    receiver_id: 1,
    type: 4, // 1 => text, 2 => location, 3 => video, 4 => record
    message: null,
    lat: 31.0413814,
    long: 31.3478201,
    file: "http://node.aait.sa/old/I'm_fine/public/uploads/audios/2E05VwzUPG.mp3",
    time: 'منذ 3 دقائق'
},]

class Inbox extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: 1,
            isTimePickerVisible: false,
            timeType: 'start',
            fadeAnim: new Animated.Value(-height),
            availabel: 0,
            search: '',
            messages,
            lat: null,
            long: null,
            playedVideo: null
        }
    }

    componentWillMount() {
        this.setState({ initMap: false });
    }

    videoControl(id){
        if (this.state.playedVideo == id)
            this.setState({ playedVideo: null })
        else
            this.setState({ playedVideo: id })
    }

    renderMsg(message, i, styles, colors, images){
        if (message.sender_id == 1){
            if (message.type == 1){
                return (
                    <View key={i} style={{ width: (width*80)/100, backgroundColor: colors.sendMsg, borderRadius: 20, alignSelf: 'flex-start', marginHorizontal: 20, marginVertical: 10, padding: 10 }}>
                        <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{message.message}</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 5 }}>
                            <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.time}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2 }} />
                        </View>
                    </View>
                );
            }else if (message.type == 2){
                return (
                    <View key={i} style={{ width: (width*80)/100, backgroundColor: colors.receiverMsg, borderRadius: 20, alignSelf: 'flex-end', marginHorizontal: 20, marginVertical: 10, padding: 10 }}>
                        <TouchableOpacity style={{ width: '100%', height: 300 }}>
                            {
                                !this.state.initMap ? (
                                    <MapView
                                        style={{ flex: 1, width: 300, height: 260 }}
                                        initialRegion={{
                                            latitude: message.lat,
                                            longitude: message.long,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    />
                                ) : (<View />)
                            }
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 5 }}>
                            <Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.time}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2 }} />
                        </View>
                    </View>
                )
            }else if (message.type == 3){
                return (
                    <View key={i} style={{ width: (width*80)/100, height: 200, backgroundColor: colors.sendMsg, borderRadius: 20, alignSelf: 'flex-start', marginHorizontal: 20, marginVertical: 10 }}>
                        <View style={{ width: '100%', height: 160 }}>
                            <Video
                                source={{ uri: message.file }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                shouldPlay={this.state.playedVideo == message.id ? true: false}
                                isLooping
                                style={{ width: '100%', height: 160 }}
                            />
                            <TouchableOpacity onPress={() => this.videoControl(message.id)} style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', flex: 1, top: '30%', right: '41%' }}>
                                <Image source={this.state.playedVideo == message.id ? images.play_button_big : images.play_button_big} style={{ width: 50, height: 50, alignSelf: 'center' }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', padding: 10 }}>
                            <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.time}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2 }} />
                        </View>
                    </View>
                )
            }
        } else{
            if (message.type == 1){
                return (
                    <View key={i} style={{ width: (width*80)/100, backgroundColor: colors.receiverMsg, borderRadius: 20, alignSelf: 'flex-end', marginHorizontal: 20, marginVertical: 10, padding: 10 }}>
                        <Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{message.message}</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 5 }}>
                            <Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.time}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2 }} />
                        </View>
                    </View>
                );
            }else if(message.type == 2){
                return (
                    <View key={i} style={{ width: (width*80)/100, height: 200, backgroundColor: colors.receiverMsg, borderRadius: 20, alignSelf: 'flex-end', marginHorizontal: 20, marginVertical: 10}}>
                        <TouchableOpacity style={{ width: '100%', height: 160 }}>
                            {
                                !this.state.initMap ? (
                                    <MapView
                                        style={{ flex: 1, width: '100%', height: 160, borderRadius: 20 }}
                                        initialRegion={{
                                            latitude: message.lat,
                                            longitude: message.long,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    />
                                ) : (<View />)
                            }
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', padding: 10 }}>
                            <Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.time}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2 }} />
                        </View>
                    </View>
                )
            }else if(message.type == 3){
                return (
                    <View key={i} style={{ width: (width*80)/100, height: 200, backgroundColor: colors.sendMsg, borderRadius: 20, alignSelf: 'flex-start', marginHorizontal: 20, marginVertical: 10 }}>
                        <View style={{ width: '100%', height: 160 }}>
                            <Video
                                source={{ uri: message.file }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                shouldPlay={this.state.playedVideo == message.id ? true: false}
                                isLooping
                                style={{ width: '100%', height: 160 }}
                            />
                            <TouchableOpacity onPress={() => this.videoControl(message.id)} style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', flex: 1, top: '30%', right: '41%' }}>
                                <Image source={this.state.playedVideo == message.id ? images.play_button_big : images.play_button_big} style={{ width: 50, height: 50, alignSelf: 'center' }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', padding: 10 }}>
                            <Text style={{ color: colors.sendFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.time}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2 }} />
                        </View>
                    </View>
                )
            }else if(message.type == 4){
                return (
                    <View key={i} style={{ width: (width*80)/100, backgroundColor: colors.receiverMsg, borderRadius: 20, alignSelf: 'flex-end', marginHorizontal: 20, marginVertical: 10, padding: 10, marginBottom:  50 }}>
                        <View>
                            <Slider
                                style={{ backgroundColor: '#000' }}
                                value={20}
                                onValueChange={(value) => console.log(value)}
                                // onSlidingComplete={alert('done')}
                                // disabled={
                                //     !this.state.isPlaybackAllowed || this.state.isLoading
                                // }
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 5 }}>
                            <Text style={{ color: colors.receiverFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 12 }}>{message.time}</Text>
                            <Image source={images.tick_blue} resizeMode={'contain'} style={{ width: 15, height: 15, marginTop: 2 }} />
                        </View>
                    </View>
                );
            }
        }
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
            <Container style={{ backgroundColor: colors.darkBackground }}>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
                        <Right style={styles.flex0}>
                            <View style={{ flexDirection: 'row', marginTop: 33 }}>
                                <View style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={images.person_two} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 }}>اوامر الشركة</Text>
                                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ i18n.t('online') }</Text>
                                </View>
                            </View>
                        </Right>
                        <Body style={[styles.headerText , styles.headerTitle]}></Body>
                        <Left style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.geBack()} style={{ marginTop: 20 }}>
                                <Image source={images.back} style={{ width: 25, height: 25, margin: 5, marginTop: 15 }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Left>
                    </View>
                </Header>
                <Content style={{ backgroundColor: colors.darkBackground, marginTop: -25 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                        <View style={{ marginTop: 10, backgroundColor: colors.lightBackground, borderTopColor: '#ddd', borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ flex: 1, height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: '#ddd', transform: [{ rotate: '45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />

                            <KeyboardAvoidingView behavior={'position'} style={{width:'100%', flexDirection:'column', flex: 1, zIndex: -1, marginTop: -77 }}>
                                <ScrollView
                                    ref={ref => this.scrollView = ref}
                                    onContentSizeChange={(contentWidth, contentHeight)=>{
                                        this.scrollView.scrollToEnd({animated: true});
                                    }}
                                    style={{height:height-70 }}>
                                    {
                                        this.state.messages.map((msg, i) => this.renderMsg(msg, i, styles, colors, images))
                                    }
                                </ScrollView>
                                <View style={{ backgroundColor:'#fff' , borderTopWidth:3 , borderColor:'#eee' , flexDirection:'row' , flex: 1, width: '100%',height:60, position:'absolute' , bottom:0}}>
                                    <Item  style={{flex:1,zIndex:2222 , borderWidth:1 , borderColor:'#eee', borderRadius:50, height:45 , alignSelf:'flex-end' , marginBottom:5}}>
                                        <Input placeholder="أكتب رسالتك..." onChangeText={(msg) => this.setState({ msg })} value={this.state.msg}
                                               style={{ flex:1, width:'100%', paddingLeft:15 , paddingRight:15,marginRight:15 , borderWidth:1 , borderColor:'#eee', borderRadius:50, paddingBottom:10 , color: '#797979' , textAlign:'right' , backgroundColor:'#fff'}}
                                               // placeholderTextColor={{ color: '#a7a7a7' }}
                                        />
                                    </Item>
                                </View>
                            </KeyboardAvoidingView>

                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Inbox;
