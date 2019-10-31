import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, I18nManager, Dimensions} from "react-native";
import {Container, Content, Form, Item, Input, Label, Button, Toast, CheckBox} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
// import { connect } from 'react-redux';
// import { userLogin, profile } from '../actions'
import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";
import {connect} from "react-redux";
import Modal from "react-native-modal";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const themeImages = {
    lightImages: {
        big_logo : require('../../assets/images/dark_mode/big_logo.png'),
        phone: require('../../assets/images/dark_mode/phone.png'),
    },
    darkImages: {
        big_logo : require('../../assets/images/dark_mode/big_logo.png'),
        phone: require('../../assets/images/dark_mode/phone.png'),
    }
}

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            phone: '',
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
            <Container>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Content contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.contentBackground}>
                        <View style={{ alignItems: 'center', marginTop: 100 }}>
                            <Image resizeMode={'contain'} source={images.big_logo} style={{ width: 120, height: 120, alignSelf: 'center' }} />
                        </View>
                        <Form style={{ width: '100%', paddingHorizontal: 40, marginTop: 70 }}>
                            <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                                <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                    <Label style={{ top:5,  paddingRight: 10, paddingLeft: 10, backgroundColor: colors.darkBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('phoneNumber') }</Label>
                                    <Input placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('phoneNumber') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                                </Item>
                                <Image source={images.phone} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                            </View>
                        </Form>

                        <View style={{ bottom: 25, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('activeCode')} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                    </View>
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

export default connect(mapStateToProps, {  })(Login);
