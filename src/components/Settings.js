import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Platform, I18nManager, Dimensions, FlatList, Slider} from "react-native";
import { Container, Content, Header, Left, Right, Body, Item, Switch, Picker } from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import themeImages from '../consts/Images'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class Settings extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: 1,
            SwitchOnValueHolder:true,
            SwitchOnValueHolder2:false,
            language:''
        }
    }


    static navigationOptions = () => ({
        drawerLabel:  i18n.t('settings')  ,
        drawerIcon: (<Image source={require('../../assets/images/light_mode/cog.png')} style={{width:29 , height:29}} resizeMode={'contain'} /> )
    })


    onChooseLang(lang) {
        this.setState({ language: lang });
    };

    stopNotification = (value) =>{
        this.setState({  SwitchOnValueHolder:!this.state.SwitchOnValueHolder})
    }
    stopBattery = (value) =>{
        this.setState({  SwitchOnValueHolder2:!this.state.SwitchOnValueHolder2})
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
                            <View style={{ marginTop: -40, height: height-125 , paddingHorizontal:20 }}>
                                <View style={{flexDirection:'row' , justifyContent:'space-between' , alignItems:'center'}}>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('mode') }</Text>

                                    <View style={{flexDirection:'row' , justifyContent:'center' , alignItems:'center'}}>
                                        <TouchableOpacity onPress={() => this.setState({ type: 1 })} style={{flexDirection:'row' , justifyContent:'center' , alignItems:'center' , padding:3 , backgroundColor:this.state.type == 1 ?colors.activeBG : colors.unActiveBG}}>
                                            <Image source={require('../../assets/images/dark_mode/dark_mode.png')} style={{ width: 20, height: 20 , marginRight:3}} resizeMode={'contain'} />
                                            <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 13 , color: colors.labelFont }}>{ i18n.t('night') }</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ type: 2 })} style={{flexDirection:'row' , justifyContent:'center' , alignItems:'center' , padding:3 , backgroundColor:this.state.type == 2 ?colors.activeBG : colors.unActiveBG}}>
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
                                        trackColor={colors.activeBG}
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

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('emergencyList')} style={{flexDirection:'row' , justifyContent:'space-between' , alignItems:'center'}}>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('emergencyList') }</Text>
                                </TouchableOpacity>

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
                                            selectedValue={this.state.language}
                                            onValueChange={(value) => this.onChooseLang(value)}
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

                                <TouchableOpacity style={{justifyContent:'space-between' , alignItems:'center' , alignSelf:'center' , marginTop:15}}>
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

export default Settings;
