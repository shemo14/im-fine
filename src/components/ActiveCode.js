import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Platform, I18nManager, Dimensions} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, CheckBox} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'
import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";
import Modal from "react-native-modal";
import axios from "axios";
import CONST from "../consts";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const themeImages = {
    lightImages: {
        big_logo : require('../../assets/images/dark_mode/big_logo.png'),
        checkmark: require('../../assets/images/dark_mode/checkmark.png'),
    },
    darkImages: {
        big_logo : require('../../assets/images/dark_mode/big_logo.png'),
        checkmark: require('../../assets/images/dark_mode/checkmark.png'),
    }
}

class ActiveCode extends Component {
    constructor(props){
        super(props);
        this.state = {
            code: '',
			resendCode: null,
            isSubmitted: false,
            userId: null
        }
    }

    componentWillMount(){
        const code = this.props.navigation.state.params.code;
        this.setState({ resendCode: code });
    }

    renderSubmit(colors){
        if (this.state.isSubmitted){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <DoubleBounce size={20} color={colors.orange} />
                </View>
            )
        }

        return (
            <View style={{ bottom: 25, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                <TouchableOpacity onPress={() => this.onPressActive()} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                </TouchableOpacity>
            </View>
        );
    }

    onPressActive(){
        const data = this.props.navigation.state.params.data;
        const code = this.state.resendCode;
        if (this.state.code == code){
            this.props.userLogin({ id: data.id, code }, this.props.lang);
        }else{
            Toast.show({
                text: i18n.t('codeNotCorrect'),
                type: "danger",
                duration: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					textAlign   	: 'center'
				}
            });
        }
    }

    componentWillReceiveProps(newProps){

        if (newProps.auth !== null && newProps.auth.status === 200){

            console.log('this is user id...', this.state.userId);

            if (this.state.userId === null){
                this.setState({ userId: newProps.auth.data.id });
                this.props.profile(newProps.auth.data.id, this.props.lang);
            }

            const register = newProps.navigation.state.params.register;

            this.props.navigation.navigate(register ? 'emergencyList' : 'drawerNavigator', { userId: newProps.auth.data.id });
        }

        if (newProps.auth !== null) {
            Toast.show({
                text: newProps.auth.msg,
                type: newProps.auth.status === 200 ? "success" : "danger",
                duration: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					textAlign   	: 'center'
				}
            });
        }
    }

	resendCode(){
		const data      = this.props.navigation.state.params.data;
		const device_id = this.props.navigation.state.params.device_id;
		axios.post(CONST.url + 'sign-in', { phone: '0' + data.mobile, country_code: data.country_code, lang: this.props.lang, device_id}).then(response => {
			if(response.data.status == 200){
				this.setState({ resendCode: response.data.extra.code });
			}else{
				Toast.show({
					text: response.data.msg,
					type: "danger",
					duration: 3000,
					textStyle   	: {
						color       	: "white",
						fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
						textAlign   	: 'center'
					}
				});
			}
		})
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
                    <View style={styles.contentBackground}>
                        <View style={{ alignItems: 'center', marginTop: 100 }}>
                            <Image resizeMode={'contain'} source={images.big_logo} style={{ width: 120, height: 120, alignSelf: 'center' }} />
                        </View>
                        <Form style={{ width: '100%', paddingHorizontal: 40, marginTop: 70 }}>
                            <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                                <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                    <Label style={{ top:5, paddingRight: 10, paddingLeft: 10, backgroundColor: colors.darkBackground, alignSelf: 'flex-start', color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', position: 'absolute' }}>{ i18n.t('activationCode') }</Label>
                                    <Input placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('activationCode') + '...'} onChangeText={(code) => this.setState({code})} keyboardType={'number-pad'} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', top: 15 }}  />
                                </Item>
                                <Image source={images.checkmark} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                            </View>
                            <TouchableOpacity onPress={() => this.resendCode()} style={{ marginTop: 50, alignItems: 'center', width: '100%', height: 40, justifyContent: 'center' }}>
                                <Text style={{ backgroundColor: colors.darkBackground, color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', }}>اعادة ارسال الكود</Text>
                            </TouchableOpacity>
                        </Form>

                        { this.renderSubmit(colors) }
                    </View>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = ({ theme, lang, auth, profile }) => {
    return {
        theme: theme.theme,
        lang: lang.lang,
        loading: auth.loading,
        auth: auth.user,
        user: profile.user,
    };
};

export default connect(mapStateToProps, { userLogin, profile })(ActiveCode);
