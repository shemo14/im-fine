import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Platform, I18nManager, Dimensions, FlatList, Slider} from "react-native";
import { Container, Content, Header, Left, Right, Body, Item, Switch, Picker, Toast } from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import themeImages from '../consts/Images'
import { connect } from 'react-redux';
import { chooseTheme, chooseLang, batteryStatus } from '../actions'
import CONST from '../consts';
import axios from 'axios';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class Settings extends Component {
    constructor(props){
        super(props);
        this.state = {
            theme: this.props.theme,
            SwitchOnValueHolder: true,
            SwitchOnValueHolder2: this.props.battery,
			lang: this.props.lang,
			batteryLevel: null
        }
    }

	setLang(lang){
		if (lang != this.state.lang){
			this.props.chooseLang(lang)
		}
	}

	componentWillMount() {
		axios({
			url: CONST.url + 'profile',
			method: 'POST',
			data: {lang: this.props.lang, id: this.props.user.id}
		}).then(response => {
			this.setState({
				SwitchOnValueHolder:  response.data.data.notification == 1 ? true : false
			})
		})
	}

	onDeleteAccount(){
		axios({
			url: CONST.url + 'delete',
			method: 'POST',
			data: {id: this.props.user.id}
		}).then(response => {
			this.props.logout(this.props.user.id);
			this.props.tempAuth();
		})

		this.props.navigation.navigate('login')
    }


	stopNotification = (value) =>{
		this.setState({  SwitchOnValueHolder:!this.state.SwitchOnValueHolder});

		axios({
			method: 'POST',
			url: CONST.url + 'update',
			data: { user_id: this.props.user.id, lang: this.props.lang, notification: value ? 1 : 0 }
		    }).then(response => {
				Toast.show({
					text: response.data.msg,
					type: response.data.status == 200 ? "success" : "danger",
					duration: 3000
				});
			})
	};

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('settings')  ,
        drawerIcon: (<Image source={require('../../assets/images/light_mode/cog.png')} style={{width:29 , height:29}} resizeMode={'contain'} /> )
    })

    stopBattery = (value) =>{
        this.setState({  SwitchOnValueHolder2:!this.state.SwitchOnValueHolder2});
		this.props.batteryStatus(value);
    };

    setTheme(theme){
        this.setState({ theme });
        this.props.chooseTheme(theme);
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
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('settings') }</Text>
                            </TouchableOpacity>
                        </Right>
                        <Body style={[styles.headerText , styles.headerTitle]}></Body>
                        <Left style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('home')} style={{ marginTop: 20 }}>
                                <Image source={images.back} style={{ width: 25, height: 25, margin: 5, marginTop: 15, transform: I18nManager.isRTL ? [{rotateY : '0deg'}] : [{rotateY : '-180deg'}] }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Left>
                    </View>
                </Header>
                <Content style={{ backgroundColor: colors.darkBackground, marginTop: -25 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                        <View style={{ marginTop: 10, backgroundColor: colors.lightBackground, borderTopColor: colors.pageBorder, borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ flex: 1, height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: colors.pageBorder, transform: I18nManager.isRTL ? [{ rotate: '45deg'}] : [{ rotate: '-45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            <View style={{ marginTop: -40, height: height-115 , paddingHorizontal:20 }}>
                                <View style={{flexDirection:'row' , justifyContent:'space-between' , alignItems:'center'}}>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('mode') }</Text>

                                    <View style={{flexDirection:'row' , justifyContent:'center' , alignItems:'center'}}>
                                        <TouchableOpacity onPress={() => this.setTheme('dark')} style={{flexDirection:'row' , justifyContent:'center' , alignItems:'center' , padding:3 , backgroundColor: this.state.theme === 'dark' ?colors.activeBG : colors.unActiveBG}}>
                                            <Image source={require('../../assets/images/dark_mode/dark_mode.png')} style={{ width: 20, height: 20 , marginRight:3}} resizeMode={'contain'} />
                                            <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 13 , color: colors.labelFont }}>{ i18n.t('night') }</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this.setTheme('light')} style={{flexDirection:'row' , justifyContent:'center' , alignItems:'center' , padding:3 , backgroundColor: this.state.theme === 'light' ?colors.activeBG : colors.unActiveBG}}>
                                            <Image source={require('../../assets/images/light_mode/light_mode.png')} style={{ width: 20, height: 20 , marginRight:3}} resizeMode={'contain'} />
                                            <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 13 , color: colors.labelFont }}>{ i18n.t('light') }</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{backgroundColor:'#ad9bc1' , height:.5 , width:'100%' , marginVertical:20}}/>

                                <View style={{flexDirection:'row' , justifyContent:'space-between' , alignItems:'center'}}>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('notifications') }</Text>
                                    <Switch
                                        onValueChange={(value) => this.stopNotification(value)}
                                        value={this.state.SwitchOnValueHolder}
                                        trackColor={colors.activeSwitch}
                                        thumbColor={colors.darkBackground}
                                        trackColor={colors.sendMsg}
                                    />
                                </View>

                                <View style={{backgroundColor:'#ad9bc1' , height:.5 , width:'100%' , marginVertical:20}}/>

                                <View style={{flexDirection:'row' , justifyContent:'space-between' , alignItems:'center'}}>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('batteryNoti') }</Text>
                                    <Switch
                                        onValueChange={(value) => this.stopBattery(value)}
                                        value={this.state.SwitchOnValueHolder2}
                                        trackColor={colors.activeSwitch}
                                        thumbColor={colors.darkBackground}
                                        trackColor={colors.activeBG}
                                    />
                                </View>

                                <View style={{backgroundColor:'#ad9bc1' , height:.5 , width:'100%' , marginVertical:20}}/>

                                <View style={{flexDirection:'row' , justifyContent:'space-between', alignItems:'center'}}>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('language') }</Text>
                                    <Item style={[{borderWidth: 1,
                                        height: 30,
                                        borderRadius: 25,
                                        padding: 0,
                                        flexDirection: 'row' ,
                                        overflow: 'hidden',
                                        width:'40%' , backgroundColor:'transparent' , borderColor:'transparent'}]} regular >
                                        <Picker
                                            mode="dropdown"
                                            style={{width: Platform.OS === 'ios' ? 95: undefined,
                                                backgroundColor: 'transparent',
                                                color: colors.orange ,
                                                fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
                                                fontWeight: 'normal',
                                                marginLeft:0,
                                                fontSize:5,
                                                textAlign: I18nManager.isRTL ?'right' : 'left',}}
                                            placeholderStyle={{ color: colors.orange }}
                                            placeholderIconColor="#acabae"
											selectedValue={this.state.lang}
											onValueChange={(value) => this.setLang(value)}
                                        >
                                            <Picker.Item label={'عربي'} value={"ar"} />
                                            <Picker.Item label={'English'} value={"en"} />
                                            <Picker.Item label={'Urdo'} value={"ur"} />
                                            <Picker.Item label={'Espanol'} value={"es"} />
                                        </Picker>
                                        <Image source={require('../../assets/images/dark_mode/drop_down_img.png')}  style={{right:5,width:15 , height:15}} resizeMode={'contain'} />
                                    </Item>
                                </View>

                                <View style={{backgroundColor:'#ad9bc1' , height:.5 , width:'100%' , marginVertical:20}}/>

                                <TouchableOpacity onPress={() => this.onDeleteAccount()} style={{justifyContent:'space-between' , alignItems:'center' , alignSelf:'center' , marginTop:15}}>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.orange }}>{ i18n.t('closeAcc') }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = ({ lang, profile, theme, battery }) => {
    return {
        lang: lang.lang,
        user: profile.user,
		battery: battery.batteryNotify,
        theme: theme.theme
    };
};

export default connect(mapStateToProps, { chooseTheme, chooseLang, batteryStatus })(Settings);
