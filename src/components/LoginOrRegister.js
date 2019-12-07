import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage , I18nManager, } from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, Picker} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import { connect } from 'react-redux';
import { chooseTheme, chooseLang } from '../actions'
import {Notifications} from "expo";
import * as Permissions from "expo-permissions";

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
		setTimeout(() => this.allowNotification(), 10000);
	}

	async allowNotification(){
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);

		let finalStatus = existingStatus;

		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			return;
		}

		const deviceId = await Notifications.getExpoPushTokenAsync();
		this.setState({ deviceId, userId: null });
		AsyncStorage.setItem('deviceID', deviceId);

		console.log(deviceId);
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
