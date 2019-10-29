import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, BackHandler, Linking, AsyncStorage , I18nManager} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import i18n from '../../locale/i18n'
import { connect } from 'react-redux';
import { chooseTheme } from '../actions'

const themeImages = {
    lightImages: {
        bg_splash: require('../../assets/images/dark_mode/bg_splash.png')
    },
    darkImages: {
        bg_splash: require('../../assets/images/light_mode/bg_splash.png')
    }
}

class LoginOrRegister extends Component {
    constructor(props){
        super(props);
        this.state = {
            theme: 'light',
        }
    }

    setTheme(){
        if (this.props.theme == 'light') {
            this.props.chooseTheme('dark')
        }else{
            this.props.chooseTheme('light')
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('theme').then(theme => {
            this.setState({ theme })
            console.log(theme)
        })
    }

    render() {
        let styles = lightStyles;
        let images = themeImages.lightImages;

        if (this.props.theme == 'dark') {
            styles = darkStyles;
            images = themeImages.darkImages
        }else {
            styles = lightStyles;
            images = themeImages.lightImages
        }

        return (
            <Container>
                <Content contentContainerStyle={{ flexGrow: 1 }}>
                    <ImageBackground source={images.bg_splash} resizeMode={'cover'} style={styles.imageBackgroundStyle}>
                        <Image source={require('../../assets/images/dark_mode/small_logo_login.png')} style={styles.logoStyle} resizeMode={'contain'} />
                        <View style={styles.loginFormContainerStyle}>
                            <Button onPress={() => this.setTheme()} style={[ styles.loginBtn, styles.mt15]}>
                                <Text style={styles.btnTxt}>{ i18n.t('register') }</Text>
                            </Button>

                            <Button style={[ styles.loginBtn, styles.mt15]}>
                                <Text style={styles.btnTxt}>{ i18n.t('login') }</Text>
                            </Button>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = ({ theme }) => {
    return {
        theme: theme.theme
    };
};

export default connect(mapStateToProps, { chooseTheme })(LoginOrRegister);
