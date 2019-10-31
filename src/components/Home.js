import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Animated, I18nManager, Dimensions} from "react-native";
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
import axios from 'axios';
import CONST from '../consts';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

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
            dailySubmit: false
        }
    }

    showTimePicker = (timeType) => {
        this.setState({ isTimePickerVisible: true, timeType });
    };

    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    };

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

    renderStandBySubmit(colors){
        if (this.state.startTime == '' || this.state.endTime == ''){
            return (
                <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
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
            <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                <TouchableOpacity onPress={() => this.onStandBy()} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                </TouchableOpacity>
            </View>
        )
    }

    renderDailySubmit(colors){
        if (this.state.tfTime == ''){
            return (
                <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
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
            <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                <TouchableOpacity onPress={() => this.onDaily()} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                </TouchableOpacity>
            </View>
        )
    }

    onStandBy(){
        this.setState({ standBySubmit: true });
        axios.post(CONST.url + 'stop_ready', { user_id: this.props.user.id, time: this.state.startTime, lang: this.props.lang }).then(response => {
            this.setState({ standBySubmit: false, startTime: '', endTime: '' });
            Toast.show({
                text: response.data.msg,
                type: "success",
                duration: 3000
            });
        })
    }

    onDaily(){
        this.setState({ DailySubmit: true });
        axios.post(CONST.url + 'everyday', { user_id: this.props.user.id, time: this.state.tfTime, lang: this.props.lang }).then(response => {
            this.setState({ standBySubmit: false, tfTime: '' });
            Toast.show({
                text: response.data.msg,
                type: "success",
                duration: 3000
            });
        })
    }

    componentWillMount(){
        this.setState({ loader: true });
        axios.post(CONST.url + 'chat', { user_id: this.props.user.id }).then(response => {
            this.setState({ rooms: response.data.data, loader: false })
        })
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

    renderContent(styles, images, colors){
        if (this.state.type == 1){
            return (
                <View style={{ padding: 25, marginTop: -77 }}>
                    <View>
                        {
                            this.state.rooms.map((room,i) => (
                                <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('inbox', { data: room })} style={{ flexDirection: 'row', borderBottomColor: '#f0e2c0', borderBottomWidth: 1, paddingVertical: 10 }}>
                                    <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: room.img }} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                    </View>
                                    <View style={{ padding: 10 }}>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15, alignSelf: 'flex-start' }}>{ room.username }</Text>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ room.msg }</Text>
                                    </View>
                                    <View style={{ marginHorizontal: 20 , position: 'absolute', right: 2, top: 10}}>
                                        <Text style={{ color: colors.orange, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ room.date }</Text>
                                        <View style={{ backgroundColor: colors.orange, borderRadius: 20, height: 20, width: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 10 }}>
                                            <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' }}>{ room.count }</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            );
        }else if(this.state.type == 2){
            return (
                <View style={{ padding: 25, marginTop: -77, height: height-120 }}>
                    <Image source={images.stop_watch_time} style={{ width: 100, height: 100, alignSelf: 'center' }} resizeMode={'contain'} />
                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', textAlign: 'center', fontSize: 16, marginTop: 10 }}>اختر الوقت</Text>

                    <View style={{ marginTop: 50, width: '100%' }}>
                        <TouchableOpacity onPress={() => this.showTimePicker('start')} style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                            <Item onPress={() => this.showTimePicker('start')} style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', width: 75, backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('startTime') }</Label>
                                <Input value={this.state.startTime.toString()} disabled placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('startTime') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                            </Item>
                            <Image source={images.choose_time} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.isTimePickerVisible}
                            onConfirm={this.handleTimePicked}
                            onCancel={this.hideTimePicker}
                            mode={'time'}
                        />
                    </View>

                    <View style={{ marginTop: 20, width: '100%' }}>
                        <TouchableOpacity onPress={() => this.showTimePicker('end')} style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                            <Item onPress={() => this.showTimePicker('end')} style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', width: 75, backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('startTime') }</Label>
                                <Input value={this.state.endTime.toString()} disabled placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('startTime') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                            </Item>
                            <Image source={images.choose_time} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <DateTimePicker
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
                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', textAlign: 'center', fontSize: 16, marginTop: 10 }}>اختر الوقت</Text>

                    <View style={{ marginTop: 50, width: '100%' }}>
                        <TouchableOpacity onPress={() => this.showTimePicker('tfTime')} style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                            <Item onPress={() => this.showTimePicker('tfTime')} style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', width: 75, backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('startTime') }</Label>
                                <Input value={this.state.tfTime.toString()} disabled placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('startTime') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                            </Item>
                            <Image source={images.choose_time} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <DateTimePicker
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
                <Content style={{ backgroundColor: colors.darkBackground, marginTop: -25 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <Animated.View style={{ height, width, position: 'absolute', top: this.state.fadeAnim, backgroundColor: '#0000005e', zIndex: 2 }}>
                        <View style={{ width: '100%', backgroundColor: colors.darkBackground, paddingHorizontal: 20, paddingBottom: 10 }}>
                            <View style={{ borderRadius: 30, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 5, padding: 5, flexDirection: 'row'  }}>
                                <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                    <Input placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('search') + '...'} onChangeText={(search) => this.setState({search})} style={{ width: '100%', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                                </Item>
                                <Image source={images.search} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                            </View>
                        </View>
                    </Animated.View>
                    <View>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
                            <TouchableOpacity onPress={() => [ this.setState({ type: 1 }), this.componentWillMount() ]} style={{ flexDirection: 'row', width: '33%' }}>
                                <Image source={this.state.type == 1 ? images.chat_active : images.chat_non} style={{ width: 25, height: 25, margin: 5 }} resizeMode={'contain'} />
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15, marginTop: 5, color: this.state.type == 1 ? colors.active : colors.unActive }}>محدثات</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ type: 2 })} style={{ flexDirection: 'row', width: '33%', marginLeft: -7 }}>
                                <Image source={this.state.type == 2 ? images.bell_active : images.bell_non} style={{ width: 25, height: 25, margin: 5 }} resizeMode={'contain'} />
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15, marginTop: 5, color: this.state.type == 2 ? colors.active : colors.unActive }}>وضع التأهب</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ type: 3 })} style={{ flexDirection: 'row', width: '33%' }}>
                                <Image source={this.state.type == 3 ? images.stopwatch_active : images.stopwatch_non} style={{ width: 25, height: 25, margin: 5 }} resizeMode={'contain'} />
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15, marginTop: 5, color: this.state.type == 3 ? colors.active : colors.unActive }}>تنبيه 24 ساعة</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 10, backgroundColor: colors.lightBackground, borderTopColor: '#ddd', borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ flex: 1, height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: '#ddd', transform: [{ rotate: '45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            { this.renderLoader(colors) }
                            <View style={{ height: height-200 }}>
                                { this.renderContent(styles, images, colors) }
                            </View>
                        </View>
                    </View>
                </Content>
                {
                    this.state.type == 1 ? (
                        <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('notFine')} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Image source={require('../../assets/images/dark_mode/emergency.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                    ) : (<View />)
                }
            </Container>
        );
    }
}

const mapStateToProps = ({ lang, profile }) => {
    return {
        lang: lang.lang,
        user: profile.user
    };
};

export default connect(mapStateToProps, {  })(Home);
